import React, { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Award,
  Zap,
  BarChart3,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useFinance } from '../context/FinanceContext';
import { Header } from '../components/layout/Header';
import { Card } from '../components/common/Card';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import {
  calculateCategoryExpenses,
  calculateMonthlyTrends,
  calculateDailyAverage,
} from '../utils/calculations';
import { formatCurrency, formatMonth, formatPercentage } from '../utils/formatters';

interface OutletContextType {
  openAddModal: () => void;
}

export const Analytics: React.FC = () => {
  const { openAddModal } = useOutletContext<OutletContextType>();
  const {
    transactions,
    selectedMonth,
    settings,
    categories,
  } = useFinance();

  // Time window for trend analysis (6 months vs 12 months)
  const [trendRange, setTrendRange] = useState<6 | 12>(6);

  // Category Color Map
  const categoryColorMap = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((cat) => {
      map[cat.name.toLowerCase()] = cat.color;
    });
    return map;
  }, [categories]);

  // Monthly trends
  const trendData = useMemo(() => {
    return calculateMonthlyTrends(transactions, trendRange);
  }, [transactions, trendRange]);

  // Category breakdown for selected month
  const categorySpendingMonth = useMemo(() => {
    return calculateCategoryExpenses(transactions, selectedMonth);
  }, [transactions, selectedMonth]);

  // All-time category breakdown
  const categorySpendingAllTime = useMemo(() => {
    return calculateCategoryExpenses(transactions);
  }, [transactions]);

  // Daily average for selected month
  const dailyAverageMonth = useMemo(() => {
    return calculateDailyAverage(transactions, selectedMonth);
  }, [transactions, selectedMonth]);

  // Average monthly spending across the trend period
  const averageMonthlyExpense = useMemo(() => {
    if (trendData.length === 0) return 0;
    const totalExp = trendData.reduce((acc, curr) => acc + curr.expense, 0);
    return totalExp / trendData.length;
  }, [trendData]);

  // Average monthly income across the trend period
  const averageMonthlyIncome = useMemo(() => {
    if (trendData.length === 0) return 0;
    const totalInc = trendData.reduce((acc, curr) => acc + curr.income, 0);
    return totalInc / trendData.length;
  }, [trendData]);

  // Highest spending category in selected month
  const topCategory = categorySpendingMonth[0];

  const hasData = transactions.length > 0;

  return (
    <div className="space-y-6">
      <Header
        title="Financial Analytics"
        subtitle={`In-depth spending patterns, savings velocity, and statistics for ${formatMonth(selectedMonth)}`}
        onOpenAddModal={openAddModal}
        showMonthPicker={true}
      />

      {!hasData ? (
        <EmptyState
          icon={<BarChart3 className="w-8 h-8 text-blue-500" />}
          title="No Analytics Available"
          description="Log some transactions or load demo data to view charts and statistics."
        />
      ) : (
        <>
          {/* Key Analytics KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Daily Spending Avg"
              value={formatCurrency(dailyAverageMonth, settings.currency)}
              subtitle={`Prorated for ${formatMonth(selectedMonth)}`}
              icon={<Zap className="w-5 h-5" />}
              iconBgColor="bg-amber-50 dark:bg-amber-950/40"
              iconTextColor="text-amber-600 dark:text-amber-400"
            />

            <StatCard
              title="Avg Monthly Spending"
              value={formatCurrency(averageMonthlyExpense, settings.currency)}
              subtitle={`Past ${trendRange}-month average`}
              icon={<TrendingDown className="w-5 h-5" />}
              iconBgColor="bg-rose-50 dark:bg-rose-950/40"
              iconTextColor="text-rose-600 dark:text-rose-400"
            />

            <StatCard
              title="Avg Monthly Income"
              value={formatCurrency(averageMonthlyIncome, settings.currency)}
              subtitle={`Past ${trendRange}-month average`}
              icon={<TrendingUp className="w-5 h-5" />}
              iconBgColor="bg-emerald-50 dark:bg-emerald-950/40"
              iconTextColor="text-emerald-600 dark:text-emerald-400"
            />

            <StatCard
              title="Top Expense Sector"
              value={topCategory ? topCategory.category : 'None'}
              subtitle={
                topCategory
                  ? `${formatCurrency(topCategory.amount, settings.currency)} (${formatPercentage(topCategory.percentage)})`
                  : 'No expenses this month'
              }
              icon={<Award className="w-5 h-5" />}
              iconBgColor="bg-purple-50 dark:bg-purple-950/40"
              iconTextColor="text-purple-600 dark:text-purple-400"
            />
          </div>

          {/* Cashflow Growth & Savings Velocity Chart */}
          <Card>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Monthly Cashflow & Net Savings
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Income vs Expenses with Net Savings curve over time
                </p>
              </div>

              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto">
                <button
                  onClick={() => setTrendRange(6)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                    trendRange === 6
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  6 Months
                </button>
                <button
                  onClick={() => setTrendRange(12)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                    trendRange === 12
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  12 Months
                </button>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" vertical={false} />
                  <XAxis dataKey="displayMonth" tickLine={false} stroke="#94a3b8" fontSize={11} />
                  <YAxis tickLine={false} stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="p-3 rounded-xl bg-slate-900 text-white shadow-xl text-xs space-y-1">
                            <p className="font-semibold text-slate-400 border-b border-slate-800 pb-1 mb-1">
                              {label}
                            </p>
                            <p className="text-emerald-400 font-medium">
                              Income: {formatCurrency(data.income, settings.currency)}
                            </p>
                            <p className="text-rose-400 font-medium">
                              Expenses: {formatCurrency(data.expense, settings.currency)}
                            </p>
                            <p className="text-blue-400 font-bold pt-1 border-t border-slate-800">
                              Net Savings: {formatCurrency(data.savings, settings.currency)}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" name="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="savings" name="Net Savings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Category Leaderboard & Proportion Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Spending Categories Leaderboard */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Highest Spending Categories
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Ranked by total expenditure for {formatMonth(selectedMonth)}
                  </p>
                </div>
              </div>

              {categorySpendingMonth.length > 0 ? (
                <div className="space-y-3.5">
                  {categorySpendingMonth.map((cat, idx) => {
                    const color = categoryColorMap[cat.category.toLowerCase()] || '#6366f1';

                    return (
                      <div key={cat.category} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-5 text-slate-400 font-bold text-[11px]">
                              #{idx + 1}
                            </span>
                            <Badge label={cat.category} color={color} size="sm" />
                            <span className="text-slate-400 text-[11px]">
                              ({cat.transactionCount} txs)
                            </span>
                          </div>
                          <div className="flex items-center gap-2 font-semibold">
                            <span className="text-slate-900 dark:text-white">
                              {formatCurrency(cat.amount, settings.currency)}
                            </span>
                            <span className="text-slate-400 font-normal">
                              {formatPercentage(cat.percentage)}
                            </span>
                          </div>
                        </div>

                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              backgroundColor: color,
                              width: `${cat.percentage}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-slate-400">
                  No expense records in this month.
                </div>
              )}
            </Card>

            {/* All-time Category Distribution */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    All-Time Expense Distribution
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Aggregate spending allocation across all logged records
                  </p>
                </div>
              </div>

              {categorySpendingAllTime.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
                  <div className="h-60 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categorySpendingAllTime}
                          dataKey="amount"
                          nameKey="category"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={2}
                        >
                          {categorySpendingAllTime.map((entry) => {
                            const color =
                              categoryColorMap[entry.category.toLowerCase()] || '#6366f1';
                            return <Cell key={entry.category} fill={color} />;
                          })}
                        </Pie>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload as (typeof categorySpendingAllTime)[0];
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

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {categorySpendingAllTime.slice(0, 6).map((item) => {
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
                <div className="py-12 text-center text-xs text-slate-400">
                  No expense records found.
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
};
