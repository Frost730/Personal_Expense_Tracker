import React from 'react';
import { Plus, Calendar, RotateCcw, Download } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { usePWA } from '../../hooks/usePWA';
import { getLocalCurrentMonth } from '../../utils/formatters';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onOpenAddModal: () => void;
  showMonthPicker?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onOpenAddModal,
  showMonthPicker = true,
}) => {
  const { selectedMonth, setSelectedMonth, settings } = useFinance();
  const { isInstalled, installApp } = usePWA();

  const handleResetToCurrentMonth = () => {
    setSelectedMonth(getLocalCurrentMonth());
  };

  const isCurrentMonth = selectedMonth === getLocalCurrentMonth();

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-slate-200/80 dark:border-slate-800">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
        {showMonthPicker && (
          <div className="flex items-center gap-1.5 sm:gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 sm:px-3 py-1.5 rounded-xl shadow-xs text-xs">
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 shrink-0" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-xs font-semibold text-slate-700 dark:text-slate-200 bg-transparent focus:outline-hidden cursor-pointer"
            />
            {!isCurrentMonth && (
              <button
                onClick={handleResetToCurrentMonth}
                title="Reset to current month"
                className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 pl-1 shrink-0 font-medium"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden xs:inline">Today</span>
              </button>
            )}
          </div>
        )}

        <div className="hidden md:flex items-center px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60 shrink-0">
          {settings.currency}
        </div>

        {!isInstalled && (
          <button
            onClick={() => installApp()}
            title="Download & Install App"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 active:scale-95 transition-all shrink-0 ml-auto sm:ml-0"
          >
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="hidden xs:inline">Download</span>
            <span className="hidden sm:inline">App</span>
          </button>
        )}

        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20 active:scale-95 transition-all shrink-0"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Add <span className="hidden sm:inline">Transaction</span></span>
        </button>
      </div>
    </header>
  );
};
