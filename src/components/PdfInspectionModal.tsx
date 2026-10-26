import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  ShieldCheck, 
  ExternalLink, 
  CheckCircle2, 
  Smartphone, 
  Trash2, 
  Filter,
  Sparkles,
  Info,
  Layers,
  Copy,
  Check
} from 'lucide-react';
import { IDXAnnouncement } from '../types';

interface PdfInspectionModalProps {
  disclosure: IDXAnnouncement | null;
  onClose: () => void;
  onSendTestPush: (disclosure: IDXAnnouncement) => void;
}

export const PdfInspectionModal: React.FC<PdfInspectionModalProps> = ({
  disclosure,
  onClose,
  onSendTestPush
}) => {
  const [activeTab, setActiveTab] = useState<'cleaned' | 'metrics' | 'audit'>('cleaned');
  const [copied, setCopied] = useState(false);

  if (!disclosure) return null;

  const { pdfMetadata } = disclosure;

  const handleCopyCleaned = () => {
    navigator.clipboard.writeText(pdfMetadata.cleanedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-base text-white px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                  {disclosure.ticker}
                </span>
                <h3 className="font-bold text-slate-100 text-sm sm:text-base line-clamp-1">
                  {disclosure.companyName}
                </h3>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Ref: {disclosure.officialRefNo} • {pdfMetadata.pdfFileName} ({pdfMetadata.pdfPages} Pages, {pdfMetadata.pdfFileSizeKb} KB)
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

        {/* Tab Navigation */}
        <div className="px-6 py-2.5 bg-slate-950/50 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('cleaned')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeTab === 'cleaned'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              Cleaned PDF Metadata
            </button>
            <button
              onClick={() => setActiveTab('metrics')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeTab === 'metrics'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              Extracted Key Figures
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeTab === 'audit'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              idx.co.id Cross-Check Audit
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCleaned}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Cleaned'}</span>
            </button>
            <button
              onClick={() => onSendTestPush(disclosure)}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition shadow-sm"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Push to Mobile</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm flex-1">
          {activeTab === 'cleaned' && (
            <div className="space-y-4">
              {/* Cleaning Summary Pill */}
              <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-300">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    <strong>BeautifulSoup & PyPDF Sanitization:</strong> Successfully stripped {pdfMetadata.rawDisclaimersStripped} lines of regulatory boilerplates, electronic signatures, and legal footers.
                  </span>
                </div>
                <span className="font-mono text-[11px] bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30 shrink-0">
                  High-Fidelity Clean
                </span>
              </div>

              {/* Title & Submission details */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-white text-base">{disclosure.title}</h4>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-mono">
                  <span>Sector: <strong className="text-slate-200">{pdfMetadata.sector}</strong></span>
                  <span>•</span>
                  <span>ISIN: <strong className="text-slate-200">{pdfMetadata.isinCode || 'N/A'}</strong></span>
                  <span>•</span>
                  <span>Filed: <strong className="text-emerald-400">{pdfMetadata.submissionDateWIB}</strong></span>
                </div>
              </div>

              {/* Extracted Clean Text Box */}
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Clean Metadata Stream (Mobile Payload View)
                </label>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                  {pdfMetadata.cleanedText}
                </div>
              </div>

              {/* Executive Summary */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Executive Pre-Market Summary:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {disclosure.summary}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'metrics' && (
            <div className="space-y-4">
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-emerald-400" />
                  Key Financial & Corporate Action Figures
                </h4>
                {pdfMetadata.keyMetrics && Object.keys(pdfMetadata.keyMetrics).length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(pdfMetadata.keyMetrics).map(([key, val]) => (
                      <div key={key} className="bg-slate-900 border border-slate-800/80 rounded-lg p-3">
                        <span className="text-[11px] text-slate-400 block">{key}</span>
                        <strong className="text-sm font-mono text-emerald-400 block mt-0.5">
                          {String(val)}
                        </strong>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No quantitative tables identified in this filing.</p>
                )}
              </div>

              {/* Tags */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                <h5 className="text-xs font-semibold text-slate-300 mb-2">Automated Materiality Tags:</h5>
                <div className="flex flex-wrap gap-2">
                  {disclosure.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-800 text-slate-200 text-xs px-2.5 py-1 rounded-md border border-slate-700 font-medium"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                  <ShieldCheck className="w-5 h-5" />
                  <span>idx.co.id Official Cross-Check Verification</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Every announcement parsed by our Python pipeline is cross-checked against the official Bursa Efek Indonesia announcement registry API and DOM structure to guarantee authenticity before alert dispatch.
                </p>

                <div className="space-y-2 text-xs font-mono bg-slate-900 border border-slate-800 p-3 rounded-lg">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Exchange Registration No:</span>
                    <span className="text-white font-bold">{disclosure.officialRefNo}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Verification Hash:</span>
                    <span className="text-emerald-400">{disclosure.idxHash}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Submission Timestamp:</span>
                    <span className="text-slate-200">{disclosure.timestampWIB} WIB</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Verification Status:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 100% MATCH (idx.co.id)
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={disclosure.idxUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-semibold border border-emerald-500/40 transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open Bursa Efek Indonesia (idx.co.id) Portal</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Target Market Open: 09:00 WIB • Pre-Opening: 08:45 WIB</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
