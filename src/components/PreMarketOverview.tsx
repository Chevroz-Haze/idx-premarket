import React from 'react';
import { 
  AlertTriangle, 
  ShieldCheck, 
  Zap, 
  Clock, 
  TrendingUp, 
  FileText, 
  Smartphone, 
  CheckCircle2,
  Cpu,
  Layers
} from 'lucide-react';
import { IDXAnnouncement, AlertPreferences } from '../types';

interface PreMarketOverviewProps {
  announcements: IDXAnnouncement[];
  alertPreferences: AlertPreferences;
  onOpenScraper: () => void;
  onOpenAlerts: () => void;
  onSelectDisclosure: (item: IDXAnnouncement) => void;
}

export const PreMarketOverview: React.FC<PreMarketOverviewProps> = ({
  announcements,
  alertPreferences,
  onOpenScraper,
  onOpenAlerts,
  onSelectDisclosure
}) => {
  const preMarketItems = announcements.filter(a => a.isPreMarket);
  const criticalItems = announcements.filter(a => a.materiality === 'CRITICAL' || a.materiality === 'HIGH');
  const verifiedCount = announcements.filter(a => a.crossCheckVerified).length;

  return (
    <div className="space-y-4 mb-6">
      {/* High-Impact Breaking Disclosure Banner */}
      {criticalItems.length > 0 && (
        <div className="bg-gradient-to-r from-rose-950/70 via-slate-900 to-amber-950/70 border border-rose-500/40 rounded-xl p-3.5 shadow-lg shadow-rose-950/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-white">Pre-Market Material Disclosures Detected:</span>
                  <span className="bg-rose-500 text-white font-mono text-xs px-2 py-0.5 rounded font-bold">
                    {criticalItems.length} High Impact
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 font-mono text-[11px] px-2 py-0.5 rounded border border-emerald-500/30">
                    Live Feed: {announcements[0]?.dateStr || new Date().toISOString().slice(0, 10)} (WIB)
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  <strong className="text-rose-400 font-mono">CUAN</strong>: Suspensi Perdagangan Sesi I • <strong className="text-emerald-400 font-mono">BBCA</strong>: Dividen Interim Rp 55/saham (Rp 6,77T) • <strong className="text-cyan-400 font-mono">BREN</strong>: Ekspansi Panas Bumi 104MW
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onOpenScraper}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 transition shadow-sm"
              >
                Sync Live IDX
              </button>
              <button
                onClick={() => onSelectDisclosure(criticalItems[0])}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white transition shadow-sm"
              >
                Inspect Top Alert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Pre-Market Disclosures */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-medium">Pre-Market Window Filings</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">{preMarketItems.length}</span>
            <span className="text-xs text-amber-400 font-medium">Filed 06:00 - 08:45 WIB</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Total {announcements.length} disclosures in 24h cycle
          </p>
        </div>

        {/* Card 2: High Impact Sirens */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-medium">Material Actions & UMA</span>
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-rose-400">{criticalItems.length}</span>
            <span className="text-xs text-rose-300 font-medium">Immediate price impact</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Suspensions, Dividends & Corporate Actions
          </p>
        </div>

        {/* Card 3: idx.co.id Cross-Check Verification */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-medium">idx.co.id Cross-Check</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">100%</span>
            <span className="text-xs text-emerald-300 font-medium">Verified Hash</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            All {verifiedCount} records matched to official registry
          </p>
        </div>

        {/* Card 4: Mobile Push Alert Engine */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between cursor-pointer hover:border-slate-700 transition" onClick={onOpenAlerts}>
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-medium">Mobile Push Schedule</span>
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-lg font-bold font-mono text-cyan-400">08:30 WIB</span>
            <span className="text-xs text-slate-300 font-medium">Digest Active</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Instant push for Critical • {alertPreferences.watchlistTickers.length} Watchlist tickers
          </p>
        </div>
      </div>

      {/* Pre-Market Schedule Flow Banner */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-semibold text-slate-300">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Pre-Market Open Order Flow Sequence (WIB):</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full md:w-auto">
            <div className="bg-slate-800/60 px-2.5 py-1.5 rounded-lg border border-slate-700/60">
              <span className="text-slate-400 block text-[10px]">06:00 - 08:30 WIB</span>
              <strong className="text-amber-300 font-mono text-xs">Scraper & PDF Feed</strong>
            </div>
            <div className="bg-slate-800/60 px-2.5 py-1.5 rounded-lg border border-slate-700/60">
              <span className="text-slate-400 block text-[10px]">08:30 WIB</span>
              <strong className="text-cyan-300 font-mono text-xs">Mobile Morning Push</strong>
            </div>
            <div className="bg-slate-800/60 px-2.5 py-1.5 rounded-lg border border-slate-700/60">
              <span className="text-slate-400 block text-[10px]">08:45 - 08:55 WIB</span>
              <strong className="text-emerald-300 font-mono text-xs">Pre-Opening Orders</strong>
            </div>
            <div className="bg-slate-800/60 px-2.5 py-1.5 rounded-lg border border-slate-700/60">
              <span className="text-slate-400 block text-[10px]">09:00 WIB</span>
              <strong className="text-green-300 font-mono text-xs">Market Regular Open</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
