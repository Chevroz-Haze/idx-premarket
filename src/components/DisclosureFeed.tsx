import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ShieldCheck, 
  FileText, 
  ExternalLink, 
  Smartphone, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  SlidersHorizontal,
  ArrowUpDown,
  Tag,
  Zap,
  Bookmark
} from 'lucide-react';
import { IDXAnnouncement, DisclosureCategory, MaterialityLevel, AlertPreferences } from '../types';

interface DisclosureFeedProps {
  announcements: IDXAnnouncement[];
  alertPreferences: AlertPreferences;
  onSelectDisclosure: (item: IDXAnnouncement) => void;
  onSendTestPush: (item: IDXAnnouncement) => void;
}

export const DisclosureFeed: React.FC<DisclosureFeedProps> = ({
  announcements,
  alertPreferences,
  onSelectDisclosure,
  onSendTestPush
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedMateriality, setSelectedMateriality] = useState<string>('ALL');
  const [preMarketOnly, setPreMarketOnly] = useState<boolean>(true);
  const [watchlistOnly, setWatchlistOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'time' | 'materiality'>('time');

  // Filtered & Sorted Announcements
  const filteredList = useMemo(() => {
    return announcements
      .filter(item => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTicker = item.ticker.toLowerCase().includes(q);
          const matchCompany = item.companyName.toLowerCase().includes(q);
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchRef = item.officialRefNo.toLowerCase().includes(q);
          if (!matchTicker && !matchCompany && !matchTitle && !matchRef) return false;
        }

        // Pre-market filter
        if (preMarketOnly && !item.isPreMarket) return false;

        // Watchlist filter
        if (watchlistOnly && !alertPreferences.watchlistTickers.includes(item.ticker)) return false;

        // Category filter
        if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;

        // Materiality filter
        if (selectedMateriality !== 'ALL' && item.materiality !== selectedMateriality) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'materiality') {
          const weight: { [key in MaterialityLevel]: number } = {
            CRITICAL: 4,
            HIGH: 3,
            MEDIUM: 2,
            INFORMATIONAL: 1
          };
          return weight[b.materiality] - weight[a.materiality];
        }
        // Default time desc
        return b.timestampWIB.localeCompare(a.timestampWIB);
      });
  }, [announcements, searchQuery, preMarketOnly, watchlistOnly, selectedCategory, selectedMateriality, sortBy, alertPreferences.watchlistTickers]);

  const getMaterialityBadge = (mat: MaterialityLevel) => {
    switch (mat) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'MEDIUM':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      default:
        return 'bg-slate-700/30 text-slate-300 border-slate-700/50';
    }
  };

  const getCategoryLabel = (cat: DisclosureCategory) => {
    switch (cat) {
      case 'CORPORATE_ACTION': return 'Corporate Action';
      case 'SUSPENSION_UMA': return 'Suspension / UMA';
      case 'FINANCIAL_REPORT': return 'Financial Report';
      case 'MATERIAL_INFORMATION': return 'Material Information';
      case 'RUPS_PUBLIC_EXPOSE': return 'RUPS / PubEx';
      case 'INSIDER_TRANSACTION': return 'Insider Trading';
    }
  };

  return (
    <div className="space-y-4">
      {/* Control Bar: Search & Quick Filters */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ticker (e.g. BBCA, CUAN) or subject..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>

          {/* Quick Toggles */}
          <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto">
            {/* Pre-Market Toggle */}
            <button
              onClick={() => setPreMarketOnly(!preMarketOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                preMarketOnly
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Pre-Market Only (06:00 - 08:45 WIB)</span>
            </button>

            {/* Watchlist Toggle */}
            <button
              onClick={() => setWatchlistOnly(!watchlistOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                watchlistOnly
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>My Watchlist ({alertPreferences.watchlistTickers.length})</span>
            </button>

            {/* Sort Toggle */}
            <button
              onClick={() => setSortBy(sortBy === 'time' ? 'materiality' : 'time')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:text-white transition"
              title="Toggle Sort by Time or Materiality Impact"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sort: {sortBy === 'time' ? 'Latest First' : 'Highest Materiality'}</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 no-scrollbar text-xs">
          {[
            { id: 'ALL', label: 'All Disclosures' },
            { id: 'CORPORATE_ACTION', label: 'Dividends & Buybacks' },
            { id: 'SUSPENSION_UMA', label: 'Suspension & UMA' },
            { id: 'MATERIAL_INFORMATION', label: 'Material Information' },
            { id: 'FINANCIAL_REPORT', label: 'Financial Reports' },
            { id: 'RUPS_PUBLIC_EXPOSE', label: 'Public Expose' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Feed List Status */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Showing <strong className="text-white font-mono">{filteredList.length}</strong> verified disclosures sorted for pre-market inspection
        </span>
        <span className="flex items-center gap-1.5 text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Cross-Checked with idx.co.id official server</span>
        </span>
      </div>

      {/* Announcements Cards */}
      <div className="space-y-3">
        {filteredList.map(item => {
          const isWatchlisted = alertPreferences.watchlistTickers.includes(item.ticker);

          return (
            <div
              key={item.id}
              className={`bg-slate-900/90 border rounded-xl p-4 sm:p-5 transition hover:shadow-xl hover:border-slate-700 ${
                item.materiality === 'CRITICAL'
                  ? 'border-rose-500/40 bg-gradient-to-r from-rose-950/20 via-slate-900 to-slate-900'
                  : item.materiality === 'HIGH'
                  ? 'border-amber-500/30'
                  : 'border-slate-800'
              }`}
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-800/80">
                <div className="flex items-center flex-wrap gap-2">
                  {/* Ticker Badge */}
                  <span className="font-mono font-bold text-sm bg-slate-950 text-emerald-400 px-2.5 py-1 rounded-md border border-slate-800">
                    {item.ticker}
                  </span>

                  {/* Company Name */}
                  <h4 className="font-bold text-white text-sm">
                    {item.companyName}
                  </h4>

                  {/* Watchlist Star */}
                  {isWatchlisted && (
                    <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-1.5 py-0.5 rounded border border-emerald-500/20 font-medium">
                      Watchlist
                    </span>
                  )}

                  {/* Pre-Market Badge */}
                  {item.isPreMarket && (
                    <span className="bg-amber-500/10 text-amber-300 text-[10px] font-mono font-semibold px-2 py-0.5 rounded border border-amber-500/20 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      PRE-MARKET (WIB)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Materiality Tag */}
                  <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${getMaterialityBadge(item.materiality)}`}>
                    {item.materiality}
                  </span>

                  {/* Submission Time */}
                  <div className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{item.timeStr} WIB</span>
                  </div>
                </div>
              </div>

              {/* Title & Clean Summary */}
              <div className="pt-3 space-y-2">
                <h5 className="font-semibold text-slate-100 text-sm leading-snug">
                  {item.title}
                </h5>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.summary}
                </p>

                {/* Key Metrics Chips (Parsed from PDF) */}
                {item.pdfMetadata.keyMetrics && Object.keys(item.pdfMetadata.keyMetrics).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {Object.entries(item.pdfMetadata.keyMetrics).slice(0, 3).map(([key, val]) => (
                      <span
                        key={key}
                        className="bg-slate-950 text-slate-300 text-[11px] px-2.5 py-1 rounded-md border border-slate-800 font-mono"
                      >
                        <span className="text-slate-500 mr-1">{key}:</span>
                        <strong className="text-emerald-400">{String(val)}</strong>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer: Metadata & Actions */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                {/* Official Verification Details */}
                <div className="flex items-center flex-wrap gap-2 text-slate-400">
                  <span className="font-mono text-[11px] text-slate-500">
                    Ref: <strong className="text-slate-300">{item.officialRefNo}</strong>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-emerald-400 text-[11px] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified idx.co.id
                  </span>
                  <span>•</span>
                  <span className="text-[11px] text-slate-500">
                    PDF: {item.pdfMetadata.pdfPages}p ({item.pdfMetadata.pdfFileSizeKb} KB)
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectDisclosure(item)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Inspect Cleaned PDF</span>
                  </button>

                  <a
                    href={item.idxUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium border border-slate-800 transition"
                    title="Cross-check directly on Bursa Efek Indonesia portal"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>idx.co.id</span>
                  </a>

                  <button
                    onClick={() => onSendTestPush(item)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-medium border border-emerald-500/30 transition"
                    title="Simulate push to mobile screen"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Push</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredList.length === 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center space-y-3">
            <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
            <h4 className="font-bold text-white text-base">No announcements match current filters</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Try disabling "Pre-Market Only" or "Watchlist Only", or clear your search term to see previous session disclosures.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
                setSelectedMateriality('ALL');
                setPreMarketOnly(false);
                setWatchlistOnly(false);
              }}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold transition"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
