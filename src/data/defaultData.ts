import type { Category, CurrencyConfig, Settings, Transaction, Budget } from '../types';

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', position: 'prefix' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', position: 'prefix' },
  { code: 'EUR', symbol: '€', name: 'Euro', position: 'prefix' },
  { code: 'GBP', symbol: '£', name: 'British Pound', position: 'prefix' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', position: 'prefix' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', position: 'prefix' },
  { code: 'AUD', symbol: 'AU$', name: 'Australian Dollar', position: 'prefix' },
];

export const DEFAULT_SETTINGS: Settings = {
  currency: 'USD',
  theme: 'system',
};

export const DEFAULT_CATEGORIES: Category[] = [
  // Expense Categories
  { id: 'exp-food', name: 'Food', type: 'expense', color: '#ef4444', icon: 'Utensils', isDefault: true },
  { id: 'exp-transport', name: 'Transport', type: 'expense', color: '#f97316', icon: 'Car', isDefault: true },
  { id: 'exp-shopping', name: 'Shopping', type: 'expense', color: '#ec4899', icon: 'ShoppingBag', isDefault: true },
  { id: 'exp-entertainment', name: 'Entertainment', type: 'expense', color: '#8b5cf6', icon: 'Film', isDefault: true },
  { id: 'exp-bills', name: 'Bills', type: 'expense', color: '#06b6d4', icon: 'Receipt', isDefault: true },
  { id: 'exp-rent', name: 'Rent', type: 'expense', color: '#3b82f6', icon: 'Home', isDefault: true },
  { id: 'exp-education', name: 'Education', type: 'expense', color: '#10b981', icon: 'GraduationCap', isDefault: true },
  { id: 'exp-health', name: 'Health', type: 'expense', color: '#14b8a6', icon: 'HeartPulse', isDefault: true },
  { id: 'exp-travel', name: 'Travel', type: 'expense', color: '#6366f1', icon: 'Plane', isDefault: true },
  { id: 'exp-subscriptions', name: 'Subscriptions', type: 'expense', color: '#a855f7', icon: 'CreditCard', isDefault: true },
  { id: 'exp-personal', name: 'Personal', type: 'expense', color: '#eab308', icon: 'User', isDefault: true },
  { id: 'exp-other', name: 'Other', type: 'expense', color: '#64748b', icon: 'MoreHorizontal', isDefault: true },

  // Income Categories
  { id: 'inc-salary', name: 'Salary', type: 'income', color: '#10b981', icon: 'Briefcase', isDefault: true },
  { id: 'inc-freelance', name: 'Freelance', type: 'income', color: '#3b82f6', icon: 'Laptop', isDefault: true },
  { id: 'inc-business', name: 'Business', type: 'income', color: '#8b5cf6', icon: 'TrendingUp', isDefault: true },
  { id: 'inc-investment', name: 'Investment', type: 'income', color: '#06b6d4', icon: 'PiggyBank', isDefault: true },
  { id: 'inc-gift', name: 'Gift', type: 'income', color: '#ec4899', icon: 'Gift', isDefault: true },
  { id: 'inc-other', name: 'Other', type: 'income', color: '#64748b', icon: 'CircleDollarSign', isDefault: true },
];

export const PAYMENT_METHODS = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'UPI / Bank Transfer',
  'Other',
] as const;

export const generateSampleData = (): { transactions: Transaction[]; budgets: Budget[] } => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonthNum = today.getMonth() + 1;
  const currentMonth = `${currentYear}-${String(currentMonthNum).padStart(2, '0')}`;

  const prevMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const prevMonth = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}`;

  const sampleBudgets: Budget[] = [
    { id: 'b-1', month: currentMonth, category: 'Food', amount: 500 },
    { id: 'b-2', month: currentMonth, category: 'Transport', amount: 200 },
    { id: 'b-3', month: currentMonth, category: 'Shopping', amount: 350 },
    { id: 'b-4', month: currentMonth, category: 'Bills', amount: 300 },
    { id: 'b-5', month: currentMonth, category: 'Entertainment', amount: 150 },
    { id: 'b-6', month: currentMonth, category: 'Subscriptions', amount: 80 },
  ];

  const padDay = (day: number) => String(day).padStart(2, '0');

  const sampleTransactions: Transaction[] = [
    // Current Month Income
    {
      id: 'tx-1',
      type: 'income',
      amount: 4500,
      category: 'Salary',
      description: 'Monthly Tech Lead Salary',
      date: `${currentMonth}-01`,
      paymentMethod: 'UPI / Bank Transfer',
      notes: 'Direct deposit into primary savings',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx-2',
      type: 'income',
      amount: 750,
      category: 'Freelance',
      description: 'Mobile App UI Consulting',
      date: `${currentMonth}-10`,
      paymentMethod: 'UPI / Bank Transfer',
      notes: 'Completed sprint 1 deliverables',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx-3',
      type: 'income',
      amount: 180,
      category: 'Investment',
      description: 'Quarterly Stock Dividends',
      date: `${currentMonth}-14`,
      paymentMethod: 'Other',
      createdAt: new Date().toISOString(),
    },

    // Current Month Expenses
    {
      id: 'tx-4',
      type: 'expense',
      amount: 1200,
      category: 'Rent',
      description: 'Apartment Monthly Rent',
      date: `${currentMonth}-02`,
      paymentMethod: 'UPI / Bank Transfer',
      notes: 'Monthly lease payment',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx-5',
      type: 'expense',
      amount: 145,
      category: 'Bills',
      description: 'Electricity & High Speed Fiber',
      date: `${currentMonth}-04`,
      paymentMethod: 'Credit Card',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx-6',
      type: 'expense',
      amount: 85.5,
      category: 'Food',
      description: 'Weekly Organic Grocery Run',
      date: `${currentMonth}-05`,
      paymentMethod: 'Credit Card',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx-7',
      type: 'expense',
      amount: 42,
      category: 'Transport',
      description: 'Fuel Refill & Tolls',
      date: `${currentMonth}-07`,
      paymentMethod: 'Debit Card',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx-8',
      type: 'expense',
      amount: 120,
      category: 'Shopping',
      description: 'Ergonomic Desk Accessories',
      date: `${currentMonth}-09`,
      paymentMethod: 'Credit Card',
      notes: 'Wrist rest and vertical mouse',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx-9',
      type: 'expense',
      amount: 68,
      category: 'Food',
      description: 'Dinner with friends',
      date: `${currentMonth}-11`,
      paymentMethod: 'Cash',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx-10',
      type: 'expense',
      amount: 45,
      category: 'Subscriptions',
      description: 'Cloud storage & Streaming services',
      date: `${currentMonth}-12`,
      paymentMethod: 'Credit Card',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx-11',
      type: 'expense',
      amount: 55,
      category: 'Entertainment',
      description: 'Cinema Tickets & Concessions',
      date: `${currentMonth}-${padDay(Math.min(today.getDate(), 20))}`,
      paymentMethod: 'Debit Card',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx-12',
      type: 'expense',
      amount: 110,
      category: 'Health',
      description: 'Dental Checkup & Cleaning',
      date: `${currentMonth}-${padDay(Math.min(today.getDate(), 18))}`,
      paymentMethod: 'Credit Card',
      createdAt: new Date().toISOString(),
    },

    // Previous Month Data
    {
      id: 'tx-13',
      type: 'income',
      amount: 4500,
      category: 'Salary',
      description: 'Monthly Tech Lead Salary',
      date: `${prevMonth}-01`,
      paymentMethod: 'UPI / Bank Transfer',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx-14',
      type: 'income',
      amount: 400,
      category: 'Freelance',
      description: 'Website Bugfixes',
      date: `${prevMonth}-15`,
      paymentMethod: 'UPI / Bank Transfer',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx-15',
      type: 'expense',
      amount: 1200,
      category: 'Rent',
      description: 'Apartment Monthly Rent',
      date: `${prevMonth}-02`,
      paymentMethod: 'UPI / Bank Transfer',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx-16',
      type: 'expense',
      amount: 460,
      category: 'Food',
      description: 'Groceries and Dining (Month Total)',
      date: `${prevMonth}-18`,
      paymentMethod: 'Credit Card',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx-17',
      type: 'expense',
      amount: 190,
      category: 'Bills',
      description: 'Utilities & Water bill',
      date: `${prevMonth}-06`,
      paymentMethod: 'Credit Card',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx-18',
      type: 'expense',
      amount: 220,
      category: 'Shopping',
      description: 'Winter Clothes',
      date: `${prevMonth}-22`,
      paymentMethod: 'Debit Card',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx-19',
      type: 'expense',
      amount: 85,
      category: 'Transport',
      description: 'Transit Pass & Rideshares',
      date: `${prevMonth}-26`,
      paymentMethod: 'Credit Card',
      createdAt: new Date().toISOString(),
    },
  ];

  return { transactions: sampleTransactions, budgets: sampleBudgets };
};
