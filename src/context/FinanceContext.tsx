import React, { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import type {
  Transaction,
  Budget,
  Category,
  Settings,
  ThemeMode,
  ToastMessage,
} from '../types';
import { storageService } from '../services/storage';
import { DEFAULT_SETTINGS, DEFAULT_CATEGORIES } from '../data/defaultData';
import {
  calculateTotalBalance,
  calculateTotalIncome,
  calculateTotalExpense,
  calculateMonthlyIncome,
  calculateMonthlyExpense,
  calculateNetSavings,
  calculateSavingsRate,
  calculateBudgetHealth,
  type BudgetHealth,
} from '../utils/calculations';
import {
  getLocalCurrentMonth,
  getLocalTodayDate,
  exportTransactionsToCSV,
} from '../utils/formatters';

interface FinanceContextType {
  // State
  transactions: Transaction[];
  budgets: Budget[];
  categories: Category[];
  settings: Settings;
  selectedMonth: string;
  toasts: ToastMessage[];
  
  // Navigation & Month
  setSelectedMonth: (month: string) => void;
  
  // Transactions
  addTransaction: (data: Omit<Transaction, 'id' | 'createdAt'>) => Transaction;
  updateTransaction: (id: string, data: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  
  // Budgets
  saveBudget: (category: string, amount: number, month: string) => void;
  deleteBudget: (id: string) => void;
  
  // Categories
  addCategory: (data: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
  
  // Settings
  updateSettings: (newSettings: Partial<Settings>) => void;
  setCurrency: (currency: string) => void;
  setTheme: (theme: ThemeMode) => void;
  
  // Data management
  loadSampleData: () => void;
  clearAllData: () => void;
  exportDataToFile: () => void;
  exportTransactionsCSV: () => void;
  importDataFromFile: (jsonString: string) => Promise<boolean>;
  
  // Toast notifications
  showToast: (message: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;
  
  // Calculated stats for selected month
  totalBalance: number;
  totalAllTimeIncome: number;
  totalAllTimeExpense: number;
  monthlyIncome: number;
  monthlyExpense: number;
  monthlySavings: number;
  monthlySavingsRate: number;
  budgetHealthList: BudgetHealth[];
  totalMonthlyBudget: number;
  remainingMonthlyBudget: number;
  recentTransactions: Transaction[];
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const existing = storageService.getTransactions();
    if (!storageService.isInitialized() && existing.length === 0) {
      const sample = storageService.loadSampleData();
      return sample.transactions;
    }
    return existing;
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    return storageService.getBudgets();
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    return storageService.getCategories();
  });

  const [settings, setSettings] = useState<Settings>(() => {
    return storageService.getSettings();
  });

  const [selectedMonth, setSelectedMonth] = useState<string>(getLocalCurrentMonth);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const root = document.documentElement;
    const applyDark = (isDark: boolean) => {
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    if (settings.theme === 'dark') {
      applyDark(true);
    } else if (settings.theme === 'light') {
      applyDark(false);
    } else {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyDark(mediaQuery.matches);

      const handler = (e: MediaQueryListEvent) => {
        if (settings.theme === 'system') {
          applyDark(e.matches);
        }
      };
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [settings.theme]);

  const showToast = (message: string, type: ToastMessage['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addTransaction = (data: Omit<Transaction, 'id' | 'createdAt'>): Transaction => {
    const newTx: Transaction = {
      ...data,
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };

    const updated = [newTx, ...transactions];
    setTransactions(updated);
    storageService.saveTransactions(updated);
    showToast(`Added ${data.type === 'income' ? 'income' : 'expense'}: "${data.description}"`, 'success');
    return newTx;
  };

  const updateTransaction = (id: string, data: Partial<Transaction>) => {
    const updated = transactions.map((tx) => (tx.id === id ? { ...tx, ...data } : tx));
    setTransactions(updated);
    storageService.saveTransactions(updated);
    showToast('Transaction updated successfully', 'success');
  };

  const deleteTransaction = (id: string) => {
    const target = transactions.find((tx) => tx.id === id);
    const updated = transactions.filter((tx) => tx.id !== id);
    setTransactions(updated);
    storageService.saveTransactions(updated);
    showToast(`Deleted "${target?.description || 'Transaction'}"`, 'info');
  };

  const saveBudget = (category: string, amount: number, month: string) => {
    const existingIndex = budgets.findIndex(
      (b) => b.category.toLowerCase() === category.toLowerCase() && b.month === month
    );

    let updated: Budget[];
    if (existingIndex >= 0) {
      updated = [...budgets];
      updated[existingIndex] = { ...updated[existingIndex], amount };
    } else {
      const newBudget: Budget = {
        id: `b-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        category,
        amount,
        month,
      };
      updated = [...budgets, newBudget];
    }

    setBudgets(updated);
    storageService.saveBudgets(updated);
    showToast(`Budget for ${category} updated to ${amount}`, 'success');
  };

  const deleteBudget = (id: string) => {
    const updated = budgets.filter((b) => b.id !== id);
    setBudgets(updated);
    storageService.saveBudgets(updated);
    showToast('Budget goal removed', 'info');
  };

  const addCategory = (data: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...data,
      id: `cat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      isDefault: false,
    };
    const updated = [...categories, newCat];
    setCategories(updated);
    storageService.saveCategories(updated);
    showToast(`Created category "${data.name}"`, 'success');
  };

  const deleteCategory = (id: string) => {
    const target = categories.find((c) => c.id === id);
    if (target?.isDefault) {
      showToast('Cannot delete system default categories', 'warning');
      return;
    }
    const updated = categories.filter((c) => c.id !== id);
    setCategories(updated);
    storageService.saveCategories(updated);
    showToast(`Removed category "${target?.name || ''}"`, 'info');
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    storageService.saveSettings(updated);
  };

  const setCurrency = (currency: string) => {
    updateSettings({ currency });
    showToast(`Currency changed to ${currency}`, 'info');
  };

  const setTheme = (theme: ThemeMode) => {
    updateSettings({ theme });
    showToast(`Theme switched to ${theme}`, 'info');
  };

  const loadSampleData = () => {
    const sample = storageService.loadSampleData();
    setTransactions(sample.transactions);
    setBudgets(sample.budgets);
    setCategories(sample.categories);
    showToast('Sample financial data loaded successfully', 'success');
  };

  const clearAllData = () => {
    storageService.clearAllData();
    setTransactions([]);
    setBudgets([]);
    setCategories(DEFAULT_CATEGORIES);
    setSettings(DEFAULT_SETTINGS);
    showToast('All transaction and budget data has been cleared', 'warning');
  };

  const exportDataToFile = () => {
    const data = storageService.exportAllData();
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense-tracker-backup-${getLocalTodayDate()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Backup file downloaded successfully', 'success');
  };

  const exportTransactionsCSV = () => {
    if (transactions.length === 0) {
      showToast('No transactions to export', 'info');
      return;
    }
    exportTransactionsToCSV(transactions, settings.currency);
    showToast('Transactions exported to CSV successfully', 'success');
  };

  const importDataFromFile = async (jsonString: string): Promise<boolean> => {
    try {
      const parsed = JSON.parse(jsonString);
      const validation = storageService.validateImportData(parsed);
      if (!validation.isValid) {
        showToast(validation.error || 'Invalid file schema', 'error');
        return false;
      }

      storageService.importAllData(parsed);
      setTransactions(parsed.transactions || []);
      setBudgets(parsed.budgets || []);
      setCategories(parsed.categories || DEFAULT_CATEGORIES);
      if (parsed.settings) {
        setSettings({ ...DEFAULT_SETTINGS, ...parsed.settings });
      }

      showToast('Data imported successfully!', 'success');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Failed to parse JSON backup file', 'error');
      return false;
    }
  };

  const totalBalance = useMemo(() => calculateTotalBalance(transactions), [transactions]);
  const totalAllTimeIncome = useMemo(() => calculateTotalIncome(transactions), [transactions]);
  const totalAllTimeExpense = useMemo(() => calculateTotalExpense(transactions), [transactions]);

  const monthlyIncome = useMemo(
    () => calculateMonthlyIncome(transactions, selectedMonth),
    [transactions, selectedMonth]
  );

  const monthlyExpense = useMemo(
    () => calculateMonthlyExpense(transactions, selectedMonth),
    [transactions, selectedMonth]
  );

  const monthlySavings = useMemo(
    () => calculateNetSavings(monthlyIncome, monthlyExpense),
    [monthlyIncome, monthlyExpense]
  );

  const monthlySavingsRate = useMemo(
    () => calculateSavingsRate(monthlyIncome, monthlyExpense),
    [monthlyIncome, monthlyExpense]
  );

  const budgetHealthList = useMemo(
    () => calculateBudgetHealth(budgets, transactions, selectedMonth),
    [budgets, transactions, selectedMonth]
  );

  const totalMonthlyBudget = useMemo(
    () => budgets.filter((b) => b.month === selectedMonth).reduce((sum, b) => sum + (Number(b.amount) || 0), 0),
    [budgets, selectedMonth]
  );

  const remainingMonthlyBudget = useMemo(
    () => Math.max(0, totalMonthlyBudget - monthlyExpense),
    [totalMonthlyBudget, monthlyExpense]
  );

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [transactions]);

  const value = {
    transactions,
    budgets,
    categories,
    settings,
    selectedMonth,
    toasts,
    setSelectedMonth,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    saveBudget,
    deleteBudget,
    addCategory,
    deleteCategory,
    updateSettings,
    setCurrency,
    setTheme,
    loadSampleData,
    clearAllData,
    exportDataToFile,
    exportTransactionsCSV,
    importDataFromFile,
    showToast,
    dismissToast,
    totalBalance,
    totalAllTimeIncome,
    totalAllTimeExpense,
    monthlyIncome,
    monthlyExpense,
    monthlySavings,
    monthlySavingsRate,
    budgetHealthList,
    totalMonthlyBudget,
    remainingMonthlyBudget,
    recentTransactions,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
