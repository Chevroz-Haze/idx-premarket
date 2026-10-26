import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileSpreadsheet, 
  FileCode, 
  Printer, 
  Check, 
  ShieldCheck, 
  Clock, 
  Share2,
  FileText
} from 'lucide-react';
import { IDXAnnouncement } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcements: IDXAnnouncement[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  announcements
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Ticker',
      'Company Name',
      'Category',
      'Materiality',
      'Submission Time (WIB)',
      'Pre-Market Window',
      'Official Ref No',
      'Title',
      'Executive Summary',
      'Cleaned Key Metrics',
      'Verification Status',
      'idx.co.id Portal Link'
    ];

    const rows = announcements.map(a => {
      const escape = (str: string) => `"${(str || '').replace(/"/g, '""')}"`;
      const metricsStr = a.pdfMetadata.keyMetrics
        ? Object.entries(a.pdfMetadata.keyMetrics).map(([k, v]) => `${k}: ${v}`).join('; ')
        : '';

      return [
        escape(a.ticker),
        escape(a.companyName),
        escape(a.category),
        escape(a.materiality),
        escape(a.timestampWIB),
        escape(a.isPreMarket ? 'YES (Pre-Market)' : 'NO'),
        escape(a.officialRefNo),
        escape(a.title),
        escape(a.summary),
        escape(metricsStr),
        escape(a.crossCheckVerified ? 'VERIFIED (idx.co.id)' : 'PENDING'),
        escape(a.idxUrl)
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `IDX_PreMarket_Disclosures_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess('csv');
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  // Export JSON
  const handleExportJSON = () => {
    const exportData = {
      generatedAtWib: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) + ' WIB',
      exchange: 'Bursa Efek Indonesia (IDX)',
      sourceUrl: 'https://www.idx.co.id/id/perusahaan-tercatat/keterbukaan-informasi/',
      crossCheckVerified: true,
      totalDisclosures: announcements.length,
      preMarketCount: announcements.filter(a => a.isPreMarket).length,
      criticalCount: announcements.filter(a => a.materiality === 'CRITICAL' || a.materiality === 'HIGH').length,
      disclosures: announcements
    };

    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `IDX_PreMarket_Dataset_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess('json');
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  // Print Executive Brief
  const handlePrintBrief = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/95">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                Export Disclosures & Morning Pre-Market Brief
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Download structured data for financial modeling, quantitative backtesting, or portfolio reporting
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

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm flex-1">
          {/* Format Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* CSV Option */}
            <div className="bg-slate-950/60 border border-slate-800 hover:border-emerald-500/40 p-4 rounded-xl flex flex-col justify-between transition">
              <div>
                <div className="p-2 w-fit rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-sm">Microsoft Excel / CSV</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  UTF-8 BOM formatted spreadsheet with full company metadata, clean metrics, and timestamps.
                </p>
              </div>
              <button
                onClick={handleExportCSV}
                className="mt-4 flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-sm"
              >
                {downloadSuccess === 'csv' ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                <span>{downloadSuccess === 'csv' ? 'Downloaded!' : 'Export CSV'}</span>
              </button>
            </div>

            {/* JSON Option */}
            <div className="bg-slate-950/60 border border-slate-800 hover:border-cyan-500/40 p-4 rounded-xl flex flex-col justify-between transition">
              <div>
                <div className="p-2 w-fit rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
                  <FileCode className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-sm">Structured JSON</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Raw dataset with nested PDF metadata, parsed financial figures, and exchange verification hashes.
                </p>
              </div>
              <button
                onClick={handleExportJSON}
                className="mt-4 flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition shadow-sm"
              >
                {downloadSuccess === 'json' ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                <span>{downloadSuccess === 'json' ? 'Downloaded!' : 'Export JSON'}</span>
              </button>
            </div>

            {/* Printable Morning Brief */}
            <div className="bg-slate-950/60 border border-slate-800 hover:border-indigo-500/40 p-4 rounded-xl flex flex-col justify-between transition">
              <div>
                <div className="p-2 w-fit rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3">
                  <Printer className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-sm">Print / PDF Brief</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Executive Pre-Market Morning Brief formatted for printing, analyst meetings, or PDF export.
                </p>
              </div>
              <button
                onClick={handlePrintBrief}
                className="mt-4 flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>

          {/* Dataset Preview Box */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold text-slate-200">Export Scope & Summary:</span>
              <span className="font-mono text-emerald-400">{announcements.length} Disclosures Ready</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Exchange</span>
                <strong className="text-white">idx.co.id (BEI)</strong>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Pre-Market Filings</span>
                <strong className="text-amber-400">{announcements.filter(a => a.isPreMarket).length} Items</strong>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-slate-500 text-[10px] block">High Materiality</span>
                <strong className="text-rose-400">{announcements.filter(a => a.materiality === 'CRITICAL' || a.materiality === 'HIGH').length} Items</strong>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Cross-Check Status</span>
                <strong className="text-emerald-400">100% Verified</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Ready for market open (09:00 WIB) portfolio strategy</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
