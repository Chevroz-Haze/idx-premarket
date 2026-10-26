import React, { useEffect, useState } from 'react';
import { 
  Clock, 
  Terminal, 
  Bell, 
  BarChart3, 
  Download, 
  BookOpen, 
  TrendingUp, 
  ShieldCheck, 
  Activity,
  Flame,
  Radio,
  Cloud
} from 'lucide-react';
import { MarketSessionInfo } from '../types';
import { getMarketSessionInfo } from '../utils/marketTime';

interface HeaderProps {
  onOpenScraper: () => void;
  onOpenAlerts: () => void;
  onOpenCharts: () => void;
  onOpenExport: () => void;
  onOpenGuide: () => void;
  onOpenFreeHosting: () => void;
  criticalCount: number;
  totalCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenScraper,
  onOpenAlerts,
  onOpenCharts,
  onOpenExport,
  onOpenGuide,
  onOpenFreeHosting,
  criticalCount,
  totalCount
}) => {
  const [sessionInfo, setSessionInfo] = useState<MarketSessionInfo>(getMarketSessionInfo());

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionInfo(getMarketSessionInfo());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: MarketSessionInfo['status']) => {
    switch (status) {
      case 'PRE_MARKET':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'PRE_OPEN':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'SESSION_1':
      case 'SESSION_2':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'BREAK':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default:
        return 'bg-slate-700/30 text-slate-400 border-slate-700/50';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      {/* Top Banner: Real-time Indices & Market Session Countdown */}
      <div className="bg-slate-950/80 px-4 py-1.5 border-b border-slate-800/80 text-xs flex flex-wrap items-center justify-between gap-3">
        {/* Indices Ticker */}
        <div className="flex items-center gap-4 overflow-x-auto py-0.5 no-scrollbar">
          <div className="flex items-center gap-1.5 font-semibold text-slate-300 whitespace-nowrap">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">IHSG:</span>
            <span className="text-white font-mono">5,384.97</span>
            <span className="text-amber-400 font-mono text-[11px]">-53.40 (-0.98%)</span>
          </div>
          <span className="text-slate-700">•</span>
          <div className="flex items-center gap-1.5 font-semibold text-slate-300 whitespace-nowrap">
            <span className="text-slate-400">LQ45:</span>
            <span className="text-white font-mono">642.15</span>
            <span className="text-amber-400 font-mono text-[11px]">-6.12 (-0.94%)</span>
          </div>
          <span className="text-slate-700">•</span>
          <div className="flex items-center gap-1.5 font-semibold text-slate-300 whitespace-nowrap">
            <span className="text-slate-400">USD/IDR:</span>
            <span className="text-white font-mono">18,120</span>
            <span className="text-amber-400 font-mono text-[11px]">+45 (+0.25%)</span>
          </div>
          <span className="text-slate-700">•</span>
          <div className="flex items-center gap-1.5 font-semibold text-slate-300 whitespace-nowrap">
            <span className="text-slate-400">Indo 10Y:</span>
            <span className="text-white font-mono">6.88%</span>
            <span className="text-slate-400 font-mono text-[11px]">yield</span>
          </div>
        </div>

        {/* Live Jakarta Date, Time & Session Countdown */}
        <div className="flex items-center gap-3 ml-auto text-slate-300 font-mono text-[11px]">
          <div className="flex items-center gap-1.5 bg-slate-800/70 px-2 py-0.5 rounded border border-slate-700/60">
            <Clock className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-slate-400 hidden md:inline">{sessionInfo.currentWibDate} •</span>
            <span className="text-emerald-300 font-bold">{sessionInfo.currentWibTime}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
            <span>Next: <strong className="text-slate-200">{sessionInfo.nextMilestone}</strong> in</span>
            <span className="bg-amber-500/10 text-amber-300 px-1.5 py-0.5 rounded font-bold border border-amber-500/20">
              {sessionInfo.countdownFormatted}
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 shadow-lg shadow-emerald-500/20 border border-emerald-400/40">
            <Activity className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                IDX Pre-Market Pulse
              </h1>
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 uppercase tracking-wider">
                idx.co.id Real Data
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Official Disclosure Scraper & Mobile Alert Engine (Before 09:00 WIB Open)
            </p>
          </div>
        </div>

        {/* Market Status & Navigation Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Market Status Badge */}
          <div className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center gap-2 ${getStatusColor(sessionInfo.status)}`}>
            <Radio className="w-3.5 h-3.5 animate-pulse text-amber-400" />
            <span>{sessionInfo.statusLabel}</span>
          </div>

          {/* Scraper Lab Button */}
          <button
            onClick={onOpenScraper}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shadow-sm hover:border-slate-600"
            title="View Python BeautifulSoup Scraper, PDF Parser & Rate Limiter"
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Python Scraper</span>
          </button>

          {/* Alert Preferences */}
          <button
            onClick={onOpenAlerts}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shadow-sm hover:border-slate-600"
            title="Manage Mobile Push & Notification Frequencies"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span>Mobile Alerts</span>
            {criticalCount > 0 && (
              <span className="ml-1 bg-rose-500 text-white font-mono text-[10px] px-1.5 py-0.2 rounded-full">
                {criticalCount}
              </span>
            )}
          </button>

          {/* Historical Charts */}
          <button
            onClick={onOpenCharts}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shadow-sm hover:border-slate-600"
            title="Historical Announcements & Filing Timing Analytics"
          >
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Analytics</span>
          </button>

          {/* Export Report */}
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shadow-sm hover:border-slate-600"
            title="Export CSV, JSON, or Morning Executive Brief"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export</span>
          </button>

          {/* Architecture & Best Way Guide */}
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 transition shadow-sm"
            title="Read 'Best Way' Architecture Blueprint"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>Best Way Guide</span>
          </button>

          {/* Free Hosting Blueprint */}
          <button
            onClick={onOpenFreeHosting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 transition shadow-sm"
            title="Deploy on 100% Free Hosting (Vercel, Cloudflare Pages, GitHub Actions)"
          >
            <Cloud className="w-3.5 h-3.5 text-indigo-400" />
            <span>Free Hosting ($0)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
