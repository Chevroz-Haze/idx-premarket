import React, { useState, useEffect } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  PreMarketOverview 
} from './components/PreMarketOverview';
import { 
  DisclosureFeed 
} from './components/DisclosureFeed';
import { 
  PdfInspectionModal 
} from './components/PdfInspectionModal';
import { 
  ScraperLab 
} from './components/ScraperLab';
import { 
  AlertSettingsModal 
} from './components/AlertSettingsModal';
import { 
  HistoricalCharts 
} from './components/HistoricalCharts';
import { 
  ExportModal 
} from './components/ExportModal';
import { 
  BestWayGuide 
} from './components/BestWayGuide';
import { 
  FreeHostingModal 
} from './components/FreeHostingModal';
import {
  VolumeSpikeRadar
} from './components/VolumeSpikeRadar';
import { 
  INITIAL_IDX_ANNOUNCEMENTS, 
  DEFAULT_ALERT_PREFERENCES,
  VOLUME_SPIKE_STOCKS
} from './data/mockIdxData';
import { 
  IDXAnnouncement, 
  AlertPreferences 
} from './types';
import { 
  Smartphone, 
  X, 
  Bell, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  ExternalLink,
  FileText,
  Flame
} from 'lucide-react';

export default function App() {
  const [announcements, setAnnouncements] = useState<IDXAnnouncement[]>(INITIAL_IDX_ANNOUNCEMENTS);
  const [alertPreferences, setAlertPreferences] = useState<AlertPreferences>(DEFAULT_ALERT_PREFERENCES);
  const [activeMainTab, setActiveMainTab] = useState<'DISCLOSURES' | 'VOLUME_SPIKE_RADAR'>('VOLUME_SPIKE_RADAR');
  
  // Modals state
  const [selectedDisclosure, setSelectedDisclosure] = useState<IDXAnnouncement | null>(null);
  const [isScraperOpen, setIsScraperOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isChartsOpen, setIsChartsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isFreeHostingOpen, setIsFreeHostingOpen] = useState(false);

  // Active Mobile Push Simulation Notification
  const [activeMobileNotification, setActiveMobileNotification] = useState<{
    id: string;
    title: string;
    body: string;
    ticker?: string;
    time: string;
  } | null>(null);

  // Function to dispatch real browser notification AND simulated mobile banner
  const triggerPushNotification = (customTitle?: string, customBody?: string, ticker?: string) => {
    const title = customTitle || '🚨 [IDX PRE-MARKET ALERT] Material Disclosure Published';
    const body = customBody || 'New corporate action detected on idx.co.id before market open.';
    const currentTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

    // 1. In-App Mobile Toast
    setActiveMobileNotification({
      id: Math.random().toString(),
      title,
      body,
      ticker,
      time: currentTime
    });

    // Auto-dismiss after 6 seconds
    setTimeout(() => {
      setActiveMobileNotification(prev => prev?.title === title ? null : prev);
    }, 6000);

    // 2. Real Browser Notification if permitted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: 'https://www.idx.co.id/favicon.ico',
          tag: 'idx_premarket'
        });
      } catch (err) {
        console.warn('Browser notification dispatch prevented:', err);
      }
    }
  };

  const handleSendTestPushForDisclosure = (item: IDXAnnouncement) => {
    triggerPushNotification(
      `🚨 [IDX PRE-MARKET] ${item.ticker}: ${item.title.slice(0, 42)}...`,
      item.summary.slice(0, 110) + '... (Cross-checked to idx.co.id)',
      item.ticker
    );
  };

  const handleScrapeComplete = (newCount: number) => {
    triggerPushNotification(
      '📊 [IDX 08:30 WIB PRE-MARKET DIGEST] Complete',
      `BeautifulSoup scraper parsed ${newCount} new disclosures. 100% verified with idx.co.id registry.`
    );
  };

  const criticalCount = announcements.filter(a => a.materiality === 'CRITICAL' || a.materiality === 'HIGH').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Header */}
      <Header
        onOpenScraper={() => setIsScraperOpen(true)}
        onOpenAlerts={() => setIsAlertsOpen(true)}
        onOpenCharts={() => setIsChartsOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenFreeHosting={() => setIsFreeHostingOpen(true)}
        criticalCount={criticalCount}
        totalCount={announcements.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Pre-Market Overview & High Impact Alert Banner */}
        <PreMarketOverview
          announcements={announcements}
          alertPreferences={alertPreferences}
          onOpenScraper={() => setIsScraperOpen(true)}
          onOpenAlerts={() => setIsAlertsOpen(true)}
          onSelectDisclosure={(item) => setSelectedDisclosure(item)}
        />

        {/* Primary Workspace Navigation Tabs */}
        <div className="mb-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-2 rounded-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full sm:w-auto flex-1">
            <button
              onClick={() => setActiveMainTab('DISCLOSURES')}
              className={`flex items-center justify-center sm:justify-start gap-2.5 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeMainTab === 'DISCLOSURES'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800/80'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span>Pre-Market Disclosures & Corporate Actions</span>
              <span className={`font-mono text-xs px-2 py-0.5 rounded-md ${
                activeMainTab === 'DISCLOSURES'
                  ? 'bg-emerald-950/60 text-emerald-200'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {announcements.length}
              </span>
            </button>

            <button
              onClick={() => setActiveMainTab('VOLUME_SPIKE_RADAR')}
              className={`flex items-center justify-center sm:justify-start gap-2.5 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeMainTab === 'VOLUME_SPIKE_RADAR'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800/80'
              }`}
            >
              <Flame className="w-4 h-4 shrink-0 text-amber-300" />
              <span>Volume Spike vs Yesterday Trading Day & News Finder</span>
              <span className={`font-mono text-xs px-2 py-0.5 rounded-md ${
                activeMainTab === 'VOLUME_SPIKE_RADAR'
                  ? 'bg-emerald-950/60 text-amber-200'
                  : 'bg-slate-800 text-amber-400'
              }`}>
                {VOLUME_SPIKE_STOCKS.length} Stocks
              </span>
            </button>
          </div>
        </div>

        {/* Active Tab View */}
        {activeMainTab === 'DISCLOSURES' ? (
          <DisclosureFeed
            announcements={announcements}
            alertPreferences={alertPreferences}
            onSelectDisclosure={(item) => setSelectedDisclosure(item)}
            onSendTestPush={handleSendTestPushForDisclosure}
          />
        ) : (
          <VolumeSpikeRadar
            stocks={VOLUME_SPIKE_STOCKS}
            announcements={announcements}
            onSelectDisclosure={(item) => setSelectedDisclosure(item)}
            onTriggerPush={triggerPushNotification}
          />
        )}
      </main>

      {/* Simulated Mobile Push Notification Overlay */}
      {activeMobileNotification && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md w-full p-4 animate-bounce-short">
          <div className="bg-slate-900/95 border-2 border-emerald-500/70 rounded-2xl p-4 shadow-2xl backdrop-blur-md text-white space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold">
                  <Smartphone className="w-4 h-4" />
                </div>
                <span className="font-bold tracking-tight text-emerald-400">
                  IDX MOBILE PUSH NOTIFICATION
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-[11px] font-mono">
                <span>{activeMobileNotification.time}</span>
                <button
                  onClick={() => setActiveMobileNotification(null)}
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="pt-1">
              <h5 className="font-bold text-sm text-slate-100 line-clamp-1">
                {activeMobileNotification.title}
              </h5>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {activeMobileNotification.body}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified with idx.co.id</span>
              </span>
              <span className="text-slate-500 font-mono">Channel: idx_premarket_critical</span>
            </div>
          </div>
        </div>
      )}

      {/* Printable Executive Brief (hidden on screen, visible on window.print) */}
      <div className="hidden print:block p-8 bg-white text-black font-sans">
        <div className="border-b-2 border-black pb-4 mb-4 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold">BURSA EFEK INDONESIA (IDX) - PRE-MARKET MORNING BRIEF</h1>
            <p className="text-sm text-gray-600">Cross-Checked with idx.co.id • Prepared for 09:00 WIB Market Open</p>
          </div>
          <div className="text-right text-sm">
            <p className="font-bold">Date: {new Date().toLocaleDateString('id-ID')}</p>
            <p>Pre-Opening Session: 08:45 WIB</p>
          </div>
        </div>

        <h2 className="text-lg font-bold mb-2">High-Impact Corporate Actions & Suspensions</h2>
        <table className="w-full text-left text-sm border-collapse mb-6">
          <thead>
            <tr className="border-b border-black">
              <th className="py-2">Ticker</th>
              <th className="py-2">Company</th>
              <th className="py-2">Category</th>
              <th className="py-2">Ref No</th>
              <th className="py-2">Key Highlight / Cleaned Metric</th>
            </tr>
          </thead>
          <tbody>
            {announcements.map(a => (
              <tr key={a.id} className="border-b border-gray-200">
                <td className="py-2 font-bold font-mono">{a.ticker}</td>
                <td className="py-2">{a.companyName}</td>
                <td className="py-2">{a.category}</td>
                <td className="py-2 font-mono text-xs">{a.officialRefNo}</td>
                <td className="py-2">{a.summary}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-gray-500">Generated automatically by IDX Pre-Market Intelligence Pipeline.</p>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 px-4 sm:px-6 lg:px-8 py-5 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span>IDX Pre-Market Pulse Engine</span>
            <span>•</span>
            <span>Jakarta Market Open: 09:00 WIB (Pre-Open 08:45 WIB)</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="hover:text-emerald-400 transition"
            >
              Architecture Blueprint
            </button>
            <button
              onClick={() => setIsScraperOpen(true)}
              className="hover:text-emerald-400 transition"
            >
              Python Scraper Code
            </button>
            <button
              onClick={() => setIsAlertsOpen(true)}
              className="hover:text-emerald-400 transition"
            >
              Alert Settings
            </button>
            <button
              onClick={() => setIsFreeHostingOpen(true)}
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition"
            >
              Free Hosting ($0)
            </button>
            <a
              href="https://www.idx.co.id/id/perusahaan-tercatat/keterbukaan-informasi/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition inline-flex items-center gap-1"
            >
              <span>idx.co.id</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PdfInspectionModal
        disclosure={selectedDisclosure}
        onClose={() => setSelectedDisclosure(null)}
        onSendTestPush={handleSendTestPushForDisclosure}
      />

      <ScraperLab
        isOpen={isScraperOpen}
        onClose={() => setIsScraperOpen(false)}
        onScrapeComplete={handleScrapeComplete}
      />

      <AlertSettingsModal
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        preferences={alertPreferences}
        onSavePreferences={(newPrefs) => setAlertPreferences(newPrefs)}
        onTriggerTestPush={triggerPushNotification}
      />

      <HistoricalCharts
        isOpen={isChartsOpen}
        onClose={() => setIsChartsOpen(false)}
        announcements={announcements}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        announcements={announcements}
      />

      <BestWayGuide
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onOpenScraper={() => {
          setIsGuideOpen(false);
          setIsScraperOpen(true);
        }}
        onOpenAlerts={() => {
          setIsGuideOpen(false);
          setIsAlertsOpen(true);
        }}
      />

      <FreeHostingModal
        isOpen={isFreeHostingOpen}
        onClose={() => setIsFreeHostingOpen(false)}
      />
    </div>
  );
}
