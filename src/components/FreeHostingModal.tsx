import React, { useState } from 'react';
import { 
  X, 
  Cloud, 
  Globe, 
  Check, 
  Copy, 
  Download, 
  Terminal, 
  Layers, 
  ExternalLink, 
  Zap, 
  ShieldCheck, 
  Clock, 
  Database, 
  Smartphone,
  Cpu,
  Github,
  CheckCircle2,
  Rocket,
  KeyRound,
  Play
} from 'lucide-react';

interface FreeHostingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const USER_GITHUB_REPO = 'https://github.com/Chevroz-Haze/idx-premarket';

export const GIT_PUSH_COMMANDS = `# Run in your local project terminal to push all files to your repository:
git init
git add .
git commit -m "feat: IDX Pre-Market Intelligence Dashboard & Automated Scraper"
git branch -M main
git remote add origin https://github.com/Chevroz-Haze/idx-premarket.git
git push -u origin main`;

export const GITHUB_ACTIONS_WORKFLOW = `# .github/workflows/idx_scraper.yml
# =============================================================================
# Automated Free Pre-Market IDX Scraper for Chevroz-Haze/idx-premarket
# Runs Monday to Friday at 06:00, 07:00, 08:00, and 08:30 WIB (UTC+7)
# =============================================================================
name: IDX Pre-Market Scraper & FCM Push

on:
  schedule:
    # 06:00 WIB (Sun-Thu 23:00 UTC)
    - cron: '0 23 * * 0-4'
    # 07:00 WIB (Mon-Fri 00:00 UTC)
    - cron: '0 0 * * 1-5'
    # 08:00 WIB (Mon-Fri 01:00 UTC)
    - cron: '0 1 * * 1-5'
    # 08:30 WIB (Mon-Fri 01:30 UTC - Final Morning Digest before 08:45 Pre-Open)
    - cron: '30 1 * * 1-5'
  workflow_dispatch: # Allows manual trigger from https://github.com/Chevroz-Haze/idx-premarket/actions

jobs:
  scrape-and-push:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Chevroz-Haze/idx-premarket
        uses: actions/checkout@v4

      - name: Set up Python 3.10
        uses: actions/setup-python@v5
        with:
          python-version: '3.10'
          cache: 'pip'

      - name: Install Python Dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt

      - name: Write Firebase Service Account Key
        env:
          FIREBASE_SERVICE_ACCOUNT: \${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
        run: |
          if [ -n "\$FIREBASE_SERVICE_ACCOUNT" ]; then
            echo "\$FIREBASE_SERVICE_ACCOUNT" > serviceAccountKey.json
          else
            echo "Warning: FIREBASE_SERVICE_ACCOUNT secret not set. Running in dry-run mode."
          fi

      - name: Execute IDX Pre-Market Scraper
        run: |
          python idx_disclosure_scraper.py

      - name: Cleanup Service Account Key
        if: always()
        run: rm -f serviceAccountKey.json
`;

export const VERCEL_CONFIG = `{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}`;

export const FIREBASE_JSON_CONFIG = `{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}`;

export const FreeHostingModal: React.FC<FreeHostingModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'stack' | 'github_actions' | 'vercel' | 'firebase_host'>('stack');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const downloadFile = (content: string, fileName: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/95">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-white text-base">
                  Deployment Center: Chevroz-Haze/idx-premarket
                </h3>
                <span className="bg-emerald-500/10 text-emerald-400 text-xs font-mono font-semibold px-2 py-0.5 rounded border border-emerald-500/30">
                  Root Configs Ready • $0/Mo
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                All deployment & cron files (.github/workflows/idx_scraper.yml, vercel.json, idx_disclosure_scraper.py) are generated in project root
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

        {/* Connected GitHub Repo Quick Action Bar */}
        <div className="px-6 py-3 bg-indigo-950/30 border-b border-indigo-500/30 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Github className="w-4 h-4 text-indigo-400" />
            <span className="text-slate-300">Target Repo:</span>
            <a
              href={USER_GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono font-bold text-indigo-300 hover:text-white underline flex items-center gap-1"
            >
              Chevroz-Haze/idx-premarket
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <a
              href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FChevroz-Haze%2Fidx-premarket"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition shadow-sm"
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>1-Click Deploy on Vercel</span>
            </a>
            <a
              href={`${USER_GITHUB_REPO}/settings/secrets/actions`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700 transition"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Add GitHub Secret</span>
            </a>
            <a
              href={`${USER_GITHUB_REPO}/actions`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700 transition"
            >
              <Play className="w-3.5 h-3.5 text-cyan-400" />
              <span>View Actions Cron</span>
            </a>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 py-2.5 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('stack')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                activeTab === 'stack'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Push to Chevroz-Haze/idx-premarket</span>
            </button>
            <button
              onClick={() => setActiveTab('github_actions')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                activeTab === 'github_actions'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Github className="w-3.5 h-3.5" />
              <span>.github/workflows/idx_scraper.yml</span>
            </button>
            <button
              onClick={() => setActiveTab('vercel')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                activeTab === 'vercel'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Vercel / Cloudflare Pages</span>
            </button>
            <button
              onClick={() => setActiveTab('firebase_host')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                activeTab === 'firebase_host'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Firebase Spark Plan ($0)</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {activeTab === 'stack' && (
            <div className="space-y-6">
              {/* Git Push Commands Box */}
              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    1. Push Project Files to Chevroz-Haze/idx-premarket
                  </h4>
                  <button
                    onClick={() => handleCopy(GIT_PUSH_COMMANDS, 'git')}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                  >
                    {copiedKey === 'git' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'git' ? 'Copied Commands' : 'Copy Git Commands'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  We have generated <code className="text-emerald-400">.github/workflows/idx_scraper.yml</code>, <code className="text-emerald-400">idx_disclosure_scraper.py</code>, <code className="text-emerald-400">requirements.txt</code>, and <code className="text-emerald-400">vercel.json</code> directly in your project root. Export/sync to GitHub or run:
                </p>
                <pre className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
                  {GIT_PUSH_COMMANDS}
                </pre>
              </div>

              {/* Step by Step Setup Checklist */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-4">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  2. Complete Setup for Chevroz-Haze/idx-premarket
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-3 p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold font-mono shrink-0">A</span>
                    <div className="flex-1">
                      <strong className="text-white block">Host Dashboard on Vercel (Free)</strong>
                      <span className="text-slate-400 block mt-0.5">
                        Click the <strong>"1-Click Deploy on Vercel"</strong> button above or import <code className="text-indigo-300">Chevroz-Haze/idx-premarket</code> at vercel.com/new. Vercel will automatically detect Vite and deploy your live dashboard URL.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold font-mono shrink-0">B</span>
                    <div className="flex-1">
                      <strong className="text-white block">Add FIREBASE_SERVICE_ACCOUNT Secret in Your Repo</strong>
                      <span className="text-slate-400 block mt-0.5">
                        Open <a href={`${USER_GITHUB_REPO}/settings/secrets/actions`} target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline">github.com/Chevroz-Haze/idx-premarket/settings/secrets/actions</a>, click <strong>"New repository secret"</strong>, name it <code className="text-emerald-400 font-mono">FIREBASE_SERVICE_ACCOUNT</code>, and paste your Firebase Service Account JSON key. (Even without this secret, the workflow runs safely in dry-run mode!).
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold font-mono shrink-0">C</span>
                    <div className="flex-1">
                      <strong className="text-white block">Trigger Your First Pre-Market Scrape on GitHub Actions</strong>
                      <span className="text-slate-400 block mt-0.5">
                        Go to <a href={`${USER_GITHUB_REPO}/actions`} target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline">github.com/Chevroz-Haze/idx-premarket/actions</a>, select <strong>"IDX Pre-Market Scraper & FCM Push"</strong> on the left sidebar, and click <strong>"Run workflow"</strong>.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'github_actions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Github className="w-4 h-4 text-white" />
                    .github/workflows/idx_scraper.yml (Saved in Project Root)
                  </h4>
                  <p className="text-xs text-slate-400">
                    Pre-configured for Chevroz-Haze/idx-premarket. Runs at 06:00, 07:00, 08:00, and 08:30 WIB.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(GITHUB_ACTIONS_WORKFLOW, 'ga')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700"
                  >
                    {copiedKey === 'ga' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'ga' ? 'Copied' : 'Copy Workflow'}</span>
                  </button>
                  <button
                    onClick={() => downloadFile(GITHUB_ACTIONS_WORKFLOW, 'idx_scraper.yml', 'text/yaml')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .yml</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-300 max-h-[420px] overflow-y-auto leading-relaxed whitespace-pre">
                {GITHUB_ACTIONS_WORKFLOW}
              </div>
            </div>
          )}

          {activeTab === 'vercel' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">Vercel & Cloudflare Pages Configuration (vercel.json)</h4>
                  <p className="text-xs text-slate-400">
                    Already placed in root `/vercel.json` for your repository.
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(VERCEL_CONFIG, 'vercel')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700"
                >
                  {copiedKey === 'vercel' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'vercel' ? 'Copied' : 'Copy vercel.json'}</span>
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-cyan-300 whitespace-pre">
                {VERCEL_CONFIG}
              </div>
            </div>
          )}

          {activeTab === 'firebase_host' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">Firebase Spark Plan ($0 Free Tier - firebase.json)</h4>
                  <p className="text-xs text-slate-400">
                    Already placed in root `/firebase.json` if you choose Firebase Hosting.
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(FIREBASE_JSON_CONFIG, 'fb')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700"
                >
                  {copiedKey === 'fb' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'fb' ? 'Copied' : 'Copy firebase.json'}</span>
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-amber-300 whitespace-pre">
                {FIREBASE_JSON_CONFIG}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Configured for github.com/Chevroz-Haze/idx-premarket</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition"
          >
            Close Deployment Center
          </button>
        </div>
      </div>
    </div>
  );
};
