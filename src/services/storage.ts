import type { Transaction, Budget, Category, Settings, ExportData } from '../types';
import { DEFAULT_CATEGORIES, DEFAULT_SETTINGS, generateSampleData } from '../data/defaultData';

const KEYS = {
  TRANSACTIONS: 'expenseTracker_transactions',
  BUDGETS: 'expenseTracker_budgets',
  CATEGORIES: 'expenseTracker_categories',
  SETTINGS: 'expenseTracker_settings',
  INITIALIZED: 'expenseTracker_initialized',
};

function safeParse<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`[StorageService] Failed to parse localStorage key "${key}":`, error);
    return fallback;
  }
}

function safeWrite<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`[StorageService] Failed to save to localStorage key "${key}":`, error);
    return false;
  }
}

export const storageService = {
  isInitialized(): boolean {
    return localStorage.getItem(KEYS.INITIALIZED) === 'true';
  },

  markInitialized(): void {
    localStorage.setItem(KEYS.INITIALIZED, 'true');
  },

  getTransactions(): Transaction[] {
    return safeParse<Transaction[]>(KEYS.TRANSACTIONS, []);
  },

  saveTransactions(transactions: Transaction[]): boolean {
    return safeWrite(KEYS.TRANSACTIONS, transactions);
  },

  getBudgets(): Budget[] {
    return safeParse<Budget[]>(KEYS.BUDGETS, []);
  },

  saveBudgets(budgets: Budget[]): boolean {
    return safeWrite(KEYS.BUDGETS, budgets);
  },

  getCategories(): Category[] {
    const categories = safeParse<Category[]>(KEYS.CATEGORIES, []);
    if (!categories || categories.length === 0) {
      this.saveCategories(DEFAULT_CATEGORIES);
      return DEFAULT_CATEGORIES;
    }
    return categories;
  },

  saveCategories(categories: Category[]): boolean {
    return safeWrite(KEYS.CATEGORIES, categories);
  },

  getSettings(): Settings {
    const settings = safeParse<Settings>(KEYS.SETTINGS, DEFAULT_SETTINGS);
    return { ...DEFAULT_SETTINGS, ...settings };
  },

  saveSettings(settings: Settings): boolean {
    return safeWrite(KEYS.SETTINGS, settings);
  },

  exportAllData(): ExportData {
    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      transactions: this.getTransactions(),
      budgets: this.getBudgets(),
      categories: this.getCategories(),
      settings: this.getSettings(),
    };
  },

  validateImportData(data: any): { isValid: boolean; error?: string } {
    if (!data || typeof data !== 'object') {
      return { isValid: false, error: 'File content is not a valid JSON object.' };
    }

    if (!Array.isArray(data.transactions)) {
      return { isValid: false, error: 'Missing or invalid "transactions" array.' };
    }

    for (const tx of data.transactions) {
      if (!tx.id || !tx.type || typeof tx.amount !== 'number' || !tx.date || !tx.category) {
        return { isValid: false, error: 'One or more transactions are missing required fields (id, type, amount, date, category).' };
      }
    }

    if (data.budgets && !Array.isArray(data.budgets)) {
      return { isValid: false, error: 'Invalid "budgets" format. Expected an array.' };
    }

    if (data.categories && !Array.isArray(data.categories)) {
      return { isValid: false, error: 'Invalid "categories" format. Expected an array.' };
    }

    return { isValid: true };
  },

  importAllData(data: ExportData): boolean {
    const validation = this.validateImportData(data);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    const successTxs = this.saveTransactions(data.transactions || []);
    const successBudgets = this.saveBudgets(data.budgets || []);
    const successCategories = this.saveCategories(data.categories || DEFAULT_CATEGORIES);
    const successSettings = this.saveSettings(data.settings || DEFAULT_SETTINGS);

    this.markInitialized();
    return successTxs && successBudgets && successCategories && successSettings;
  },

  clearAllData(): void {
    localStorage.removeItem(KEYS.TRANSACTIONS);
    localStorage.removeItem(KEYS.BUDGETS);
    localStorage.removeItem(KEYS.CATEGORIES);
    localStorage.removeItem(KEYS.SETTINGS);
    localStorage.removeItem(KEYS.INITIALIZED);
  },

  loadSampleData(): { transactions: Transaction[]; budgets: Budget[]; categories: Category[] } {
    const { transactions, budgets } = generateSampleData();
    const categories = DEFAULT_CATEGORIES;

    this.saveTransactions(transactions);
    this.saveBudgets(budgets);
    this.saveCategories(categories);
    this.markInitialized();

    return { transactions, budgets, categories };
  },
};
