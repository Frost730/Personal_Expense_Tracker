import React from 'react';
import { Plus, Calendar, RotateCcw } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

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

  const handleResetToCurrentMonth = () => {
    const now = new Date();
    const current = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    setSelectedMonth(current);
  };

  const currentMonthKey = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
  const isCurrentMonth = selectedMonth === currentMonthKey;

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {showMonthPicker && (
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl shadow-xs">
            <Calendar className="w-4 h-4 text-slate-400" />
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
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 pl-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Today</span>
              </button>
            )}
          </div>
        )}

        <div className="hidden sm:flex items-center px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60">
          {settings.currency}
        </div>

        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Transaction</span>
        </button>
      </div>
    </header>
  );
};
