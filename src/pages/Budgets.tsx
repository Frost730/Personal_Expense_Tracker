import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Target,
  Plus,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { Header } from '../components/layout/Header';
import { Card } from '../components/common/Card';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { BudgetModal } from '../components/modals/BudgetModal';
import type { Budget } from '../types';
import { formatCurrency, formatMonth, formatPercentage } from '../utils/formatters';

interface OutletContextType {
  openAddModal: () => void;
}

export const Budgets: React.FC = () => {
  const { openAddModal } = useOutletContext<OutletContextType>();
  const {
    selectedMonth,
    budgetHealthList,
    totalMonthlyBudget,
    monthlyExpense,
    deleteBudget,
    settings,
    categories,
  } = useFinance();

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Overall budget progress calculation
  const overallPercentage = totalMonthlyBudget > 0 ? (monthlyExpense / totalMonthlyBudget) * 100 : 0;
  const overallRemaining = Math.max(0, totalMonthlyBudget - monthlyExpense);
  const isOverBudget = monthlyExpense > totalMonthlyBudget && totalMonthlyBudget > 0;

  // Category Color Map
  const categoryColorMap = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((cat) => {
      map[cat.name.toLowerCase()] = cat.color;
    });
    return map;
  }, [categories]);

  // Counts of status
  const overBudgetCount = budgetHealthList.filter((b) => b.status === 'over-budget').length;
  const nearLimitCount = budgetHealthList.filter((b) => b.status === 'near-limit').length;
  const onTrackCount = budgetHealthList.filter((b) => b.status === 'normal').length;

  return (
    <div className="space-y-6">
      <Header
        title="Monthly Budgets"
        subtitle={`Budget tracking and thresholds for ${formatMonth(selectedMonth)}`}
        onOpenAddModal={openAddModal}
        showMonthPicker={true}
      />

      {/* Top Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Planned Budget"
          value={formatCurrency(totalMonthlyBudget, settings.currency)}
          subtitle={`${budgetHealthList.length} categories budgeted`}
          icon={<Target className="w-5 h-5" />}
          iconBgColor="bg-blue-50 dark:bg-blue-950/40"
          iconTextColor="text-blue-600 dark:text-blue-400"
        />

        <StatCard
          title="Total Spent So Far"
          value={formatCurrency(monthlyExpense, settings.currency)}
          subtitle={`${formatPercentage(overallPercentage)} of total budget`}
          icon={<Wallet className="w-5 h-5" />}
          iconBgColor="bg-purple-50 dark:bg-purple-950/40"
          iconTextColor="text-purple-600 dark:text-purple-400"
        />

        <StatCard
          title="Remaining Budget"
          value={formatCurrency(overallRemaining, settings.currency)}
          subtitle={isOverBudget ? 'Over planned total limit' : 'Safe spending margin'}
          icon={<TrendingUp className="w-5 h-5" />}
          iconBgColor={
            isOverBudget
              ? 'bg-rose-50 dark:bg-rose-950/40'
              : 'bg-emerald-50 dark:bg-emerald-950/40'
          }
          iconTextColor={
            isOverBudget
              ? 'text-rose-600 dark:text-rose-400'
              : 'text-emerald-600 dark:text-emerald-400'
          }
        />

        <StatCard
          title="Budget Health Status"
          value={`${onTrackCount} Normal`}
          subtitle={
            overBudgetCount > 0
              ? `${overBudgetCount} over budget!`
              : nearLimitCount > 0
              ? `${nearLimitCount} near limit`
              : 'All targets healthy'
          }
          icon={
            overBudgetCount > 0 ? (
              <AlertCircle className="w-5 h-5" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )
          }
          iconBgColor={
            overBudgetCount > 0
              ? 'bg-rose-50 dark:bg-rose-950/40'
              : nearLimitCount > 0
              ? 'bg-amber-50 dark:bg-amber-950/40'
              : 'bg-emerald-50 dark:bg-emerald-950/40'
          }
          iconTextColor={
            overBudgetCount > 0
              ? 'text-rose-600 dark:text-rose-400'
              : nearLimitCount > 0
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-emerald-600 dark:text-emerald-400'
          }
        />
      </div>

      {/* Action Toolbar to Add/Create Budget */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Category Targets
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Set custom spending limits per category to receive visual warnings
          </p>
        </div>

        <button
          onClick={() => {
            setEditingBudget(null);
            setIsBudgetModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-3.5 text-xs font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Set Category Budget</span>
          <span className="sm:hidden">Set Budget</span>
        </button>
      </div>

      {/* Budget Grid Cards */}
      {budgetHealthList.length === 0 ? (
        <EmptyState
          icon={<Target className="w-8 h-8 text-blue-500" />}
          title="No Budgets Set for This Month"
          description={`You haven't defined spending limits for ${formatMonth(selectedMonth)}. Setting targets helps keep your personal spending under control.`}
          action={{
            label: 'Set First Budget',
            onClick: () => {
              setEditingBudget(null);
              setIsBudgetModalOpen(true);
            },
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgetHealthList.map((item) => {
            const catColor =
              categoryColorMap[item.budget.category.toLowerCase()] || '#3b82f6';
            const isOver = item.status === 'over-budget';
            const isNear = item.status === 'near-limit';

            let statusBadge = (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" /> Normal
              </span>
            );

            let progressBarColor = 'bg-emerald-500';

            if (isOver) {
              statusBadge = (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full border border-rose-500/20">
                  <AlertCircle className="w-3 h-3" /> Over Budget
                </span>
              );
              progressBarColor = 'bg-rose-500';
            } else if (isNear) {
              statusBadge = (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-500/20">
                  <AlertTriangle className="w-3 h-3" /> Near Limit
                </span>
              );
              progressBarColor = 'bg-amber-500';
            }

            return (
              <Card
                key={item.budget.id}
                className={`flex flex-col justify-between transition-all border-l-4 ${
                  isOver
                    ? 'border-l-rose-500 dark:border-l-rose-500'
                    : isNear
                    ? 'border-l-amber-500 dark:border-l-amber-500'
                    : 'border-l-emerald-500 dark:border-l-emerald-500'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge label={item.budget.category} color={catColor} size="md" />
                    {statusBadge}
                  </div>

                  {/* Spending vs Limit */}
                  <div className="space-y-1 mb-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {formatCurrency(item.spent, settings.currency)}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        of {formatCurrency(item.budget.amount, settings.currency)}
                      </span>
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${progressBarColor}`}
                        style={{ width: `${Math.min(100, item.percentageUsed)}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[11px] pt-1 text-slate-500 dark:text-slate-400">
                      <span>{formatPercentage(item.percentageUsed)} used</span>
                      <span className={item.remaining < 0 ? 'text-rose-500 font-bold' : ''}>
                        {item.remaining >= 0
                          ? `${formatCurrency(item.remaining, settings.currency)} left`
                          : `${formatCurrency(Math.abs(item.remaining), settings.currency)} over`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card footer actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-slate-400 text-[11px]">
                    Month: {formatMonth(item.budget.month)}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setEditingBudget(item.budget);
                        setIsBudgetModalOpen(true);
                      }}
                      className="p-2 rounded-lg text-slate-400 hover:text-blue-600 bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/40 active:scale-95 transition-all"
                      title="Edit Target"
                      aria-label="Edit Target"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingId(item.budget.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-600 bg-slate-50 dark:bg-slate-800/80 hover:bg-rose-50 dark:hover:bg-rose-950/40 active:scale-95 transition-all"
                      title="Delete Budget"
                      aria-label="Delete Budget"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Set / Edit Budget Modal */}
      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => {
          setIsBudgetModalOpen(false);
          setEditingBudget(null);
        }}
        editBudget={editingBudget}
        defaultMonth={selectedMonth}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId) {
            deleteBudget(deletingId);
            setDeletingId(null);
          }
        }}
        title="Remove Budget Target"
        message="Are you sure you want to remove this category budget target? Your transaction history will remain intact."
        confirmText="Remove"
        isDestructive={true}
      />
    </div>
  );
};
