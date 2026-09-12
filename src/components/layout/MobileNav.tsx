import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Plus,
  Target,
  PieChart,
  Settings,
} from 'lucide-react';

interface MobileNavProps {
  onOpenAddModal: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onOpenAddModal }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] flex items-center justify-around shadow-lg">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center gap-1 text-[10px] font-semibold py-1 px-2 rounded-xl transition-all relative ${
            isActive
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <LayoutDashboard className="w-5 h-5" />
            <span>Home</span>
            {isActive && (
              <span className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
            )}
          </>
        )}
      </NavLink>

      <NavLink
        to="/transactions"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center gap-1 text-[10px] font-semibold py-1 px-2 rounded-xl transition-all relative ${
            isActive
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <ArrowLeftRight className="w-5 h-5" />
            <span>List</span>
            {isActive && (
              <span className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
            )}
          </>
        )}
      </NavLink>

      {/* Center prominent Add Button */}
      <button
        onClick={onOpenAddModal}
        className="w-12 h-12 -mt-6 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/40 ring-4 ring-slate-50 dark:ring-slate-950 active:scale-95 transition-all"
        aria-label="Add transaction"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

      <NavLink
        to="/budgets"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center gap-1 text-[10px] font-semibold py-1 px-2 rounded-xl transition-all relative ${
            isActive
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <Target className="w-5 h-5" />
            <span>Budgets</span>
            {isActive && (
              <span className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
            )}
          </>
        )}
      </NavLink>

      <NavLink
        to="/analytics"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center gap-1 text-[10px] font-semibold py-1 px-2 rounded-xl transition-all relative ${
            isActive
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <PieChart className="w-5 h-5" />
            <span>Charts</span>
            {isActive && (
              <span className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
            )}
          </>
        )}
      </NavLink>

      <NavLink
        to="/settings"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center gap-1 text-[10px] font-semibold py-1 px-2 rounded-xl transition-all relative ${
            isActive
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <Settings className="w-5 h-5" />
            <span>Config</span>
            {isActive && (
              <span className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
            )}
          </>
        )}
      </NavLink>
    </nav>
  );
};
