import React, { useState } from 'react';
import { Modal } from './Modal';
import {
  Share,
  PlusSquare,
  MoreVertical,
  Download,
  Smartphone,
  CheckCircle2,
  WifiOff,
  Zap,
} from 'lucide-react';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  isIOS?: boolean;
}

export const InstallModal: React.FC<InstallModalProps> = ({
  isOpen,
  onClose,
  isIOS: initialIsIOS = false,
}) => {
  const [activeTab, setActiveTab] = useState<'ios' | 'android'>(
    initialIsIOS ? 'ios' : 'android'
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Download & Install App"
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* App summary banner */}
        <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200/60 dark:border-blue-900/50">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Personal Expense Tracker
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Install to your mobile home screen for the full native app experience
            </p>
          </div>
        </div>

        {/* Benefits list */}
        <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-medium text-slate-600 dark:text-slate-300">
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <WifiOff className="w-4 h-4 mx-auto mb-1 text-blue-500" />
            <span>100% Offline</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <Zap className="w-4 h-4 mx-auto mb-1 text-amber-500" />
            <span>Instant Load</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-emerald-500" />
            <span>No App Store</span>
          </div>
        </div>

        {/* Device selector tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('android')}
            className={`py-2 rounded-lg transition-all ${
              activeTab === 'android'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Android (Chrome / Edge)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ios')}
            className={`py-2 rounded-lg transition-all ${
              activeTab === 'ios'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            iPhone / iPad (Safari)
          </button>
        </div>

        {/* Step-by-step instructions */}
        {activeTab === 'ios' ? (
          <div className="space-y-3 text-xs">
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              Apple Safari does not allow automatic install banners. Follow these 3 quick steps:
            </p>

            <div className="space-y-2.5">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div className="flex-1">
                  <p className="text-slate-800 dark:text-slate-200 font-medium">
                    Tap the <strong className="text-blue-600 dark:text-blue-400">Share</strong> button at the bottom of Safari.
                  </p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    Look for the square icon with an arrow pointing up: <Share className="w-3.5 h-3.5 inline text-blue-500" />
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div className="flex-1">
                  <p className="text-slate-800 dark:text-slate-200 font-medium">
                    Scroll down and tap <strong className="text-slate-900 dark:text-white">"Add to Home Screen"</strong>.
                  </p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    Look for the plus icon inside a square: <PlusSquare className="w-3.5 h-3.5 inline text-slate-500" />
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div className="flex-1">
                  <p className="text-slate-800 dark:text-slate-200 font-medium">
                    Tap <strong className="text-blue-600 dark:text-blue-400">"Add"</strong> in the top right corner.
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    ExpenseTracker icon will now appear on your home screen like any normal app!
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-xs">
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              Install via Chrome or your default Android browser:
            </p>

            <div className="space-y-2.5">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div className="flex-1">
                  <p className="text-slate-800 dark:text-slate-200 font-medium">
                    Tap the <strong className="text-blue-600 dark:text-blue-400">Menu (⋮)</strong> icon in the top right corner of Chrome.
                  </p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    Look for the 3 vertical dots: <MoreVertical className="w-3.5 h-3.5 inline text-slate-500" />
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div className="flex-1">
                  <p className="text-slate-800 dark:text-slate-200 font-medium">
                    Tap <strong className="text-slate-900 dark:text-white">"Install app"</strong> or <strong className="text-slate-900 dark:text-white">"Add to Home screen"</strong>.
                  </p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    Look for the download icon: <Download className="w-3.5 h-3.5 inline text-emerald-500" />
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div className="flex-1">
                  <p className="text-slate-800 dark:text-slate-200 font-medium">
                    Confirm by tapping <strong className="text-blue-600 dark:text-blue-400">"Install"</strong>.
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    The app will install directly to your device launcher without taking storage for external APKs!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs"
          >
            Got It
          </button>
        </div>
      </div>
    </Modal>
  );
};
