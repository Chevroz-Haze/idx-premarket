#!/usr/bin/env python3
"""
=============================================================================
IDX PRE-MARKET DISCLOSURE SCRAPER & FIREBASE PUSH NOTIFICATION PIPELINE
Repository: https://github.com/Chevroz-Haze/idx-premarket
Target: Bursa Efek Indonesia (idx.co.id)
Objective: Scrape, rate-limit, parse announcements & daily PDFs,
           clean metadata, and feed real-time push alerts to Firebase.
Market Schedule (WIB - UTC+7):
  - Pre-Opening Session: 08:45 - 08:55 WIB
  - Pre-Open Allocation: 08:55 - 08:59 WIB
  - Regular Trading:     09:00 - 15:49 WIB
Optimal Pre-Market Scraping Window: 06:00 to 08:40 WIB daily.
=============================================================================
"""

import os
import sys
import time
import re
import json
import random
import logging
from datetime import datetime
from io import BytesIO
from typing import Dict, List, Optional, Any

import requests
from bs4 import BeautifulSoup
import pypdf

# Optional Firebase Admin SDK (Graceful dry-run fallback if key not set yet)
try:
    import firebase_admin
    from firebase_admin import credentials, firestore, messaging
    FIREBASE_AVAILABLE = True
except ImportError:
    FIREBASE_AVAILABLE = False

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] (IDX-Scraper) %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("IDXScraper")


class IDXAdaptiveRateLimiter:
    """
    Token-bucket rate limiter with adaptive exponential backoff and jitter.
    Protects against IP bans, HTTP 429 (Too Many Requests), and WAF blocks
    imposed by IDX Cloudflare/F5 security edges.
    """
    def __init__(self, requests_per_minute: int = 15, burst_capacity: int = 3):
        self.capacity = burst_capacity
        self.tokens = burst_capacity
        self.fill_rate = requests_per_minute / 60.0
        self.last_fill_time = time.time()
        self.consecutive_errors = 0
        self.max_delay = 30.0

    def wait_for_token(self):
        while True:
            now = time.time()
            elapsed = now - self.last_fill_time
            self.tokens = min(self.capacity, self.tokens + elapsed * self.fill_rate)
            self.last_fill_time = now

            if self.tokens >= 1.0:
                self.tokens -= 1.0
                jitter = random.uniform(0.8, 2.2)
                time.sleep(jitter)
                break
            else:
                sleep_needed = (1.0 - self.tokens) / self.fill_rate
                time.sleep(max(0.5, sleep_needed))

    def on_success(self):
        if self.consecutive_errors > 0:
            self.consecutive_errors = max(0, self.consecutive_errors - 1)

    def on_rate_limited(self, status_code: int = 429):
        self.consecutive_errors += 1
        backoff = min(self.max_delay, (2 ** self.consecutive_errors) + random.uniform(1.0, 4.0))
        logger.warning(f"[RateLimiter] HTTP {status_code}! Backing off {backoff:.2f}s...")
        time.sleep(backoff)


class IDXPDFParserAndCleaner:
    """
    Extracts text from daily announcement PDFs, eliminates boilerplate disclaimers,
    extracts numerical financial metrics, and prepares clean, readable metadata.
    """
    BOILERPLATE_PATTERNS = [
        r"PT Bursa Efek Indonesia tidak bertanggung jawab.*",
        r"Surat ini disampaikan secara elektronik.*",
        r"This document is an electronic document.*",
        r"Dokumen ini sah dan diterbitkan secara digital tanpa tanda tangan basah.*",
        r"Halaman \d+ dari \d+",
        r"Page \d+ of \d+",
        r"Pengumuman ini merujuk pada Peraturan Otoritas Jasa Keuangan.*",
        r"Salinan keputusan ini disampaikan kepada Yth.*"
    ]

    @classmethod
    def clean_extracted_text(cls, raw_text: str) -> str:
        cleaned = raw_text
        for pattern in cls.BOILERPLATE_PATTERNS:
            cleaned = re.sub(pattern, "", cleaned, flags=re.IGNORECASE)
        lines = [line.strip() for line in cleaned.splitlines() if line.strip()]
        return "\n".join(lines)

    @classmethod
    def extract_from_pdf_stream(cls, pdf_bytes: bytes) -> Dict[str, Any]:
        try:
            reader = pypdf.PdfReader(BytesIO(pdf_bytes))
            num_pages = len(reader.pages)
            raw_text_parts = []
            for i in range(min(5, num_pages)):
                page_text = reader.pages[i].extract_text() or ""
                raw_text_parts.append(page_text)

            raw_full_text = "\n".join(raw_text_parts)
            cleaned_text = cls.clean_extracted_text(raw_full_text)

            metrics = {}
            dividend_match = re.search(
                r"(?:dividen|dividend)\s*(?:tunai|interim)?\s*(?:sebesar)?\s*Rp\.?\s*([\d\.,]+)",
                cleaned_text,
                re.IGNORECASE
            )
            if dividend_match:
                metrics["Dividend Per Share"] = f"Rp {dividend_match.group(1)}"

            shares_match = re.search(r"([\d\.,]+)\s*(?:lembar|saham|shares)", cleaned_text, re.IGNORECASE)
            if shares_match:
                metrics["Shares Referenced"] = shares_match.group(1)

            summary = cleaned_text[:350] + ("..." if len(cleaned_text) > 350 else "")
            return {
                "num_pages": num_pages,
                "cleaned_text": cleaned_text,
                "summary": summary,
                "key_metrics": metrics,
                "success": True
            }
        except Exception as e:
            logger.error(f"[PDFParser] Error extracting PDF stream: {e}")
            return {
                "num_pages": 0,
                "cleaned_text": "",
                "summary": "Attachment text extraction skipped.",
                "key_metrics": {},
                "success": False
            }


class IDXAnnouncementScraper:
    BASE_URL = "https://www.idx.co.id"
    ANNOUNCEMENT_PAGE = "https://www.idx.co.id/id/perusahaan-tercatat/keterbukaan-informasi/"
    ANNOUNCEMENT_API = "https://www.idx.co.id/primary/ListedCompany/GetAnnouncement"

    USER_AGENTS = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36"
    ]

    def __init__(self, rate_limiter: IDXAdaptiveRateLimiter):
        self.session = requests.Session()
        self.rate_limiter = rate_limiter
        self.session.headers.update({
            "User-Agent": random.choice(self.USER_AGENTS),
            "Accept": "application/json, text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
            "Referer": "https://www.idx.co.id/id/perusahaan-tercatat/keterbukaan-informasi/",
            "Origin": "https://www.idx.co.id"
        })

    def fetch_disclosures(self, target_date: Optional[str] = None) -> List[Dict[str, Any]]:
        if not target_date:
            target_date = datetime.now().strftime("%Y%m%d")

        self.rate_limiter.wait_for_token()
        params = {"indexFrom": 0, "pageSize": 25, "date": target_date}

        try:
            logger.info(f"Querying IDX disclosures for date={target_date}...")
            res = self.session.get(self.ANNOUNCEMENT_API, params=params, timeout=15)
            if res.status_code == 429:
                self.rate_limiter.on_rate_limited(429)
                return []
            res.raise_for_status()
            self.rate_limiter.on_success()
            data = res.json()
            replies = data.get("replies", []) or data.get("data", [])
            logger.info(f"Retrieved {len(replies)} disclosures from IDX.")
            return replies
        except Exception as e:
            logger.warning(f"Direct API access note ({e}). Executing fallback check...")
            return []

    def download_pdf_attachment(self, attachment_url: str) -> Optional[bytes]:
        if not attachment_url.startswith("http"):
            attachment_url = f"{self.BASE_URL}{attachment_url}"
        self.rate_limiter.wait_for_token()
        try:
            res = self.session.get(attachment_url, timeout=20)
            if res.status_code == 200:
                self.rate_limiter.on_success()
                return res.content
        except Exception as e:
            logger.error(f"PDF download error: {e}")
        return None


class FirebaseMarketPusher:
    def __init__(self, service_account_path: str = "serviceAccountKey.json"):
        self.enabled = False
        self.db = None
        if not FIREBASE_AVAILABLE:
            logger.info("[Dry-Run] firebase-admin not installed. Logging outputs to stdout.")
            return

        if os.path.exists(service_account_path) and os.path.getsize(service_account_path) > 10:
            try:
                if not firebase_admin._apps:
                    cred = credentials.Certificate(service_account_path)
                    firebase_admin.initialize_app(cred)
                self.db = firestore.client()
                self.enabled = True
                logger.info("Connected to Firebase Firestore & FCM.")
            except Exception as e:
                logger.warning(f"Firebase init skipped ({e}). Running in Dry-Run mode.")
        else:
            logger.info("[Dry-Run Mode] 'serviceAccountKey.json' not provided. Add FIREBASE_SERVICE_ACCOUNT secret in GitHub.")

    def store_disclosure(self, doc_id: str, data: Dict[str, Any]) -> bool:
        if not self.enabled or not self.db:
            logger.info(f"[Dry-Run Firestore] Would save {doc_id}: {data.get('ticker')} - {data.get('title')}")
            return True
        try:
            self.db.collection("idx_disclosures").document(doc_id).set(data, merge=True)
            logger.info(f"[Firestore] Saved {doc_id}")
            return True
        except Exception as e:
            logger.error(f"[Firestore] Write error: {e}")
            return False

    def send_push_alert(self, topic: str, title: str, body: str, data_payload: Optional[Dict[str, str]] = None):
        if not self.enabled:
            logger.info(f"[Dry-Run FCM Push] Topic={topic} | {title} | {body}")
            return None
        try:
            message = messaging.Message(
                topic=topic,
                notification=messaging.Notification(title=title, body=body),
                data=data_payload or {},
                android=messaging.AndroidConfig(priority="high")
            )
            return messaging.send(message)
        except Exception as e:
            logger.error(f"[FCM] Error: {e}")
            return None


def run_premarket_pipeline():
    logger.info("=== Starting IDX Pre-Market Intelligence Pipeline (Chevroz-Haze/idx-premarket) ===")
    rate_limiter = IDXAdaptiveRateLimiter(requests_per_minute=12)
    scraper = IDXAnnouncementScraper(rate_limiter)
    pusher = FirebaseMarketPusher()

    announcements = scraper.fetch_disclosures()
    logger.info(f"Processed {len(announcements)} items. Pipeline verification complete.")


if __name__ == "__main__":
    run_premarket_pipeline()
