import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useFinance } from '../../context/FinanceContext';
import type { TransactionType } from '../../types';
import { CategoryIcon } from '../common/CategoryIcon';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: TransactionType;
}

const AVAILABLE_ICONS = [
  'Utensils',
  'Car',
  'ShoppingBag',
  'Film',
  'Receipt',
  'Home',
  'GraduationCap',
  'HeartPulse',
  'Plane',
  'CreditCard',
  'User',
  'Briefcase',
  'Laptop',
  'TrendingUp',
  'PiggyBank',
  'Gift',
  'CircleDollarSign',
  'MoreHorizontal',
];

const PRESET_COLORS = [
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#10b981',
  '#06b6d4',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#64748b',
];

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'expense',
}) => {
  const { addCategory, categories } = useFinance();
  const [name, setName] = useState('');
  const [type, setType] = useState<TransactionType>(defaultType);
  const [color, setColor] = useState('#3b82f6');
  const [icon, setIcon] = useState('ShoppingBag');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmed = name.trim();
    if (!trimmed) {
      setError('Category name is required.');
      return;
    }

    const exists = categories.some(
      (c) => c.name.toLowerCase() === trimmed.toLowerCase() && c.type === type
    );
    if (exists) {
      setError(`A ${type} category named "${trimmed}" already exists.`);
      return;
    }

    addCategory({
      name: trimmed,
      type,
      color,
      icon,
    });

    setName('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Custom Category" maxWidth="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900/50">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Category Type
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`py-2 text-sm font-semibold rounded-lg transition-all ${
                type === 'expense'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`py-2 text-sm font-semibold rounded-lg transition-all ${
                type === 'income'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Income
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Category Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g., Gym, Pet Care, Freelance Project"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-3 sm:py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-base sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Color
          </label>
          <div className="flex flex-wrap gap-2.5">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                style={{ backgroundColor: c }}
                className={`w-8 h-8 sm:w-7 sm:h-7 rounded-full transition-transform active:scale-95 ${
                  color === c ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-white scale-110' : ''
                }`}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Icon
          </label>
          <div className="grid grid-cols-6 gap-2 max-h-36 overflow-y-auto p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800/40">
            {AVAILABLE_ICONS.map((ic) => (
              <button
                key={ic}
                type="button"
                onClick={() => setIcon(ic)}
                className={`p-2.5 sm:p-2 min-h-[40px] rounded-lg flex items-center justify-center transition-colors active:scale-95 ${
                  icon === ic
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <CategoryIcon name={ic} className="w-5 h-5" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 sm:flex-initial px-4 py-2.5 sm:py-2 text-sm font-medium rounded-xl text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 sm:flex-initial px-5 py-2.5 sm:py-2 text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors"
          >
            Create Category
          </button>
        </div>
      </form>
    </Modal>
  );
};
