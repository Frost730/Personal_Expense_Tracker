import type { Transaction, Budget } from '../types';

export function calculateTotalBalance(transactions: Transaction[]): number {
  const income = calculateTotalIncome(transactions);
  const expense = calculateTotalExpense(transactions);
  return income - expense;
}

export function calculateTotalIncome(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
}

export function calculateTotalExpense(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
}

export function filterTransactionsByMonth(transactions: Transaction[], monthStr: string): Transaction[] {
  return transactions.filter((t) => t.date && t.date.startsWith(monthStr));
}

export function calculateMonthlyIncome(transactions: Transaction[], monthStr: string): number {
  const monthlyTxs = filterTransactionsByMonth(transactions, monthStr);
  return calculateTotalIncome(monthlyTxs);
}

export function calculateMonthlyExpense(transactions: Transaction[], monthStr: string): number {
  const monthlyTxs = filterTransactionsByMonth(transactions, monthStr);
  return calculateTotalExpense(monthlyTxs);
}

export function calculateNetSavings(income: number, expense: number): number {
  return income - expense;
}

export function calculateSavingsRate(income: number, expense: number): number {
  if (!income || income <= 0) return 0;
  const savings = income - expense;
  const rate = (savings / income) * 100;
  return Math.max(Math.min(rate, 100), -100);
}

export interface CategorySpending {
  category: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export function calculateCategoryExpenses(
  transactions: Transaction[],
  monthStr?: string
): CategorySpending[] {
  const txs = monthStr ? filterTransactionsByMonth(transactions, monthStr) : transactions;
  const expenseTxs = txs.filter((t) => t.type === 'expense');
  const totalExpense = calculateTotalExpense(expenseTxs);

  const categoryMap: { [cat: string]: { amount: number; count: number } } = {};

  expenseTxs.forEach((t) => {
    const cat = t.category || 'Other';
    if (!categoryMap[cat]) {
      categoryMap[cat] = { amount: 0, count: 0 };
    }
    categoryMap[cat].amount += Number(t.amount) || 0;
    categoryMap[cat].count += 1;
  });

  return Object.entries(categoryMap)
    .map(([category, data]) => ({
      category,
      amount: data.amount,
      percentage: totalExpense > 0 ? (data.amount / totalExpense) * 100 : 0,
      transactionCount: data.count,
    }))
    .sort((a, b) => b.amount - a.amount);
}

export interface MonthTrendData {
  monthKey: string;
  displayMonth: string;
  income: number;
  expense: number;
  savings: number;
}

export function calculateMonthlyTrends(
  transactions: Transaction[],
  numMonths: number = 6
): MonthTrendData[] {
  const result: MonthTrendData[] = [];
  const today = new Date();

  for (let i = numMonths - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const monthKey = `${year}-${month}`;
    const displayMonth = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

    const income = calculateMonthlyIncome(transactions, monthKey);
    const expense = calculateMonthlyExpense(transactions, monthKey);
    const savings = calculateNetSavings(income, expense);

    result.push({
      monthKey,
      displayMonth,
      income,
      expense,
      savings,
    });
  }

  return result;
}

export interface DailySpendingData {
  day: number;
  dateStr: string;
  amount: number;
}

export function calculateDailySpending(
  transactions: Transaction[],
  monthStr: string
): DailySpendingData[] {
  const [year, month] = monthStr.split('-').map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const txs = filterTransactionsByMonth(transactions, monthStr).filter((t) => t.type === 'expense');

  const dailyMap: { [day: number]: number } = {};
  for (let d = 1; d <= daysInMonth; d++) {
    dailyMap[d] = 0;
  }

  txs.forEach((t) => {
    const day = parseInt(t.date.split('-')[2], 10);
    if (day && dailyMap[day] !== undefined) {
      dailyMap[day] += Number(t.amount) || 0;
    }
  });

  return Object.entries(dailyMap).map(([dayStr, amount]) => ({
    day: Number(dayStr),
    dateStr: `${monthStr}-${String(dayStr).padStart(2, '0')}`,
    amount,
  }));
}

export function calculateDailyAverage(
  transactions: Transaction[],
  monthStr: string
): number {
  const [year, month] = monthStr.split('-').map(Number);
  const now = new Date();
  const isCurrentMonth = now.getFullYear() === year && now.getMonth() + 1 === month;
  
  const totalDays = isCurrentMonth ? Math.max(1, now.getDate()) : new Date(year, month, 0).getDate();
  const totalExpense = calculateMonthlyExpense(transactions, monthStr);
  
  return totalDays > 0 ? totalExpense / totalDays : 0;
}

export type BudgetStatus = 'normal' | 'near-limit' | 'over-budget';

export interface BudgetHealth {
  budget: Budget;
  spent: number;
  remaining: number;
  percentageUsed: number;
  status: BudgetStatus;
}

export function calculateBudgetHealth(
  budgets: Budget[],
  transactions: Transaction[],
  monthStr: string
): BudgetHealth[] {
  const monthlyTxs = filterTransactionsByMonth(transactions, monthStr).filter(
    (t) => t.type === 'expense'
  );

  return budgets
    .filter((b) => b.month === monthStr)
    .map((b) => {
      const spent = monthlyTxs
        .filter((t) => t.category.toLowerCase() === b.category.toLowerCase())
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

      const remaining = b.amount - spent;
      const percentageUsed = b.amount > 0 ? (spent / b.amount) * 100 : 0;

      let status: BudgetStatus = 'normal';
      if (percentageUsed >= 100) {
        status = 'over-budget';
      } else if (percentageUsed >= 80) {
        status = 'near-limit';
      }

      return {
        budget: b,
        spent,
        remaining,
        percentageUsed,
        status,
      };
    })
    .sort((a, b) => b.percentageUsed - a.percentageUsed);
}
