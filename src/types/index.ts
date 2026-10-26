export type MaterialityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFORMATIONAL';

export type DisclosureCategory =
  | 'CORPORATE_ACTION'
  | 'BULLISH_HIGH_VOLUME'
  | 'SUSPENSION_UMA'
  | 'FINANCIAL_REPORT'
  | 'RUPS_PUBLIC_EXPOSE'
  | 'MATERIAL_INFORMATION'
  | 'INSIDER_TRANSACTION';

export interface CleanedMetadata {
  companyName: string;
  ticker: string;
  isinCode?: string;
  sector: string;
  subSector: string;
  officialRegNo: string;
  submissionDateWIB: string;
  publishedDateWIB: string;
  isPreMarket: boolean; // Submitted between 16:30 (prev day) and 08:45 (today)
  pdfFileName: string;
  pdfFileSizeKb: number;
  pdfPages: number;
  extractedSummary: string;
  cleanedText: string;
  keyMetrics?: { [key: string]: string | number };
  rawDisclaimersStripped: number; // Count of boilerplate lines removed
}

export interface IDXAnnouncement {
  id: string;
  ticker: string;
  companyName: string;
  category: DisclosureCategory;
  materiality: MaterialityLevel;
  title: string;
  summary: string;
  timestampWIB: string;
  dateStr: string; // YYYY-MM-DD
  timeStr: string; // HH:mm:ss
  isPreMarket: boolean;
  officialRefNo: string;
  idxUrl: string;
  crossCheckVerified: boolean;
  idxHash: string;
  pdfMetadata: CleanedMetadata;
  tags: string[];
}

export type NotificationFrequency =
  | 'IMMEDIATE'
  | 'PRE_MARKET_DIGEST_0830'
  | 'HOURLY_PRE_OPEN'
  | 'HIGH_IMPACT_ONLY';

export interface AlertPreferences {
  frequency: NotificationFrequency;
  enableMobilePush: boolean;
  enableBrowserNotifications: boolean;
  enableTelegramWebhook: boolean;
  telegramChatId: string;
  fcmDeviceToken: string;
  minMateriality: MaterialityLevel;
  watchlistOnly: boolean;
  watchlistTickers: string[];
  alertCategories: { [key in DisclosureCategory]: boolean };
  soundAlert: boolean;
  vibrationPattern: boolean;
  preMarketDigestTime: string; // e.g. "08:30"
}

export interface ScraperTelemetry {
  status: 'IDLE' | 'RUNNING' | 'RATE_LIMITED' | 'SUCCESS' | 'ERROR';
  requestsMade: number;
  tokensRemaining: number;
  maxBucketSize: number;
  currentDelayMs: number;
  lastHttpCode: number;
  itemsParsed: number;
  pdfsProcessed: number;
  firebaseDocsPushed: number;
  fcmAlertsDispatched: number;
  logs: ScraperLog[];
}

export interface ScraperLog {
  id: string;
  time: string;
  level: 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR';
  message: string;
}

export interface MarketSessionInfo {
  currentWibTime: string;
  currentWibDate: string;
  status: 'PRE_MARKET' | 'PRE_OPEN' | 'SESSION_1' | 'BREAK' | 'SESSION_2' | 'POST_MARKET' | 'CLOSED';
  statusLabel: string;
  nextMilestone: string;
  countdownSeconds: number;
  countdownFormatted: string;
  isTradingDay: boolean;
}
