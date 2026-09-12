export type TransactionType = 'income' | 'expense';

export type PaymentMethod = 
  | 'Cash'
  | 'Credit Card'
  | 'Debit Card'
  | 'UPI / Bank Transfer'
  | 'Other';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string; // YYYY-MM-DD
  paymentMethod: PaymentMethod;
  notes?: string;
  createdAt: string; // ISO string
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  month: string; // YYYY-MM
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
  isDefault?: boolean;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  position: 'prefix' | 'suffix';
}

export interface Settings {
  currency: string; // 'INR', 'USD', etc.
  theme: ThemeMode;
}

export interface ExportData {
  version: number;
  exportedAt: string;
  transactions: Transaction[];
  budgets: Budget[];
  categories: Category[];
  settings: Settings;
}

export interface TransactionFilter {
  search: string;
  type: 'all' | TransactionType;
  category: string;
  paymentMethod: string;
  startDate: string;
  endDate: string;
  minAmount?: number;
  maxAmount?: number;
}

export type SortField = 'date' | 'amount';
export type SortOrder = 'asc' | 'desc';

export interface TransactionSort {
  field: SortField;
  order: SortOrder;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}
