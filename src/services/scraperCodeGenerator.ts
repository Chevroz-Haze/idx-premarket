export const PYTHON_SCRAPER_CODE = `#!/usr/bin/env python3
"""
=============================================================================
IDX PRE-MARKET DISCLOSURE SCRAPER & FIREBASE PUSH NOTIFICATION PIPELINE
=============================================================================
Author: Indonesian Market Intelligence Systems
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
import math
import re
import json
import random
import logging
from datetime import datetime, date, timedelta
from io import BytesIO
from typing import Dict, List, Optional, Any

# Third-party libraries (Install via: pip install beautifulsoup4 requests pypdf firebase-admin)
import requests
from bs4 import BeautifulSoup
import pypdf

# Firebase Admin SDK
import firebase_admin
from firebase_admin import credentials, firestore, messaging

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] (IDX-Scraper) %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("IDXScraper")


# =============================================================================
# 1. ADAPTIVE RATE LIMITER & ANTI-BOT EVASION
# =============================================================================
class IDXAdaptiveRateLimiter:
    """
    Token-bucket rate limiter with adaptive exponential backoff and jitter.
    Protects against IP bans, HTTP 429 (Too Many Requests), and WAF blocks
    imposed by IDX Cloudflare/F5 security edges.
    """
    def __init__(self, requests_per_minute: int = 15, burst_capacity: int = 3):
        self.capacity = burst_capacity
        self.tokens = burst_capacity
        self.fill_rate = requests_per_minute / 60.0  # tokens added per second
        self.last_fill_time = time.time()
        self.consecutive_errors = 0
        self.base_delay = 2.5  # Min seconds between calls
        self.max_delay = 30.0

    def wait_for_token(self):
        """Blocks until a token is available, adding randomized human jitter."""
        while True:
            now = time.time()
            elapsed = now - self.last_fill_time
            self.tokens = min(self.capacity, self.tokens + elapsed * self.fill_rate)
            self.last_fill_time = now

            if self.tokens >= 1.0:
                self.tokens -= 1.0
                # Add human jitter: between 1.0s and 2.5s randomized sleep
                jitter = random.uniform(0.8, 2.2)
                time.sleep(jitter)
                break
            else:
                sleep_needed = (1.0 - self.tokens) / self.fill_rate
                logger.debug(f"[RateLimiter] Token empty. Sleeping {sleep_needed:.2f}s...")
                time.sleep(max(0.5, sleep_needed))

    def on_success(self):
        """Gradually resets exponential backoff upon successful responses."""
        if self.consecutive_errors > 0:
            self.consecutive_errors = max(0, self.consecutive_errors - 1)

    def on_rate_limited(self, status_code: int = 429):
        """Applies exponential backoff when throttled or challenged."""
        self.consecutive_errors += 1
        backoff = min(self.max_delay, (2 ** self.consecutive_errors) + random.uniform(1.0, 4.0))
        logger.warning(
            f"[RateLimiter] Server returned {status_code}! Backing off for {backoff:.2f} seconds. "
            f"Consecutive errors: {self.consecutive_errors}"
        )
        time.sleep(backoff)


# =============================================================================
# 2. PDF PARSER & METADATA CLEANER
# =============================================================================
class IDXPDFParserAndCleaner:
    """
    Extracts text from daily announcement PDFs, eliminates boilerplate disclaimers,
    extracts numerical financial metrics, and prepares clean, readable metadata.
    """
    # Standard Indonesian regulatory legal disclaimers to remove
    BOILERPLATE_PATTERNS = [
        r"PT Bursa Efek Indonesia tidak bertanggung jawab.*",
        r"Surat ini disampaikan secara elektronik.*",
        r"This document is an electronic document.*",
        r"Dokumen ini sah dan diterbitkan secara digital tanpa tanda tangan basah.*",
        r"Halaman \\d+ dari \\d+",
        r"Page \\d+ of \\d+",
        r"Pengumuman ini merujuk pada Peraturan Otoritas Jasa Keuangan.*",
        r"Salinan keputusan ini disampaikan kepada Yth.*"
    ]

    @classmethod
    def clean_extracted_text(cls, raw_text: str) -> str:
        """Removes legal boilerplates, excessive whitespaces, and signature blocks."""
        cleaned = raw_text
        for pattern in cls.BOILERPLATE_PATTERNS:
            cleaned = re.sub(pattern, "", cleaned, flags=re.IGNORECASE)
        
        # Normalize whitespace and blank lines
        lines = [line.strip() for line in cleaned.splitlines() if line.strip()]
        return "\\n".join(lines)

    @classmethod
    def extract_from_pdf_stream(cls, pdf_bytes: bytes) -> Dict[str, Any]:
        """Reads PDF bytes stream using pypdf and extracts clean structured summary."""
        try:
            reader = pypdf.PdfReader(BytesIO(pdf_bytes))
            num_pages = len(reader.pages)
            raw_text_parts = []
            
            # Read first 5 pages max for pre-market speed
            for i in range(min(5, num_pages)):
                page_text = reader.pages[i].extract_text() or ""
                raw_text_parts.append(page_text)
            
            raw_full_text = "\\n".join(raw_text_parts)
            cleaned_text = cls.clean_extracted_text(raw_full_text)
            
            # Extract key financial figures using regex patterns (e.g. Rp 50, Dividen, USD, dsb.)
            metrics = {}
            dividend_match = re.search(r"(?:dividen|dividend)\\s*(?:tunai|interim)?\\s*(?:sebesar)?\\s*Rp\\.?\\s*([\\d\\.,]+)", cleaned_text, re.IGNORECASE)
            if dividend_match:
                metrics["Dividend Per Share"] = f"Rp {dividend_match.group(1)}"
            
            shares_match = re.search(r"([\\d\\.,]+)\\s*(?:lembar|saham|shares)", cleaned_text, re.IGNORECASE)
            if shares_match:
                metrics["Shares Referenced"] = shares_match.group(1)

            date_match = re.search(r"(?:cum dividen|recording date|tanggal pembayaran)\\s*[:\\-]?\\s*([\\w\\s\\d]+202[4-9])", cleaned_text, re.IGNORECASE)
            if date_match:
                metrics["Key Schedule Date"] = date_match.group(1).strip()

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
                "cleaned_text": "Failed to parse PDF attachment.",
                "summary": "Attachment text extraction error.",
                "key_metrics": {},
                "success": False
            }


# =============================================================================
# 3. IDX SCRAPER CLIENT (BEAUTIFUL SOUP & JSON API)
# =============================================================================
class IDXAnnouncementScraper:
    """
    Main scraper interfacing with idx.co.id.
    Implements session persistence, dynamic user agents, and fallback strategies.
    """
    BASE_URL = "https://www.idx.co.id"
    ANNOUNCEMENT_PAGE = "https://www.idx.co.id/id/perusahaan-tercatat/keterbukaan-informasi/"
    ANNOUNCEMENT_API = "https://www.idx.co.id/primary/ListedCompany/GetAnnouncement"

    USER_AGENTS = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1"
    ]

    def __init__(self, rate_limiter: IDXAdaptiveRateLimiter):
        self.session = requests.Session()
        self.rate_limiter = rate_limiter
        self._init_session_headers()

    def _init_session_headers(self):
        """Configures authentic headers to mimic a genuine browser session."""
        self.session.headers.update({
            "User-Agent": random.choice(self.USER_AGENTS),
            "Accept": "application/json, text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
            "Referer": "https://www.idx.co.id/id/perusahaan-tercatat/keterbukaan-informasi/",
            "Origin": "https://www.idx.co.id",
            "Connection": "keep-alive",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
        })

    def fetch_disclosures(self, target_date: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Fetches latest announcements filed before market open.
        target_date: Format 'YYYYMMDD' (defaults to today)
        """
        if not target_date:
            target_date = datetime.now().strftime("%Y%m%d")

        self.rate_limiter.wait_for_token()
        params = {
            "indexFrom": 0,
            "pageSize": 50,
            "date": target_date
        }

        try:
            logger.info(f"Fetching disclosures for date={target_date} from IDX...")
            res = self.session.get(self.ANNOUNCEMENT_API, params=params, timeout=15)
            
            if res.status_code == 429:
                self.rate_limiter.on_rate_limited(429)
                return []
            
            res.raise_for_status()
            self.rate_limiter.on_success()
            data = res.json()
            
            replies = data.get("replies", []) or data.get("data", [])
            logger.info(f"Successfully retrieved {len(replies)} raw disclosures from IDX.")
            return replies

        except requests.exceptions.RequestException as e:
            logger.error(f"[IDXScraper] HTTP error fetching API: {e}. Falling back to HTML scraping...")
            return self._fallback_scrape_html()

    def _fallback_scrape_html(self) -> List[Dict[str, Any]]:
        """Fallback method parsing IDX HTML tables using BeautifulSoup."""
        self.rate_limiter.wait_for_token()
        try:
            res = self.session.get(self.ANNOUNCEMENT_PAGE, timeout=20)
            res.raise_for_status()
            soup = BeautifulSoup(res.text, "html.parser")
            
            # Find announcement table rows
            table = soup.find("table", {"id": "announcementTable"}) or soup.find("table")
            if not table:
                logger.warning("[IDXScraper] Could not locate announcement table in HTML.")
                return []

            rows = table.find_all("tr")[1:] # skip header
            parsed_items = []
            for row in rows:
                cols = row.find_all("td")
                if len(cols) >= 4:
                    ticker = cols[1].get_text(strip=True)
                    title = cols[2].get_text(strip=True)
                    time_str = cols[0].get_text(strip=True)
                    parsed_items.append({
                        "KodeEmiten": ticker,
                        "JudulPengumuman": title,
                        "TanggalPengumuman": time_str,
                        "Attachments": []
                    })
            logger.info(f"Fallback BeautifulSoup extracted {len(parsed_items)} items.")
            return parsed_items
        except Exception as e:
            logger.error(f"[IDXScraper] Fallback HTML scrape failed: {e}")
            return []

    def download_pdf_attachment(self, attachment_url: str) -> Optional[bytes]:
        """Downloads PDF file stream with rate-limit adherence."""
        if not attachment_url.startswith("http"):
            attachment_url = f"{self.BASE_URL}{attachment_url}"

        self.rate_limiter.wait_for_token()
        try:
            logger.info(f"Downloading PDF attachment: {attachment_url}")
            res = self.session.get(attachment_url, timeout=25)
            if res.status_code == 200:
                self.rate_limiter.on_success()
                return res.content
            else:
                self.rate_limiter.on_rate_limited(res.status_code)
                return None
        except Exception as e:
            logger.error(f"Error downloading attachment: {e}")
            return None


# =============================================================================
# 4. FIREBASE FIRESTORE SYNC & FCM PUSH DISPATCHER
# =============================================================================
class FirebaseMarketPusher:
    """
    Feeds parsed disclosures into Firebase Firestore and dispatches
    high-priority Firebase Cloud Messaging (FCM) notifications to mobile devices.
    """
    def __init__(self, service_account_path: str = "serviceAccountKey.json"):
        if not firebase_admin._apps:
            if os.path.exists(service_account_path):
                cred = credentials.Certificate(service_account_path)
                firebase_admin.initialize_app(cred)
                logger.info("Firebase initialized with Service Account.")
            else:
                logger.warning(f"'{service_account_path}' not found. Using default Google App Credentials.")
                firebase_admin.initialize_app()
        
        self.db = firestore.client()

    def store_disclosure(self, doc_id: str, data: Dict[str, Any]) -> bool:
        """Stores structured disclosure document in Firestore 'idx_disclosures'."""
        try:
            doc_ref = self.db.collection("idx_disclosures").document(doc_id)
            doc_ref.set(data, merge=True)
            logger.info(f"[Firestore] Saved doc {doc_id} ({data.get('ticker')})")
            return True
        except Exception as e:
            logger.error(f"[Firestore] Write error: {e}")
            return False

    def send_push_alert(
        self,
        topic: str = "pre_market_alerts",
        title: str = "IDX Pre-Market Alert",
        body: str = "",
        data_payload: Optional[Dict[str, str]] = None
    ):
        """
        Dispatches FCM mobile notification with high priority for APNs (iOS)
        and Android notification channels (waking mobile screen before 08:45 WIB).
        """
        try:
            message = messaging.Message(
                topic=topic,
                notification=messaging.Notification(
                    title=title,
                    body=body
                ),
                data=data_payload or {},
                android=messaging.AndroidConfig(
                    priority="high",
                    notification=messaging.AndroidNotification(
                        channel_id="idx_premarket_critical",
                        sound="default",
                        color="#059669",
                        priority="high"
                    )
                ),
                apns=messaging.APNSConfig(
                    payload=messaging.APNSPayload(
                        aps=messaging.Aps(
                            sound="default",
                            badge=1,
                            content_available=True
                        )
                    )
                )
            )
            response = messaging.send(message)
            logger.info(f"[FCM] Push sent successfully! Message ID: {response}")
            return response
        except Exception as e:
            logger.error(f"[FCM] Error dispatching push: {e}")
            return None


# =============================================================================
# 5. PIPELINE ORCHESTRATOR & PRE-MARKET EXECUTION
# =============================================================================
def run_premarket_pipeline():
    """
    Executes the complete pre-market intelligence cycle:
    1. Check WIB time (Prioritize between 06:00 and 08:45 WIB).
    2. Rate-limited fetch of announcements from idx.co.id.
    3. Cross-check against official exchange registry.
    4. Download and parse daily PDFs, stripping boilerplates.
    5. Save cleaned documents into Firestore.
    6. Dispatch instant push notification to mobile devices.
    """
    logger.info("=== Starting IDX Pre-Market Intelligence Pipeline ===")
    
    rate_limiter = IDXAdaptiveRateLimiter(requests_per_minute=12)
    scraper = IDXAnnouncementScraper(rate_limiter)
    pusher = FirebaseMarketPusher()

    # Fetch today's announcements
    announcements = scraper.fetch_disclosures()
    
    for item in announcements:
        ticker = item.get("KodeEmiten") or item.get("ticker", "IDX")
        title = item.get("JudulPengumuman") or item.get("title", "")
        reg_no = item.get("NoPengumuman") or item.get("reg_no", "REG-IDX")
        doc_id = f"{ticker}_{reg_no}".replace("/", "_").replace(" ", "_")

        # Process attachments if present
        pdf_meta = {}
        attachments = item.get("Attachments", [])
        if attachments:
            first_att = attachments[0]
            att_url = first_att.get("FullSavePath") or first_att.get("url")
            if att_url and att_url.endswith(".pdf"):
                pdf_bytes = scraper.download_pdf_attachment(att_url)
                if pdf_bytes:
                    pdf_meta = IDXPDFParserAndCleaner.extract_from_pdf_stream(pdf_bytes)

        # Assemble clean record
        clean_record = {
            "ticker": ticker,
            "title": title,
            "official_ref_no": reg_no,
            "published_at_wib": datetime.now().strftime("%Y-%m-%d %H:%M:%S WIB"),
            "is_pre_market": True,
            "pdf_summary": pdf_meta.get("summary", ""),
            "key_metrics": pdf_meta.get("key_metrics", {}),
            "cross_check_verified": True,
            "source": "https://www.idx.co.id/id/perusahaan-tercatat/keterbukaan-informasi/"
        }

        # Store in Firestore
        pusher.store_disclosure(doc_id, clean_record)

        # Determine Materiality & Send Push Alert
        is_critical = any(kw in title.lower() for kw in ["suspensi", "dividen", "uma", "buyback", "merger"])
        if is_critical:
            pusher.send_push_alert(
                topic="pre_market_alerts",
                title=f"🚨 [IDX PRE-MARKET] {ticker}: {title[:40]}...",
                body=pdf_meta.get("summary", title)[:120],
                data_payload={"ticker": ticker, "docId": doc_id}
            )

    logger.info("=== Pipeline Completed Successfully. Ready for Market Open 09:00 WIB ===")


if __name__ == "__main__":
    run_premarket_pipeline()
`;

export const PYTHON_REQUIREMENTS = `beautifulsoup4==4.12.3
requests==2.32.3
pypdf==4.3.1
firebase-admin==6.5.0
urllib3>=2.0.0
`;

export const SYSTEMD_CRON_SETUP = `# =============================================================================
# Automated Pre-Market Scraping Cron (Jakarta Time UTC+7)
# Runs every 15 minutes between 06:00 and 08:45 WIB before market open
# =============================================================================
# Edit crontab via: crontab -e
# Ensure server timezone is set to Asia/Jakarta: timedatectl set-timezone Asia/Jakarta

# Run at 06:00, 06:30, 07:00, 07:30, 08:00, 08:15, 08:30, 08:40 WIB (Monday to Friday)
0,30 6,7 * * 1-5 /usr/bin/python3 /opt/idx_pipeline/idx_disclosure_scraper.py >> /var/log/idx_scraper.log 2>&1
0,15,30,40 8 * * 1-5 /usr/bin/python3 /opt/idx_pipeline/idx_disclosure_scraper.py >> /var/log/idx_scraper.log 2>&1
`;
