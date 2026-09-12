import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  Target,
  Settings,
  ShieldCheck,
  Moon,
  Sun,
  Laptop,
  Wallet,
  Smartphone,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';
import { usePWA } from '../../hooks/usePWA';

export const Sidebar: React.FC = () => {
  const { totalBalance, settings, setTheme } = useFinance();
  const { isInstallable, installApp } = usePWA();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
    { to: '/budgets', label: 'Budgets', icon: Target },
    { to: '/analytics', label: 'Analytics', icon: PieChart },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const cycleTheme = () => {
    if (settings.theme === 'light') setTheme('dark');
    else if (settings.theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const getThemeIcon = () => {
    if (settings.theme === 'light') return <Sun className="w-4 h-4 text-amber-500" />;
    if (settings.theme === 'dark') return <Moon className="w-4 h-4 text-blue-400" />;
    return <Laptop className="w-4 h-4 text-slate-400" />;
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-5 shrink-0 min-h-screen justify-between select-none">
      <div className="space-y-6">
        {/* Brand */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
              ExpenseTracker
            </h1>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
              Personal Finance
            </span>
          </div>
        </div>

        {/* Balance Card Snapshot */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/60 dark:to-slate-900/80 border border-slate-200/70 dark:border-slate-800">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            Total Net Balance
          </p>
          <div className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {formatCurrency(totalBalance, settings.currency)}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer controls: PWA install, theme & local storage notice */}
      <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        {isInstallable && (
          <button
            onClick={installApp}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-xs"
          >
            <Smartphone className="w-4 h-4" />
            <span>Install App</span>
          </button>
        )}

        <button
          onClick={cycleTheme}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200/50 dark:border-slate-700/50"
        >
          <span className="flex items-center gap-2">
            {getThemeIcon()}
            <span>Theme: {settings.theme.charAt(0).toUpperCase() + settings.theme.slice(1)}</span>
          </span>
          <span className="text-[10px] uppercase tracking-wider text-slate-400">Switch</span>
        </button>

        <div className="flex items-center gap-2 px-2 text-[11px] text-slate-400 dark:text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Local storage only. 100% private.</span>
        </div>
      </div>
    </aside>
  );
};
