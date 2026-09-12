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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-around">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[11px] font-medium p-1 ${
            isActive
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`
        }
      >
        <LayoutDashboard className="w-5 h-5" />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/transactions"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[11px] font-medium p-1 ${
            isActive
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`
        }
      >
        <ArrowLeftRight className="w-5 h-5" />
        <span>List</span>
      </NavLink>

      {/* Floating center action button */}
      <button
        onClick={onOpenAddModal}
        className="w-12 h-12 -mt-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 hover:bg-blue-700 active:scale-95 transition-transform"
        aria-label="Add transaction"
      >
        <Plus className="w-6 h-6" />
      </button>

      <NavLink
        to="/budgets"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[11px] font-medium p-1 ${
            isActive
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`
        }
      >
        <Target className="w-5 h-5" />
        <span>Budgets</span>
      </NavLink>

      <NavLink
        to="/analytics"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[11px] font-medium p-1 ${
            isActive
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`
        }
      >
        <PieChart className="w-5 h-5" />
        <span>Charts</span>
      </NavLink>

      <NavLink
        to="/settings"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[11px] font-medium p-1 ${
            isActive
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`
        }
      >
        <Settings className="w-5 h-5" />
        <span>Config</span>
      </NavLink>
    </nav>
  );
};
