import { SUPPORTED_CURRENCIES } from '../data/defaultData';
import type { Transaction } from '../types';

export function getCurrencyConfig(code: string) {
  return SUPPORTED_CURRENCIES.find((c) => c.code === code) || SUPPORTED_CURRENCIES[0];
}

export function formatCurrency(amount: number, currencyCode: string = 'USD'): string {
  const config = getCurrencyConfig(currencyCode);
  const formattedNumber = Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const sign = amount < 0 ? '-' : '';
  
  if (config.position === 'prefix') {
    return `${sign}${config.symbol}${formattedNumber}`;
  } else {
    return `${sign}${formattedNumber} ${config.symbol}`;
  }
}

export function getLocalTodayDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getLocalCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatMonth(monthString: string): string {
  if (!monthString) return '';
  try {
    const [year, month] = monthString.split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return monthString;
  }
}

export function formatPercentage(value: number): string {
  if (isNaN(value) || !isFinite(value)) return '0.0%';
  return `${value.toFixed(1)}%`;
}

export function exportTransactionsToCSV(transactions: Transaction[], currency: string = 'USD'): void {
  if (transactions.length === 0) return;

  const headers = ['ID', 'Date', 'Type', 'Category', 'Description', 'Amount', 'Currency', 'Payment Method', 'Notes'];
  
  const escapeCsv = (val: string | number | undefined) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = transactions.map((t) => [
    escapeCsv(t.id),
    escapeCsv(t.date),
    escapeCsv(t.type),
    escapeCsv(t.category),
    escapeCsv(t.description),
    escapeCsv(t.amount),
    escapeCsv(currency),
    escapeCsv(t.paymentMethod),
    escapeCsv(t.notes || ''),
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `transactions-${getLocalTodayDate()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
