import React from 'react';
import { 
  X, 
  BookOpen, 
  ShieldCheck, 
  Clock, 
  Cpu, 
  Terminal, 
  Database, 
  Smartphone, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  ExternalLink 
} from 'lucide-react';

interface BestWayGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenScraper: () => void;
  onOpenAlerts: () => void;
}

export const BestWayGuide: React.FC<BestWayGuideProps> = ({
  isOpen,
  onClose,
  onOpenScraper,
  onOpenAlerts
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/95">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                Architectural Blueprint: Best Way to Capture Indonesian Pre-Market Intelligence
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Complete engineering guide to IDX scraping, anti-blocking, PDF sanitization, and Firebase FCM delivery
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm flex-1 text-slate-300 leading-relaxed">
          {/* Executive Overview */}
          <div className="bg-emerald-950/30 border border-emerald-500/30 p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>The Optimal Pre-Market Architecture for Indonesia (Bursa Efek Indonesia)</span>
            </div>
            <p className="text-xs text-slate-300">
              To reliably obtain sorted, verified Indonesian market disclosures before market open and push updates to your mobile device without getting IP-blocked by IDX servers, you need a coordinated 5-layer pipeline:
            </p>
          </div>

          {/* Pillar 1: Market Timing Window */}
          <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-xl space-y-3">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              1. The Pre-Market Timing Window (Jakarta Time / WIB - UTC+7)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <strong className="text-amber-400 block font-mono">06:00 - 08:30 WIB</strong>
                <span className="text-slate-400 mt-1 block">
                  Listed companies submit overnight material disclosures, earnings reports, and corporate actions.
                </span>
              </div>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <strong className="text-emerald-400 block font-mono">08:45 - 08:55 WIB</strong>
                <span className="text-slate-400 mt-1 block">
                  <strong>Pre-Opening Session:</strong> Traders submit orders for LQ45 & IDX30 stocks. Price discovery begins.
                </span>
              </div>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <strong className="text-green-400 block font-mono">09:00 WIB</strong>
                <span className="text-slate-400 mt-1 block">
                  <strong>Continuous Regular Trading Opens:</strong> All pending market orders execute at opening price.
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              <strong>Key takeaway:</strong> The mobile push digest must be delivered at <strong>08:30 WIB</strong> so investors have 15 full minutes before the 08:45 WIB pre-opening book opens.
            </p>
          </div>

          {/* Pillar 2: Anti-Blocking & Rate Limiting */}
          <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-xl space-y-3">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              2. Overcoming IDX Anti-Bot Protection & Rate Limiting
            </h4>
            <p className="text-xs text-slate-300">
              The <code className="text-emerald-400">idx.co.id</code> portal is protected by Cloudflare and F5 BIG-IP firewalls that will swiftly issue HTTP 429 (Too Many Requests) or Cloudflare CAPTCHAs if bombarded.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Token Bucket Algorithm:</strong> Cap total outbound requests to 12-15 requests/minute with a maximum burst capacity of 3 tokens.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Randomized Jitter Sleep:</strong> Sleep for a randomized duration between 2.2 and 4.5 seconds (<code className="text-emerald-400 font-mono">random.uniform(2.2, 4.5)</code>) between calls so the traffic pattern appears indistinguishable from human browsing.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Header Spoofing & Session Persistence:</strong> Use <code className="text-emerald-400 font-mono">requests.Session()</code>, pass <code className="text-emerald-400 font-mono">Sec-Fetch-Dest: empty</code>, <code className="text-emerald-400 font-mono">Accept-Language: id-ID,id;q=0.9</code>, and genuine browser User-Agents.</span>
              </div>
            </div>
          </div>

          {/* Pillar 3: PDF Parsing & Cleaning */}
          <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-xl space-y-3">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              3. Handling Daily Scanned/Vector PDFs & Cleaning Metadata
            </h4>
            <p className="text-xs text-slate-300">
              Over 85% of IDX corporate disclosures are uploaded as PDF attachments (Surat Keterbukaan Informasi). Most contain 2-4 pages of boilerplate legal disclaimers:
            </p>
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-xs font-mono text-slate-400">
              - "PT Bursa Efek Indonesia tidak bertanggung jawab atas kebenaran..."<br />
              - "Surat ini disampaikan secara elektronik dan sah tanpa tanda tangan basah..."<br />
              - "Salinan surat ini disampaikan kepada Yth. Kepala Eksekutif Pengawas Pasar Modal OJK..."
            </div>
            <p className="text-xs text-slate-300">
              Our <code className="text-emerald-400 font-mono">IDXPDFParserAndCleaner</code> regex-strips these 8 boilerplate clauses, extracts key numbers (e.g. Dividend per share, buyback total, record date) and generates a clean, concise 3-sentence summary for your mobile lockscreen.
            </p>
          </div>

          {/* Pillar 4: Firebase Realtime & FCM Push */}
          <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-xl space-y-3">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-400" />
              4. Firebase Backend & Mobile Cloud Messaging (FCM)
            </h4>
            <p className="text-xs text-slate-300">
              Feeding data into Firebase provides two critical capabilities:
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">1.</span>
                <span><strong>Firestore Realtime Synchronicity:</strong> Client apps listen via <code className="text-emerald-400 font-mono">onSnapshot(collection(db, 'idx_disclosures'))</code>, rendering new announcements with zero-refresh sub-second latency.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">2.</span>
                <span><strong>FCM High-Priority Mobile Wake:</strong> For critical alerts (e.g. UMA or Suspensi), FCM dispatches an Android notification with <code className="text-emerald-400 font-mono">priority: 'high'</code> and iOS APNs <code className="text-emerald-400 font-mono">content_available: true</code> that awakens your phone screen and triggers a heads-up banner before market open.</span>
              </div>
            </div>
          </div>

          {/* Pillar 5: idx.co.id Cross-Check Guarantee */}
          <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-xl space-y-3">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              5. Live Cross-Check Against Official idx.co.id Registry
            </h4>
            <p className="text-xs text-slate-300">
              To eliminate false rumors and synthetic hallucinations, every parsed item is assigned a cryptographic checksum and verified against the official Bursa Efek Indonesia announcement reference number (e.g. <code className="text-slate-200 font-mono">Peng-SPT-00124/BEI.WAS/10-2026</code>), with direct one-click hyperlinks to the exchange's master portal.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenScraper}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition"
            >
              Open Python Scraper Lab
            </button>
            <button
              onClick={onOpenAlerts}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700"
            >
              Configure Mobile Alerts
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition text-xs"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
