import React, { useState } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { usePWA } from '../../hooks/usePWA';
import { InstallModal } from './InstallModal';

const DISMISS_KEY = 'expenseTracker_install_banner_dismissed_at';
const DISMISS_COOLDOWN_DAYS = 3;

export const PWAInstallBanner: React.FC = () => {
  const { isInstalled, isIOS, installApp, isInstallModalOpen, setIsInstallModalOpen } = usePWA();
  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      const dismissedAt = localStorage.getItem(DISMISS_KEY);
      if (dismissedAt) {
        const diffDays =
          (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24);
        return diffDays < DISMISS_COOLDOWN_DAYS;
      }
      return false;
    } catch {
      return false;
    }
  });

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, Date.now().toString());
    } catch {
      // ignore
    }
  };

  const handleInstallClick = async () => {
    const res = await installApp();
    if (res === 'manual') {
      setIsInstallModalOpen(true);
    }
  };

  // Don't render banner if already installed or dismissed
  if (isInstalled || isDismissed) {
    return (
      <InstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        isIOS={isIOS}
      />
    );
  }

  return (
    <>
      {/* Mobile Floating Install Banner (fixed right above the mobile bottom nav with safe-area spacing) */}
      <div className="md:hidden fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom))] left-3 right-3 z-35 animate-in slide-in-from-bottom duration-300">
        <div className="bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md text-white px-3.5 py-3 rounded-2xl shadow-xl border border-slate-700/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/30">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold leading-tight truncate">
                Download Expense Tracker
              </h4>
              <p className="text-[11px] text-slate-300 dark:text-slate-400 leading-tight truncate">
                Install app for offline & full-screen mode
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 active:scale-95 text-white shadow-xs transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
            <button
              onClick={handleDismiss}
              aria-label="Dismiss banner"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Visual Instruction Modal */}
      <InstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        isIOS={isIOS}
      />
    </>
  );
};
