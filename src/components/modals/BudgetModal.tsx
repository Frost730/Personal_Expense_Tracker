import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useFinance } from '../../context/FinanceContext';
import type { Budget } from '../../types';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  editBudget?: Budget | null;
  defaultMonth: string;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  editBudget,
  defaultMonth,
}) => {
  const { categories, saveBudget } = useFinance();
  const [category, setCategory] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [month, setMonth] = useState<string>(defaultMonth);
  const [error, setError] = useState<string>('');

  const expenseCategories = categories.filter((c) => c.type === 'expense');

  useEffect(() => {
    if (editBudget) {
      setCategory(editBudget.category);
      setAmount(String(editBudget.amount));
      setMonth(editBudget.month);
      setError('');
    } else {
      if (expenseCategories.length > 0) {
        setCategory(expenseCategories[0].name);
      }
      setAmount('');
      setMonth(defaultMonth);
      setError('');
    }
  }, [editBudget, isOpen, defaultMonth, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please specify a budget amount greater than 0.');
      return;
    }

    if (!category) {
      setError('Please select an expense category.');
      return;
    }

    saveBudget(category, numAmount, month);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editBudget ? 'Update Budget' : 'Set Category Budget'}
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900/50">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={!!editBudget}
            className="w-full px-3.5 py-3 sm:py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 disabled:opacity-60 capitalize text-base sm:text-sm"
          >
            {expenseCategories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Month
          </label>
          <input
            type="month"
            required
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full px-3.5 py-3 sm:py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-base sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Budget Amount Limit *
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            required
            placeholder="500.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3.5 py-3 sm:py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium text-base sm:text-sm"
          />
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
            {editBudget ? 'Save Target' : 'Set Budget'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
