import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  Smartphone, 
  Volume2, 
  Vibrate, 
  Check, 
  Plus, 
  Trash2, 
  Send, 
  ShieldCheck,
  Clock,
  Sparkles,
  Radio,
  Sliders,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { AlertPreferences, NotificationFrequency, MaterialityLevel, DisclosureCategory } from '../types';

interface AlertSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: AlertPreferences;
  onSavePreferences: (newPrefs: AlertPreferences) => void;
  onTriggerTestPush: (customTitle?: string, customBody?: string) => void;
}

export const AlertSettingsModal: React.FC<AlertSettingsModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onSavePreferences,
  onTriggerTestPush
}) => {
  const [formState, setFormState] = useState<AlertPreferences>({ ...preferences });
  const [newTicker, setNewTicker] = useState('');
  const [browserPermission, setBrowserPermission] = useState<string>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'unsupported'
  );
  const [testSentSuccess, setTestSentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFrequencyChange = (freq: NotificationFrequency) => {
    setFormState(prev => ({ ...prev, frequency: freq }));
  };

  const handleAddTicker = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newTicker.trim().toUpperCase();
    if (clean && !formState.watchlistTickers.includes(clean)) {
      setFormState(prev => ({
        ...prev,
        watchlistTickers: [...prev.watchlistTickers, clean]
      }));
      setNewTicker('');
    }
  };

  const handleRemoveTicker = (tickerToRemove: string) => {
    setFormState(prev => ({
      ...prev,
      watchlistTickers: prev.watchlistTickers.filter(t => t !== tickerToRemove)
    }));
  };

  const handleCategoryToggle = (cat: DisclosureCategory) => {
    setFormState(prev => ({
      ...prev,
      alertCategories: {
        ...prev.alertCategories,
        [cat]: !prev.alertCategories[cat]
      }
    }));
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setBrowserPermission(perm);
        if (perm === 'granted') {
          setFormState(prev => ({ ...prev, enableBrowserNotifications: true }));
        }
      } catch (err) {
        console.error('Error requesting push permission:', err);
      }
    }
  };

  const handleSendTestPush = () => {
    onTriggerTestPush(
      '🚨 [IDX 26 OKT 2026 GMT+7] UNTR: Payment Dividen Rp 430/Saham & PTPP Suspensi',
      'Aksi Korporasi Hari Ini (idx.co.id): Pembayaran dividen interim UNTR (Rp 430), ASGR (Rp 297), AALI (Rp 233), HMETD VKTR, & Suspensi PTPP.'
    );
    setTestSentSuccess(true);
    setTimeout(() => setTestSentSuccess(false), 3000);
  };

  const handleSave = () => {
    onSavePreferences(formState);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/95">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                Mobile Push & Alert Preferences Dashboard
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure notification frequency, pre-market morning digest, and ticker watchlists
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

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm flex-1">
          {/* Section 1: Notification Frequency */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
              1. Notification Frequency & Schedule
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option A: 08:30 WIB Morning Digest */}
              <div
                onClick={() => handleFrequencyChange('PRE_MARKET_DIGEST_0830')}
                className={`p-3.5 rounded-xl border cursor-pointer transition ${
                  formState.frequency === 'PRE_MARKET_DIGEST_0830'
                    ? 'bg-emerald-950/40 border-emerald-500/50 shadow-md shadow-emerald-950/20'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    Pre-Market Morning Digest (08:30 WIB)
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                    RECOMMENDED
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Consolidated push summary delivered at 08:30 WIB — exactly 15 minutes before Pre-Opening (08:45 WIB) and 30 minutes before continuous open (09:00 WIB).
                </p>
              </div>

              {/* Option B: Immediate Push */}
              <div
                onClick={() => handleFrequencyChange('IMMEDIATE')}
                className={`p-3.5 rounded-xl border cursor-pointer transition ${
                  formState.frequency === 'IMMEDIATE'
                    ? 'bg-emerald-950/40 border-emerald-500/50 shadow-md shadow-emerald-950/20'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Radio className="w-4 h-4 text-cyan-400" />
                    Real-Time Immediate Push
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono">15s Latency</span>
                </div>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Sends an instant mobile notification within 15 seconds whenever a company files on idx.co.id.
                </p>
              </div>

              {/* Option C: High Impact Siren Only */}
              <div
                onClick={() => handleFrequencyChange('HIGH_IMPACT_ONLY')}
                className={`p-3.5 rounded-xl border cursor-pointer transition ${
                  formState.frequency === 'HIGH_IMPACT_ONLY'
                    ? 'bg-emerald-950/40 border-emerald-500/50 shadow-md shadow-emerald-950/20'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-rose-400" />
                    High-Impact Sirens Only
                  </span>
                  <span className="text-[10px] text-rose-400 font-mono">Zero Noise</span>
                </div>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Only alert on Suspensions (Peng-SPT), Unusual Market Activity (UMA), Dividends, and Takeovers.
                </p>
              </div>

              {/* Option D: Hourly Pre-Open Digest */}
              <div
                onClick={() => handleFrequencyChange('HOURLY_PRE_OPEN')}
                className={`p-3.5 rounded-xl border cursor-pointer transition ${
                  formState.frequency === 'HOURLY_PRE_OPEN'
                    ? 'bg-emerald-950/40 border-emerald-500/50 shadow-md shadow-emerald-950/20'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-400" />
                    Hourly Pre-Market Briefing
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono">07:00, 08:00, 08:45</span>
                </div>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Hourly batches at 07:00, 08:00, and 08:45 WIB before orders matching begins.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Mobile Channels & Live Test Push */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
              2. Mobile Delivery Channels & Live Device Test
            </label>
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-white text-xs block">Mobile Browser / Web Push</span>
                    <span className="text-xs text-slate-400">
                      Permission: <strong className="text-slate-200 capitalize">{browserPermission}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {browserPermission !== 'granted' && (
                    <button
                      onClick={requestNotificationPermission}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition"
                    >
                      Enable Browser Push
                    </button>
                  )}
                  <button
                    onClick={handleSendTestPush}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Test Push to Phone</span>
                  </button>
                </div>
              </div>

              {testSentSuccess && (
                <div className="bg-emerald-950/50 border border-emerald-500/40 p-2.5 rounded-lg text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Test notification dispatched! Check your device lockscreen or top notification tray.</span>
                </div>
              )}

              {/* FCM Device Token Setup */}
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-xs font-semibold text-slate-300 block mb-1">
                  Firebase Cloud Messaging (FCM) Device Token:
                </span>
                <input
                  type="text"
                  value={formState.fcmDeviceToken}
                  onChange={(e) => setFormState(prev => ({ ...prev, fcmDeviceToken: e.target.value }))}
                  placeholder="e.g. fcm_token_device_abc123"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Automatically receives high-priority background data messages before 08:45 WIB.
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Ticker Watchlist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                3. Ticker Watchlist Filter
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formState.watchlistOnly}
                  onChange={(e) => setFormState(prev => ({ ...prev, watchlistOnly: e.target.checked }))}
                  className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0"
                />
                <span>Alert only on Watchlist tickers</span>
              </label>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
              {/* Add Ticker Input */}
              <form onSubmit={handleAddTicker} className="flex gap-2">
                <input
                  type="text"
                  value={newTicker}
                  onChange={(e) => setNewTicker(e.target.value)}
                  placeholder="Add 4-letter IDX ticker (e.g. ASII, PGAS, PTBA)"
                  maxLength={6}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200 uppercase focus:outline-none focus:border-emerald-500 flex-1"
                />
                <button
                  type="submit"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Ticker</span>
                </button>
              </form>

              {/* Ticker Badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                {formState.watchlistTickers.map(ticker => (
                  <span
                    key={ticker}
                    className="inline-flex items-center gap-1.5 bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-emerald-300"
                  >
                    <span>{ticker}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTicker(ticker)}
                      className="text-slate-400 hover:text-rose-400 transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Category Toggles */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
              4. Category Filters
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { key: 'CORPORATE_ACTION', label: 'Corporate Actions (Dividends/Buybacks)' },
                { key: 'SUSPENSION_UMA', label: 'Suspensions & UMA Warnings' },
                { key: 'FINANCIAL_REPORT', label: 'Financial Reports (Quarterly)' },
                { key: 'MATERIAL_INFORMATION', label: 'Material Info & M&A' },
                { key: 'RUPS_PUBLIC_EXPOSE', label: 'RUPS & Public Expose' },
                { key: 'INSIDER_TRANSACTION', label: 'Insider Trading Disclosures' }
              ].map(({ key, label }) => {
                const isChecked = formState.alertCategories[key as DisclosureCategory];
                return (
                  <label
                    key={key}
                    className={`flex items-start gap-2 p-2.5 rounded-lg border cursor-pointer text-xs transition ${
                      isChecked
                        ? 'bg-slate-800/80 border-slate-700 text-slate-200'
                        : 'bg-slate-950/40 border-slate-800 text-slate-500'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleCategoryToggle(key as DisclosureCategory)}
                      className="mt-0.5 rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0"
                    />
                    <span className="font-medium leading-tight">{label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formState.soundAlert}
                onChange={(e) => setFormState(prev => ({ ...prev, soundAlert: e.target.checked }))}
                className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0"
              />
              <Volume2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Sound Siren</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formState.vibrationPattern}
                onChange={(e) => setFormState(prev => ({ ...prev, vibrationPattern: e.target.checked }))}
                className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0"
              />
              <Vibrate className="w-3.5 h-3.5 text-slate-400" />
              <span>Vibration</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md shadow-emerald-950/20"
            >
              Save Alert Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
