import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, type ReactNode } from 'react';
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
  refreshData: () => void;
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
    return storageService.getTransactions();
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
        root.style.backgroundColor = '#0b0f19';
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.style.backgroundColor = '#f8fafc';
        root.style.colorScheme = 'light';
      }

      const themeColors = document.querySelectorAll('meta[name="theme-color"]');
      themeColors.forEach((meta) => {
        meta.setAttribute('content', isDark ? '#0b0f19' : '#f8fafc');
      });
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

  const showToast = useCallback((message: string, type: ToastMessage['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addTransaction = useCallback((data: Omit<Transaction, 'id' | 'createdAt'>): Transaction => {
    const newTx: Transaction = {
      ...data,
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };

    setTransactions((prev) => {
      const updated = [newTx, ...prev];
      storageService.saveTransactions(updated);
      return updated;
    });
    showToast(`Added ${data.type === 'income' ? 'income' : 'expense'}: "${data.description}"`, 'success');
    return newTx;
  }, [showToast]);

  const updateTransaction = useCallback((id: string, data: Partial<Transaction>) => {
    setTransactions((prev) => {
      const updated = prev.map((tx) => (tx.id === id ? { ...tx, ...data } : tx));
      storageService.saveTransactions(updated);
      return updated;
    });
    showToast('Transaction updated successfully', 'success');
  }, [showToast]);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => {
      const target = prev.find((tx) => tx.id === id);
      const updated = prev.filter((tx) => tx.id !== id);
      storageService.saveTransactions(updated);
      showToast(`Deleted "${target?.description || 'Transaction'}"`, 'info');
      return updated;
    });
  }, [showToast]);

  const saveBudget = useCallback((category: string, amount: number, month: string) => {
    setBudgets((prev) => {
      const existingIndex = prev.findIndex(
        (b) => b.category.toLowerCase() === category.toLowerCase() && b.month === month
      );

      let updated: Budget[];
      if (existingIndex >= 0) {
        updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], amount };
      } else {
        const newBudget: Budget = {
          id: `b-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          category,
          amount,
          month,
        };
        updated = [...prev, newBudget];
      }
      storageService.saveBudgets(updated);
      return updated;
    });
    showToast(`Budget for ${category} updated to ${amount}`, 'success');
  }, [showToast]);

  const deleteBudget = useCallback((id: string) => {
    setBudgets((prev) => {
      const updated = prev.filter((b) => b.id !== id);
      storageService.saveBudgets(updated);
      return updated;
    });
    showToast('Budget goal removed', 'info');
  }, [showToast]);

  const addCategory = useCallback((data: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...data,
      id: `cat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      isDefault: false,
    };
    setCategories((prev) => {
      const updated = [...prev, newCat];
      storageService.saveCategories(updated);
      return updated;
    });
    showToast(`Created category "${data.name}"`, 'success');
  }, [showToast]);

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => {
      const target = prev.find((c) => c.id === id);
      if (target?.isDefault) {
        showToast('Cannot delete system default categories', 'warning');
        return prev;
      }
      const updated = prev.filter((c) => c.id !== id);
      storageService.saveCategories(updated);
      showToast(`Removed category "${target?.name || ''}"`, 'info');
      return updated;
    });
  }, [showToast]);

  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      storageService.saveSettings(updated);
      return updated;
    });
  }, []);

  const setCurrency = useCallback((currency: string) => {
    updateSettings({ currency });
    showToast(`Currency changed to ${currency}`, 'info');
  }, [updateSettings, showToast]);

  const setTheme = useCallback((theme: ThemeMode) => {
    updateSettings({ theme });
    showToast(`Theme switched to ${theme}`, 'info');
  }, [updateSettings, showToast]);

  const refreshData = useCallback(() => {
    setTransactions(storageService.getTransactions());
    setBudgets(storageService.getBudgets());
    setCategories(storageService.getCategories());
    setSettings(storageService.getSettings());
  }, []);

  const loadSampleData = useCallback(() => {
    const sample = storageService.loadSampleData();
    setTransactions(sample.transactions);
    setBudgets(sample.budgets);
    setCategories(sample.categories);
    showToast('Sample financial data loaded successfully', 'success');
  }, [showToast]);

  const clearAllData = useCallback(() => {
    storageService.clearAllData();
    setTransactions([]);
    setBudgets([]);
    setCategories(DEFAULT_CATEGORIES);
    setSettings(DEFAULT_SETTINGS);
    showToast('All transaction and budget data has been cleared', 'warning');
  }, [showToast]);

  const exportDataToFile = useCallback(() => {
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
  }, [showToast]);

  const exportTransactionsCSV = useCallback(() => {
    if (transactions.length === 0) {
      showToast('No transactions to export', 'info');
      return;
    }
    exportTransactionsToCSV(transactions, settings.currency);
    showToast('Transactions exported to CSV successfully', 'success');
  }, [transactions, settings.currency, showToast]);

  const importDataFromFile = useCallback(async (jsonString: string): Promise<boolean> => {
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
  }, [showToast]);

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

  const value = useMemo(
    () => ({
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
      refreshData,
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
    }),
    [
      transactions,
      budgets,
      categories,
      settings,
      selectedMonth,
      toasts,
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
      refreshData,
      loadSampleData,
      clearAllData,
      exportDataToFile,
      exportTransactionsCSV,
      importDataFromFile,
      showToast,
      dismissToast,
    ]
  );

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
