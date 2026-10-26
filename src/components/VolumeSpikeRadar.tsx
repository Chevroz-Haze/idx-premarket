import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  BarChart3,
  Search,
  FileText,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  ArrowUpDown,
  Flame,
  Newspaper,
  HelpCircle,
  Radar
} from 'lucide-react';
import { VolumeSpikeStock, IDXAnnouncement, NewsCatalystStatus } from '../types';

interface VolumeSpikeRadarProps {
  stocks: VolumeSpikeStock[];
  announcements: IDXAnnouncement[];
  onSelectDisclosure: (item: IDXAnnouncement) => void;
  onTriggerPush: (title: string, body: string, ticker?: string) => void;
}

export const VolumeSpikeRadar: React.FC<VolumeSpikeRadarProps> = ({
  stocks,
  announcements,
  onSelectDisclosure,
  onTriggerPush
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [newsFilter, setNewsFilter] = useState<'ALL' | 'HAS_NEWS' | 'NO_NEWS'>('ALL');
  const [sortBy, setSortBy] = useState<'spikePct' | 'totalVolume' | 'priceChange'>('spikePct');
  const [customLookupTicker, setCustomLookupTicker] = useState('');
  const [inspectedTickerResult, setInspectedTickerResult] = useState<{
    ticker: string;
    matchedDisclosures: IDXAnnouncement[];
    matchedVolumeStock?: VolumeSpikeStock;
  } | null>(null);

  const formatShares = (shares: number): string => {
    if (shares >= 1_000_000_000) {
      return `${(shares / 1_000_000_000).toFixed(2)} Miliar`;
    }
    if (shares >= 1_000_000) {
      return `${(shares / 1_000_000).toFixed(1)} Juta`;
    }
    return shares.toLocaleString('id-ID');
  };

  const filteredStocks = useMemo(() => {
    return stocks
      .filter(s => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTicker = s.ticker.toLowerCase().includes(q);
          const matchName = s.companyName.toLowerCase().includes(q);
          const matchHeadline = s.newsHeadline.toLowerCase().includes(q);
          const matchSector = s.sector.toLowerCase().includes(q);
          if (!matchTicker && !matchName && !matchHeadline && !matchSector) return false;
        }

        if (newsFilter === 'HAS_NEWS') {
          return s.newsStatus === 'VERIFIED_IDX_FILING' || s.newsStatus === 'MARKET_NEWS_CATALYST';
        }
        if (newsFilter === 'NO_NEWS') {
          return s.newsStatus === 'NO_NEWS_TECHNICAL_FLOW' || s.newsStatus === 'UMA_WARNING_NO_FUNDAMENTAL_NEWS';
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'totalVolume') return b.latestVolumeShares - a.latestVolumeShares;
        if (sortBy === 'priceChange') return b.priceChangePct - a.priceChangePct;
        return b.volumeSpikePct - a.volumeSpikePct;
      });
  }, [stocks, searchQuery, newsFilter, sortBy]);

  const confirmedCatalystCount = stocks.filter(
    s => s.newsStatus === 'VERIFIED_IDX_FILING' || s.newsStatus === 'MARKET_NEWS_CATALYST'
  ).length;
  const noNewsTechnicalCount = stocks.filter(
    s => s.newsStatus === 'NO_NEWS_TECHNICAL_FLOW' || s.newsStatus === 'UMA_WARNING_NO_FUNDAMENTAL_NEWS'
  ).length;

  const getStatusBadge = (status: NewsCatalystStatus) => {
    switch (status) {
      case 'VERIFIED_IDX_FILING':
        return {
          label: 'ADA BERITA RESMI IDX.CO.ID (AKSI KORPORASI / INSIDER)',
          classes: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        };
      case 'MARKET_NEWS_CATALYST':
        return {
          label: 'ADA KATALIS BERITA PASAR (MEDIA MARKET NASIONAL)',
          classes: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          icon: <Newspaper className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        };
      case 'UMA_WARNING_NO_FUNDAMENTAL_NEWS':
        return {
          label: 'PERINGATAN UMA BEI (LONJAKAN TANPA AKSI KORPORASI BARU)',
          classes: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
        };
      case 'NO_NEWS_TECHNICAL_FLOW':
        return {
          label: 'TIDAK ADA BERITA RESMI (MURNI TEKNIKAL / AKUMULASI SPEKULATIF)',
          classes: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          icon: <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        };
    }
  };

  const handleInspectCustomTicker = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customLookupTicker.trim().toUpperCase();
    if (!clean) return;

    const matchedDisclosures = announcements.filter(
      a =>
        a.ticker.toUpperCase() === clean ||
        a.companyName.toUpperCase().includes(clean) ||
        a.title.toUpperCase().includes(clean) ||
        a.summary.toUpperCase().includes(clean)
    );
    const matchedVolumeStock = stocks.find(s => s.ticker.toUpperCase() === clean);

    setInspectedTickerResult({
      ticker: clean,
      matchedDisclosures,
      matchedVolumeStock
    });
  };

  return (
    <div className="space-y-5">
      {/* Top Explanation & KPI Summary */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
              <Radar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center flex-wrap gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Scanner Lonjakan Volume vs Hari Bursa Kemarin & Detektor Berita
                </h2>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded">
                  Cross-Checked: idx.co.id & Market News
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Membandingkan volume saham pada hari perdagangan terakhir (<strong className="text-white font-mono">{stocks[0]?.latestTradingDate}</strong>) terhadap hari perdagangan sebelumnya (<strong className="text-white font-mono">{stocks[0]?.previousTradingDate}</strong>), lalu otomatis mengecek apakah lonjakan volume tersebut didorong oleh <strong>Berita / Aksi Korporasi Resmi</strong> atau <strong>Murni Akumulasi Teknikal Tanpa Berita</strong>.
              </p>
            </div>
          </div>

          {/* Summary Pills */}
          <div className="grid grid-cols-3 gap-2.5 shrink-0">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-center">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Total Volume Spike</span>
              <strong className="text-lg font-mono font-bold text-white">{stocks.length} Saham</strong>
            </div>
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl px-3.5 py-2.5 text-center">
              <span className="text-[10px] uppercase tracking-wider text-emerald-300 block">Ada Berita / Aksi</span>
              <strong className="text-lg font-mono font-bold text-emerald-400">{confirmedCatalystCount} Saham</strong>
            </div>
            <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-center">
              <span className="text-[10px] uppercase tracking-wider text-amber-300 block">Tanpa Berita / UMA</span>
              <strong className="text-lg font-mono font-bold text-amber-400">{noNewsTechnicalCount} Saham</strong>
            </div>
          </div>
        </div>

        {/* Interactive Ticker News Cross-Checker Bar */}
        <div className="pt-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="text-xs text-slate-300 flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              <strong>Cek Cepat Berita Emiten:</strong> Ketik kode saham (contoh: <code className="text-emerald-300 font-mono">TOBA</code>, <code className="text-emerald-300 font-mono">WMUU</code>, <code className="text-emerald-300 font-mono">BUVA</code>, <code className="text-emerald-300 font-mono">PTPP</code>, <code className="text-emerald-300 font-mono">UNTR</code>) untuk mengecek apakah ada berita/keterbukaan informasi di <code className="text-emerald-300 font-mono">idx.co.id</code>:
            </span>
          </div>

          <form onSubmit={handleInspectCustomTicker} className="flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={customLookupTicker}
              onChange={(e) => setCustomLookupTicker(e.target.value)}
              placeholder="Ketik kode saham (4 huruf)..."
              maxLength={6}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-white uppercase placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-48"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer"
            >
              Cek Berita & Keterbukaan
            </button>
          </form>
        </div>

        {/* Instant Lookup Result Box */}
        {inspectedTickerResult && (
          <div className="mt-3 bg-slate-950/90 border border-slate-700 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {inspectedTickerResult.ticker}
                </span>
                <span className="text-xs font-bold text-white">
                  Hasil Cross-Check Berita & Keterbukaan Informasi idx.co.id:
                </span>
              </div>
              <button
                onClick={() => setInspectedTickerResult(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Tutup
              </button>
            </div>

            {inspectedTickerResult.matchedVolumeStock && (
              <div className="text-xs text-slate-300 bg-slate-900/90 border border-slate-800 rounded-lg p-3">
                <div className="font-semibold text-emerald-300 mb-1">
                  Status Volume vs Hari Bursa Kemarin: Melonjak +{inspectedTickerResult.matchedVolumeStock.volumeSpikePct.toFixed(1)}% ({inspectedTickerResult.matchedVolumeStock.volumeRatio.toFixed(2)}x lipat)
                </div>
                <p className="text-slate-200 font-medium">{inspectedTickerResult.matchedVolumeStock.newsHeadline}</p>
                <p className="text-slate-400 mt-1">{inspectedTickerResult.matchedVolumeStock.newsSummary}</p>
              </div>
            )}

            {inspectedTickerResult.matchedDisclosures.length > 0 ? (
              <div className="space-y-1.5">
                <span className="text-[11px] text-emerald-400 font-semibold block">
                  Ditemukan {inspectedTickerResult.matchedDisclosures.length} Dokumen Keterbukaan Informasi Resmi Terkait {inspectedTickerResult.ticker}:
                </span>
                {inspectedTickerResult.matchedDisclosures.map(d => (
                  <div
                    key={d.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-2 text-xs"
                  >
                    <div>
                      <span className="font-mono text-emerald-300 font-bold mr-2">[{d.officialRefNo}]</span>
                      <span className="text-white font-medium">{d.title}</span>
                    </div>
                    <button
                      onClick={() => onSelectDisclosure(d)}
                      className="px-2.5 py-1 rounded bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 text-[11px] font-semibold shrink-0"
                    >
                      Buka PDF Metadata
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-amber-300 bg-amber-950/30 border border-amber-500/30 rounded-lg p-2.5">
                Tidak ditemukan filing PDF aksi korporasi baru untuk <strong>{inspectedTickerResult.ticker}</strong> pada daftar keterbukaan informasi pagi ini. Gunakan tautan verifikasi langsung di bawah untuk mengecek arsip berita pasar:
              </div>
            )}

            <div className="flex items-center flex-wrap gap-2 pt-1 text-[11px]">
              <a
                href="https://www.idx.co.id/id/perusahaan-tercatat/keterbukaan-informasi/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
              >
                <ExternalLink className="w-3 h-3 text-emerald-400" />
                <span>Cek {inspectedTickerResult.ticker} di idx.co.id</span>
              </a>
              <a
                href={`https://www.google.com/search?q=saham+${inspectedTickerResult.ticker}+kontan+OR+investor.id+OR+cnbcindonesia`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
              >
                <ExternalLink className="w-3 h-3 text-cyan-400" />
                <span>Cari Berita {inspectedTickerResult.ticker} (Kontan / Investor.id)</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Filter & Sort Controls */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search & Filter Pills */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter ticker atau kata kunci berita..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'ALL', label: `Semua Lonjakan Volume (${stocks.length})` },
              { id: 'HAS_NEWS', label: `✅ Ada Berita / Aksi Korporasi (${confirmedCatalystCount})` },
              { id: 'NO_NEWS', label: `⚠️ Tanpa Berita Resmi / Teknikal & UMA (${noNewsTechnicalCount})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setNewsFilter(tab.id as 'ALL' | 'HAS_NEWS' | 'NO_NEWS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap border transition cursor-pointer ${
                  newsFilter === tab.id
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-emerald-400" />
            <span>Urutkan:</span>
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'spikePct' | 'totalVolume' | 'priceChange')}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-medium focus:outline-none focus:border-emerald-500"
          >
            <option value="spikePct">% Lonjakan Volume vs Kemarin (Tertinggi)</option>
            <option value="totalVolume">Total Volume Lembar Saham (Terbesar)</option>
            <option value="priceChange">% Kenaikan Harga Saham (Top Gainers)</option>
          </select>
        </div>
      </div>

      {/* Stock Cards Grid */}
      <div className="space-y-3.5">
        {filteredStocks.map(stock => {
          const badge = getStatusBadge(stock.newsStatus);
          const linkedDisclosure = stock.linkedDisclosureId
            ? announcements.find(a => a.id === stock.linkedDisclosureId)
            : undefined;

          // Calculate bar width percentage for prior day vs latest day
          const prevBarPct = Math.min(100, Math.max(12, Math.round((stock.previousVolumeShares / stock.latestVolumeShares) * 100)));

          return (
            <div
              key={stock.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-4 sm:p-5 transition shadow-lg"
            >
              {/* Top Row: Ticker, Price, Volume Ratio Badge, News Status Badge */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3.5 border-b border-slate-800/80">
                <div className="flex items-center flex-wrap gap-2.5">
                  <span className="font-mono font-bold text-base bg-slate-950 text-emerald-400 px-3 py-1 rounded-lg border border-slate-800">
                    {stock.ticker}
                  </span>
                  <div>
                    <h3 className="font-bold text-white text-sm sm:text-base leading-tight">
                      {stock.companyName}
                    </h3>
                    <span className="text-[11px] text-slate-400">{stock.sector}</span>
                  </div>

                  {/* Price & % Gain */}
                  <div className="flex items-center gap-1.5 bg-slate-950/90 border border-slate-800 px-3 py-1 rounded-lg ml-auto sm:ml-2">
                    <span className="text-xs font-mono text-slate-300">
                      Rp {stock.closePrice.toLocaleString('id-ID')}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400 flex items-center">
                      <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                      +{stock.priceChangePct.toFixed(2)}%
                    </span>
                  </div>

                  {/* Volume Spike Multiplier Pill */}
                  <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-lg text-xs font-mono font-bold">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    Volume +{stock.volumeSpikePct.toFixed(1)}% ({stock.volumeRatio.toFixed(2)}x Kemarin)
                  </span>
                </div>

                {/* News Detection Status Badge */}
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[11px] font-bold ${badge.classes}`}>
                  {badge.icon}
                  <span>{badge.label}</span>
                </div>
              </div>

              {/* Middle Row: 2-Column Layout (Volume Comparison vs News Catalyst Verdict) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-3.5 items-stretch">
                {/* Left Column: Volume vs Yesterday Trading Day Bar Comparison (5 cols) */}
                <div className="lg:col-span-5 bg-slate-950/70 border border-slate-800/90 rounded-xl p-3.5 flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <BarChart3 className="w-4 h-4 text-emerald-400" />
                      <span>Perbandingan Volume Perdagangan</span>
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">
                      Nilai: <strong className="text-slate-200">Rp {stock.transactionValueBn.toFixed(1)} Miliar</strong>
                    </span>
                  </div>

                  {/* Visual Bars */}
                  <div className="space-y-2.5">
                    {/* Latest Trading Day Bar */}
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-emerald-300 font-semibold font-mono">
                          Hari Bursa Terakhir ({stock.latestTradingDate})
                        </span>
                        <span className="font-mono font-bold text-white">
                          {formatShares(stock.latestVolumeShares)} saham
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full"
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>

                    {/* Prior Trading Day Bar */}
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-400 font-mono">
                          Hari Bursa Sebelumnya ({stock.previousTradingDate})
                        </span>
                        <span className="font-mono text-slate-400">
                          {formatShares(stock.previousVolumeShares)} saham
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-slate-600 rounded-full"
                          style={{ width: `${prevBarPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Selisih Volume:</span>
                    <strong className="text-emerald-400 font-mono">
                      +{formatShares(stock.latestVolumeShares - stock.previousVolumeShares)} lembar (+{stock.volumeSpikePct.toFixed(1)}%)
                    </strong>
                  </div>
                </div>

                {/* Right Column: News Catalyst Investigation Result (7 cols) */}
                <div className="lg:col-span-7 bg-slate-950/50 border border-slate-800/90 rounded-xl p-3.5 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400">
                      <span className="uppercase tracking-wider font-bold text-slate-300">
                        Hasil Investigasi Berita & Keterbukaan Informasi:
                      </span>
                      <span className="font-mono text-slate-400">{stock.newsSource}</span>
                    </div>

                    <h4 className="font-bold text-sm text-white leading-snug">
                      {stock.newsHeadline}
                    </h4>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {stock.newsSummary}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center flex-wrap gap-2">
                      {linkedDisclosure && (
                        <button
                          onClick={() => onSelectDisclosure(linkedDisclosure)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition shadow-sm cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Buka Bukti Filing PDF ({linkedDisclosure.officialRefNo.slice(0, 18)})</span>
                        </button>
                      )}

                      <a
                        href={stock.officialIdxUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Verifikasi di idx.co.id</span>
                      </a>

                      <a
                        href={`https://www.google.com/search?q=berita+saham+${stock.ticker}+hari+ini+kontan+investor.id`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition"
                      >
                        <Newspaper className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Cek Berita Media ({stock.ticker})</span>
                      </a>
                    </div>

                    <button
                      onClick={() =>
                        onTriggerPush(
                          `📊 [VOLUME SPIKE +${stock.volumeSpikePct.toFixed(0)}%] ${stock.ticker} (${stock.volumeRatio.toFixed(2)}x Kemarin)`,
                          `${stock.newsHeadline} — ${stock.newsSource}`,
                          stock.ticker
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 text-xs font-semibold transition cursor-pointer"
                      title="Kirim Notifikasi Push ke HP"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Push ke HP</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
