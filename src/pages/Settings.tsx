import React, { useState, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Globe,
  Sun,
  Moon,
  Laptop,
  Download,
  Upload,
  Trash2,
  ShieldCheck,
  Tag,
  Plus,
  Info,
  Smartphone,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { Header } from '../components/layout/Header';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { CategoryModal } from '../components/modals/CategoryModal';
import { SUPPORTED_CURRENCIES } from '../data/defaultData';
import { usePWA } from '../hooks/usePWA';
import type { ThemeMode } from '../types';

interface OutletContextType {
  openAddModal: () => void;
}

export const Settings: React.FC = () => {
  const { openAddModal } = useOutletContext<OutletContextType>();
  const {
    settings,
    setCurrency,
    setTheme,
    categories,
    deleteCategory,
    exportDataToFile,
    exportTransactionsCSV,
    importDataFromFile,
    clearAllData,
    transactions,
  } = useFinance();

  const { isInstallable, isInstalled, installApp } = usePWA();

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const [isImportConfirmOpen, setIsImportConfirmOpen] = useState(false);
  const [pendingImportJson, setPendingImportJson] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setPendingImportJson(content);
        setIsImportConfirmOpen(true);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const executeImport = () => {
    if (pendingImportJson) {
      importDataFromFile(pendingImportJson);
      setPendingImportJson(null);
    }
  };

  const themes: { id: ThemeMode; label: string; icon: React.FC<any> }[] = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Laptop },
  ];

  const expenseCategories = categories.filter((c) => c.type === 'expense');
  const incomeCategories = categories.filter((c) => c.type === 'income');

  return (
    <div className="space-y-6">
      <Header
        title="Settings & Preferences"
        subtitle="Manage currency, theme, categories, backup & privacy"
        onOpenAddModal={openAddModal}
        showMonthPicker={false}
      />

      {/* Data Privacy Banner */}
      <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 flex items-start gap-3.5">
        <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-emerald-950 dark:text-emerald-200">
            100% Local Storage & Privacy Guaranteed
          </h3>
          <p className="text-xs text-emerald-800 dark:text-emerald-300/90 mt-0.5 leading-relaxed">
            Your financial data is stored locally in this browser and is not uploaded to a server. No accounts, cookies, analytics tracking, or remote databases are used.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Currency & Appearance */}
        <div className="space-y-6">
          {/* Currency Selection */}
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Currency
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select your primary display currency format
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SUPPORTED_CURRENCIES.map((curr) => {
                const isSelected = settings.currency === curr.code;
                return (
                  <button
                    key={curr.code}
                    onClick={() => setCurrency(curr.code)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-900 dark:text-white">
                        {curr.symbol}
                      </span>
                      <span>{curr.name}</span>
                    </div>
                    <span className="text-slate-400">{curr.code}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Theme Selection */}
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Theme Appearance
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Choose between Light, Dark, or System preference
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {themes.map((t) => {
                const isSelected = settings.theme === t.id;
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`flex flex-col items-center justify-center gap-2 p-3.5 rounded-xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Backup, Import & Export */}
          <Card className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Data Backup & Restore
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Export your data to a JSON file or import a backup
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <button
                onClick={exportDataToFile}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export JSON</span>
              </button>

              <button
                onClick={exportTransactionsCSV}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Import JSON</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
              <button
                onClick={() => setIsClearConfirmOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Stored Data</span>
              </button>
            </div>
          </Card>
        </div>

        {/* Categories Management & About */}
        <div className="space-y-6">
          {/* Custom Category Management */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Categories
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Manage default and custom categories
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Category</span>
              </button>
            </div>

            {/* Expense Categories */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Expense Categories ({expenseCategories.length})
              </p>
              <div className="flex flex-wrap gap-2 max-h-44 overflow-y-auto pr-1">
                {expenseCategories.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center gap-1.5 p-1 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-xs"
                  >
                    <Badge label={cat.name} color={cat.color} size="sm" />
                    {!cat.isDefault && (
                      <button
                        onClick={() => deleteCategory(cat.id)}
                        className="p-1 text-slate-400 hover:text-rose-500"
                        title="Delete custom category"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Income Categories */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Income Categories ({incomeCategories.length})
              </p>
              <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
                {incomeCategories.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center gap-1.5 p-1 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-xs"
                  >
                    <Badge label={cat.name} color={cat.color} size="sm" />
                    {!cat.isDefault && (
                      <button
                        onClick={() => deleteCategory(cat.id)}
                        className="p-1 text-slate-400 hover:text-rose-500"
                        title="Delete custom category"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Progressive Web App Status & Install */}
          <Card className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Progressive Web App (PWA)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Offline access, home screen launcher & native experience
                  </p>
                </div>
              </div>

              {isInstalled ? (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Installed
                </span>
              ) : isInstallable ? (
                <button
                  onClick={installApp}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
                >
                  Install Now
                </button>
              ) : (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  Offline Ready
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              This application is equipped with a background service worker. All pages, scripts, charts, and icons are precached, allowing the app to open instantly even when completely disconnected from the internet.
            </p>
          </Card>

          {/* About & Technical Info */}
          <Card className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
              <Info className="w-4 h-4 text-blue-600" />
              <span>About Personal Expense Tracker</span>
            </div>

            <p className="leading-relaxed">
              A standalone, serverless, client-side personal finance dashboard engineered with <strong>React 19</strong>, <strong>Vite</strong>, <strong>Tailwind CSS v4</strong>, and <strong>Recharts</strong>.
            </p>

            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Deployment Target</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">GitHub Pages (Static)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Persistence Architecture</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Browser localStorage API</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Transactions Recorded</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{transactions.length} entries</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Application Version</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">1.0.0 Production</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Category Creation Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />

      {/* Clear All Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isClearConfirmOpen}
        onClose={() => setIsClearConfirmOpen(false)}
        onConfirm={clearAllData}
        title="Clear All Application Data"
        message="Are you completely sure? This will permanently delete all your transactions, custom categories, and budgets from this browser. Consider exporting a backup first."
        confirmText="Yes, Clear All"
        isDestructive={true}
      />

      {/* Import Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isImportConfirmOpen}
        onClose={() => {
          setIsImportConfirmOpen(false);
          setPendingImportJson(null);
        }}
        onConfirm={executeImport}
        title="Restore Backup Data"
        message="Importing this file will merge and overwrite current transaction records. Would you like to proceed with the restoration?"
        confirmText="Import Backup"
        isDestructive={false}
      />
    </div>
  );
};
