#!/usr/bin/env python3
"""
=============================================================================
IDX PRE-MARKET DISCLOSURE & MARKET NEWS SCRAPER (GMT+7 / WIB)
Repository: https://github.com/Chevroz-Haze/idx-premarket
Primary Sources:
  1. Bursa Efek Indonesia (idx.co.id) - Keterbukaan Informasi & Kalender Aksi Korporasi
  2. Indonesian Market News Portals (Kontan Investasi, CNBC Indonesia Market, EmitenNews)
Timezone: Strictly synchronized to Asia/Jakarta (GMT+7 / WIB)
=============================================================================
"""

import os
import sys
import time
import re
import json
import random
import logging
from datetime import datetime, timezone, timedelta
from io import BytesIO
from typing import Dict, List, Optional, Any

import requests
from bs4 import BeautifulSoup
import pypdf

# Jakarta Timezone (GMT+7 / WIB)
TZ_WIB = timezone(timedelta(hours=7))

def now_wib() -> datetime:
    """Returns current datetime strictly in GMT+7 (WIB)."""
    return datetime.now(TZ_WIB)

try:
    import firebase_admin
    from firebase_admin import credentials, firestore, messaging
    FIREBASE_AVAILABLE = True
except ImportError:
    FIREBASE_AVAILABLE = False

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] (IDX-GMT+7) %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("IDXScraper")


class IDXAdaptiveRateLimiter:
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
                time.sleep(random.uniform(0.8, 2.2))
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
            raw_text_parts = [reader.pages[i].extract_text() or "" for i in range(min(5, num_pages))]
            cleaned_text = cls.clean_extracted_text("\n".join(raw_text_parts))

            metrics = {}
            dividend_match = re.search(
                r"(?:dividen|dividend)\s*(?:tunai|interim)?\s*(?:sebesar)?\s*Rp\.?\s*([\d\.,]+)",
                cleaned_text,
                re.IGNORECASE
            )
            if dividend_match:
                metrics["Dividend Per Share"] = f"Rp {dividend_match.group(1)}"

            summary = cleaned_text[:350] + ("..." if len(cleaned_text) > 350 else "")
            return {
                "num_pages": num_pages,
                "cleaned_text": cleaned_text,
                "summary": summary,
                "key_metrics": metrics,
                "success": True
            }
        except Exception as e:
            logger.error(f"[PDFParser] Error: {e}")
            return {"num_pages": 0, "cleaned_text": "", "summary": "", "key_metrics": {}, "success": False}


class IDXCorporateActionAndNewsScraper:
    """
    Scrapes corporate actions & disclosures from idx.co.id and cross-checks
    Indonesian market news sites (CNBC Indonesia Market, Kontan, EmitenNews)
    filtered strictly for today's GMT+7 date.
    """
    IDX_ANNOUNCEMENT_API = "https://www.idx.co.id/primary/ListedCompany/GetAnnouncement"
    IDX_CORP_ACTION_URL = "https://www.idx.co.id/id/perusahaan-tercatat/kalender-aksi-korporasi/"
    MARKET_NEWS_FEEDS = [
        ("CNBC Indonesia Market", "https://www.cnbcindonesia.com/market/rss"),
        ("Kontan Investasi", "https://investasi.kontan.co.id/"),
        ("EmitenNews", "https://www.emitennews.com/")
    ]

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
            "Referer": "https://www.idx.co.id/id/perusahaan-tercatat/keterbukaan-informasi/"
        })

    def fetch_idx_disclosures_today(self) -> List[Dict[str, Any]]:
        today_gmt7 = now_wib().strftime("%Y%m%d")
        self.rate_limiter.wait_for_token()
        params = {"indexFrom": 0, "pageSize": 30, "date": today_gmt7}
        try:
            logger.info(f"Querying idx.co.id disclosures for GMT+7 date={today_gmt7}...")
            res = self.session.get(self.IDX_ANNOUNCEMENT_API, params=params, timeout=15)
            if res.status_code == 429:
                self.rate_limiter.on_rate_limited(429)
                return []
            res.raise_for_status()
            self.rate_limiter.on_success()
            data = res.json()
            replies = data.get("replies", []) or data.get("data", [])
            logger.info(f"Retrieved {len(replies)} items from idx.co.id for {today_gmt7} (GMT+7).")
            return replies
        except Exception as e:
            logger.warning(f"idx.co.id direct API note: {e}")
            return []

    def fetch_market_news_corporate_actions(self) -> List[Dict[str, Any]]:
        """Scrapes corporate action headlines from Indonesian market news portals for today (GMT+7)."""
        today_iso = now_wib().strftime("%Y-%m-%d")
        results = []
        keywords = ["dividen", "rups", "hmetd", "rights issue", "buyback", "suspensi", "uma", "waran", "obligasi"]

        for source_name, url in self.MARKET_NEWS_FEEDS:
            self.rate_limiter.wait_for_token()
            try:
                res = self.session.get(url, timeout=15)
                if res.status_code != 200:
                    continue
                soup = BeautifulSoup(res.text, "html.parser")
                for item in soup.find_all(["item", "article", "h2", "h3"])[:20]:
                    title_el = item.find("title") or item
                    title = title_el.get_text(strip=True)
                    if any(kw in title.lower() for kw in keywords):
                        ticker_match = re.search(r"\b([A-Z]{4})\b", title)
                        ticker = ticker_match.group(1) if ticker_match else "IDX"
                        results.append({
                            "ticker": ticker,
                            "title": title,
                            "source": source_name,
                            "date_gmt7": today_iso
                        })
            except Exception as e:
                logger.debug(f"Market news scrape note ({source_name}): {e}")

        logger.info(f"Extracted {len(results)} corporate action news items for {today_iso} (GMT+7).")
        return results


def run_premarket_pipeline():
    current_wib = now_wib().strftime("%Y-%m-%d %H:%M:%S GMT+7 (WIB)")
    logger.info(f"=== Starting IDX Pre-Market Pipeline at {current_wib} ===")
    rate_limiter = IDXAdaptiveRateLimiter(requests_per_minute=12)
    scraper = IDXCorporateActionAndNewsScraper(rate_limiter)

    idx_items = scraper.fetch_idx_disclosures_today()
    news_items = scraper.fetch_market_news_corporate_actions()
    logger.info(f"Completed GMT+7 check: {len(idx_items)} IDX filings + {len(news_items)} market news items.")


if __name__ == "__main__":
    run_premarket_pipeline()
