import React, { useMemo } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import { useFinance } from '../context/FinanceContext';
import { Header } from '../components/layout/Header';
import { Card } from '../components/common/Card';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { formatCurrency, formatDate, formatMonth, formatPercentage } from '../utils/formatters';
import {
  calculateCategoryExpenses,
  calculateMonthlyTrends,
  calculateDailySpending,
} from '../utils/calculations';

interface OutletContextType {
  openAddModal: () => void;
}

export const Dashboard: React.FC = () => {
  const { openAddModal } = useOutletContext<OutletContextType>();
  const {
    transactions,
    selectedMonth,
    totalBalance,
    monthlyIncome,
    monthlyExpense,
    monthlySavings,
    monthlySavingsRate,
    budgetHealthList,
    totalMonthlyBudget,
    remainingMonthlyBudget,
    recentTransactions,
    settings,
    categories,
    loadSampleData,
  } = useFinance();

  // Category expenses for selected month
  const categorySpending = useMemo(() => {
    return calculateCategoryExpenses(transactions, selectedMonth);
  }, [transactions, selectedMonth]);

  // Color map for categories
  const categoryColorMap = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((cat) => {
      map[cat.name.toLowerCase()] = cat.color;
    });
    return map;
  }, [categories]);

  // Monthly 6-month trends
  const trendData = useMemo(() => {
    return calculateMonthlyTrends(transactions, 6);
  }, [transactions]);

  // Daily spending in current selected month
  const dailySpendingData = useMemo(() => {
    return calculateDailySpending(transactions, selectedMonth);
  }, [transactions, selectedMonth]);

  const hasNoData = transactions.length === 0;

  return (
    <div className="space-y-6">
      <Header
        title="Financial Overview"
        subtitle={`Summary and activity for ${formatMonth(selectedMonth)}`}
        onOpenAddModal={openAddModal}
        showMonthPicker={true}
      />

      {hasNoData ? (
        <EmptyState
          icon={<Sparkles className="w-10 h-10 text-blue-500" />}
          title="No Transactions Recorded"
          description="Start logging your income and expenses to unlock insights, category breakdowns, and budget tracking."
          action={{
            label: 'Load Sample Data',
            onClick: loadSampleData,
          }}
        />
      ) : (
        <>
          {/* Top Key Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Net Balance"
              value={formatCurrency(totalBalance, settings.currency)}
              subtitle="All accounts combined"
              icon={<Wallet className="w-5 h-5" />}
              iconBgColor="bg-blue-50 dark:bg-blue-950/40"
              iconTextColor="text-blue-600 dark:text-blue-400"
            />

            <StatCard
              title="Monthly Income"
              value={formatCurrency(monthlyIncome, settings.currency)}
              subtitle={`For ${formatMonth(selectedMonth)}`}
              icon={<TrendingUp className="w-5 h-5" />}
              iconBgColor="bg-emerald-50 dark:bg-emerald-950/40"
              iconTextColor="text-emerald-600 dark:text-emerald-400"
            />

            <StatCard
              title="Monthly Spending"
              value={formatCurrency(monthlyExpense, settings.currency)}
              subtitle={`For ${formatMonth(selectedMonth)}`}
              icon={<TrendingDown className="w-5 h-5" />}
              iconBgColor="bg-rose-50 dark:bg-rose-950/40"
              iconTextColor="text-rose-600 dark:text-rose-400"
            />

            <StatCard
              title="Net Savings"
              value={formatCurrency(monthlySavings, settings.currency)}
              subtitle={`Savings rate: ${formatPercentage(monthlySavingsRate)}`}
              icon={<PiggyBank className="w-5 h-5" />}
              iconBgColor="bg-purple-50 dark:bg-purple-950/40"
              iconTextColor="text-purple-600 dark:text-purple-400"
              trend={{
                value: formatPercentage(monthlySavingsRate),
                isPositive: monthlySavings >= 0,
              }}
            />
          </div>

          {/* Budget Quick Glance & Daily Spending Area Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Daily Spending Trend */}
            <Card className="lg:col-span-2 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Daily Spending Trend
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Expense distribution across days in {formatMonth(selectedMonth)}
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  Total: {formatCurrency(monthlyExpense, settings.currency)}
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailySpendingData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" vertical={false} />
                    <XAxis
                      dataKey="day"
                      tickLine={false}
                      stroke="#94a3b8"
                      fontSize={11}
                      interval={2}
                    />
                    <YAxis
                      tickLine={false}
                      stroke="#94a3b8"
                      fontSize={11}
                      tickFormatter={(val) => `${val}`}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="p-2.5 rounded-xl bg-slate-900 text-white shadow-xl text-xs">
                              <p className="font-semibold text-slate-400 mb-1">
                                {formatDate(data.dateStr)}
                              </p>
                              <p className="font-bold text-sm text-blue-400">
                                {formatCurrency(data.amount, settings.currency)}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#3b82f6"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#spendingGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Budget Utilization Widget */}
            <Card className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    Monthly Budget
                  </h3>
                  <Link
                    to="/budgets"
                    className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-0.5"
                  >
                    Manage <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>

                {totalMonthlyBudget > 0 ? (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
                      <div className="flex justify-between text-xs mb-1 font-medium">
                        <span className="text-slate-500">Remaining Budget</span>
                        <span className={remainingMonthlyBudget > 0 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-rose-500 font-bold'}>
                          {formatCurrency(remainingMonthlyBudget, settings.currency)}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            monthlyExpense > totalMonthlyBudget
                              ? 'bg-rose-500'
                              : monthlyExpense / totalMonthlyBudget >= 0.8
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{
                            width: `${Math.min(100, (monthlyExpense / totalMonthlyBudget) * 100)}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400 mt-1.5">
                        <span>Spent: {formatCurrency(monthlyExpense, settings.currency)}</span>
                        <span>Goal: {formatCurrency(totalMonthlyBudget, settings.currency)}</span>
                      </div>
                    </div>

                    {/* Top Category Budget Bars */}
                    <div className="space-y-2.5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Category Progress
                      </p>
                      {budgetHealthList.slice(0, 3).map((item) => {
                        const statusColor =
                          item.status === 'over-budget'
                            ? 'bg-rose-500'
                            : item.status === 'near-limit'
                            ? 'bg-amber-500'
                            : 'bg-emerald-500';

                        return (
                          <div key={item.budget.id} className="text-xs space-y-1">
                            <div className="flex justify-between font-medium">
                              <span className="text-slate-700 dark:text-slate-200">
                                {item.budget.category}
                              </span>
                              <span className="text-slate-500">
                                {formatCurrency(item.spent, settings.currency)} / {formatCurrency(item.budget.amount, settings.currency)}
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${statusColor}`}
                                style={{ width: `${Math.min(100, item.percentageUsed)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 space-y-2">
                    <p className="text-xs text-slate-500">No budget goals configured for this month.</p>
                    <Link
                      to="/budgets"
                      className="inline-block px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      Set Monthly Budget
                    </Link>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Income vs Expenses Bar Chart & Category Breakdown Donut */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Income vs Expense 6-Month History */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Income vs Expenses
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    6-month comparative trajectory
                  </p>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" vertical={false} />
                    <XAxis dataKey="displayMonth" tickLine={false} stroke="#94a3b8" fontSize={11} />
                    <YAxis tickLine={false} stroke="#94a3b8" fontSize={11} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="p-3 rounded-xl bg-slate-900 text-white shadow-xl text-xs space-y-1">
                              <p className="font-semibold text-slate-400 border-b border-slate-800 pb-1 mb-1">
                                {label}
                              </p>
                              <p className="text-emerald-400 font-medium">
                                Income: {formatCurrency(Number(payload[0]?.value || 0), settings.currency)}
                              </p>
                              <p className="text-rose-400 font-medium">
                                Expense: {formatCurrency(Number(payload[1]?.value || 0), settings.currency)}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Income" />
                    <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Expense" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Expenses by Category Donut Chart */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Expense by Category
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Distribution for {formatMonth(selectedMonth)}
                  </p>
                </div>
              </div>

              {categorySpending.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
                  <div className="h-60 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categorySpending}
                          dataKey="amount"
                          nameKey="category"
                          innerRadius={55}
                          outerRadius={80}
                          paddingAngle={3}
                        >
                          {categorySpending.map((entry) => {
                            const color =
                              categoryColorMap[entry.category.toLowerCase()] || '#6366f1';
                            return <Cell key={entry.category} fill={color} />;
                          })}
                        </Pie>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload as (typeof categorySpending)[0];
                              return (
                                <div className="p-2.5 rounded-xl bg-slate-900 text-white shadow-xl text-xs">
                                  <p className="font-bold">{data.category}</p>
                                  <p className="text-slate-300">
                                    {formatCurrency(data.amount, settings.currency)} (
                                    {formatPercentage(data.percentage)})
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Legend list */}
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {categorySpending.slice(0, 5).map((item) => {
                      const color = categoryColorMap[item.category.toLowerCase()] || '#6366f1';
                      return (
                        <div
                          key={item.category}
                          className="flex items-center justify-between text-xs font-medium"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-slate-700 dark:text-slate-200 truncate">
                              {item.category}
                            </span>
                          </div>
                          <span className="text-slate-500 shrink-0 font-semibold">
                            {formatPercentage(item.percentage)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="h-60 flex flex-col items-center justify-center text-slate-400 text-xs">
                  <p>No expense transactions recorded in this month.</p>
                </div>
              )}
            </Card>
          </div>

          {/* Recent Transactions Table */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Recent Transactions
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Latest activity across your accounts
                </p>
              </div>
              <Link
                to="/transactions"
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                View all transactions <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentTransactions.map((tx) => {
                const isIncome = tx.type === 'income';
                const catColor = categoryColorMap[tx.category.toLowerCase()] || '#64748b';

                return (
                  <div
                    key={tx.id}
                    className="py-3 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/40 rounded-xl px-2 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isIncome
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {isIncome ? (
                          <ArrowUpRight className="w-5 h-5" />
                        ) : (
                          <ArrowDownRight className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
                          {tx.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-400">
                            {formatDate(tx.date)}
                          </span>
                          <span className="text-slate-300 dark:text-slate-700">•</span>
                          <Badge label={tx.category} color={catColor} size="sm" />
                          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
                          <span className="hidden sm:inline text-[11px] text-slate-400">
                            {tx.paymentMethod}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`text-sm font-bold tracking-tight ${
                        isIncome
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                      {formatCurrency(tx.amount, settings.currency)}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};
