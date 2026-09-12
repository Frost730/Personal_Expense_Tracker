import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Search,
  Filter,
  ArrowUpDown,
  Edit2,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  ChevronLeft,
  ChevronRight,
  X,
  Download,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { Header } from '../components/layout/Header';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { TransactionModal } from '../components/modals/TransactionModal';
import { EmptyState } from '../components/common/EmptyState';
import type { Transaction, TransactionType } from '../types';
import { PAYMENT_METHODS } from '../data/defaultData';
import { formatCurrency, formatDate } from '../utils/formatters';

interface OutletContextType {
  openAddModal: () => void;
}

export const Transactions: React.FC = () => {
  const { openAddModal } = useOutletContext<OutletContextType>();
  const { transactions, categories, deleteTransaction, settings, exportTransactionsCSV } = useFinance();

  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | TransactionType>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPayment, setFilterPayment] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<string>('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Sorting
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals state
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Category Color Map
  const categoryColorMap = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((cat) => {
      map[cat.name.toLowerCase()] = cat.color;
    });
    return map;
  }, [categories]);

  // Reset Filters
  const resetFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setFilterCategory('all');
    setFilterPayment('all');
    setStartDate('');
    setEndDate('');
    setMinAmount('');
    setMaxAmount('');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    filterType !== 'all' ||
    filterCategory !== 'all' ||
    filterPayment !== 'all' ||
    startDate !== '' ||
    endDate !== '' ||
    minAmount !== '' ||
    maxAmount !== '';

  // Filtered & Sorted Transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          const matchesDesc = tx.description.toLowerCase().includes(term);
          const matchesCategory = tx.category.toLowerCase().includes(term);
          const matchesNotes = tx.notes ? tx.notes.toLowerCase().includes(term) : false;
          if (!matchesDesc && !matchesCategory && !matchesNotes) return false;
        }

        if (filterType !== 'all' && tx.type !== filterType) {
          return false;
        }

        if (filterCategory !== 'all' && tx.category.toLowerCase() !== filterCategory.toLowerCase()) {
          return false;
        }

        if (filterPayment !== 'all' && tx.paymentMethod !== filterPayment) {
          return false;
        }

        if (startDate && tx.date < startDate) {
          return false;
        }
        if (endDate && tx.date > endDate) {
          return false;
        }

        if (minAmount && Number(tx.amount) < Number(minAmount)) {
          return false;
        }
        if (maxAmount && Number(tx.amount) > Number(maxAmount)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortField === 'date') {
          const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
          return sortOrder === 'asc' ? -dateDiff : dateDiff;
        } else {
          const amountDiff = Number(b.amount) - Number(a.amount);
          return sortOrder === 'asc' ? -amountDiff : amountDiff;
        }
      });
  }, [
    transactions,
    searchTerm,
    filterType,
    filterCategory,
    filterPayment,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    sortField,
    sortOrder,
  ]);

  const totalPages = Math.ceil(filteredTransactions.length / pageSize) || 1;
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, currentPage, pageSize]);

  const handleSort = (field: 'date' | 'amount') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6">
      <Header
        title="Transactions"
        subtitle={`Managing ${filteredTransactions.length} recorded operations`}
        onOpenAddModal={openAddModal}
        showMonthPicker={false}
      />

      {/* Main Filter & Search Toolbar */}
      <Card className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search description, category, or notes..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2.5 sm:py-2 text-base sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Quick Type Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {(['all', 'expense', 'income'] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setFilterType(t);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                  filterType === t
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Toggle Advanced Filters Button */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-colors ${
              showAdvancedFilters || hasActiveFilters
                ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 border-blue-200 dark:border-blue-800'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters {hasActiveFilters && '• Active'}</span>
          </button>

          {/* Export CSV Button */}
          <button
            onClick={exportTransactionsCSV}
            title="Export transactions to CSV spreadsheet"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>

        {/* Expandable Advanced Filters */}
        {showAdvancedFilters && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {/* Category */}
            <div>
              <label className="block font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => {
                  setFilterCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2.5 sm:py-2 text-base sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Payment Method
              </label>
              <select
                value={filterPayment}
                onChange={(e) => {
                  setFilterPayment(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2.5 sm:py-2 text-base sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                <option value="all">All Methods</option>
                {PAYMENT_METHODS.map((pm) => (
                  <option key={pm} value={pm}>
                    {pm}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Start / End */}
            <div>
              <label className="block font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2.5 sm:py-1.5 text-base sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-500 dark:text-slate-400 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2.5 sm:py-1.5 text-base sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            {/* Min and Max Amount */}
            <div>
              <label className="block font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Min Amount
              </label>
              <input
                type="number"
                placeholder="0"
                value={minAmount}
                onChange={(e) => {
                  setMinAmount(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2.5 sm:py-2 text-base sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Max Amount
              </label>
              <input
                type="number"
                placeholder="No limit"
                value={maxAmount}
                onChange={(e) => {
                  setMaxAmount(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2.5 sm:py-2 text-base sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            {/* Clear Filters CTA */}
            <div className="sm:col-span-2 flex items-end">
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 rounded-xl hover:bg-rose-100 transition-colors flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  Reset all filters
                </button>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Transaction List / Table */}
      {filteredTransactions.length === 0 ? (
        <EmptyState
          icon={<Filter className="w-8 h-8 text-slate-400" />}
          title={hasActiveFilters ? 'No Matching Transactions' : 'No Transactions Found'}
          description={
            hasActiveFilters
              ? 'Try changing your search keywords or clearing some filters.'
              : 'Add your first transaction to start tracking your finances.'
          }
          action={
            hasActiveFilters
              ? { label: 'Clear Filters', onClick: resetFilters }
              : { label: 'Add Transaction', onClick: openAddModal }
          }
        />
      ) : (
        <Card className="p-0 overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Transaction</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">
                    <button
                      onClick={() => handleSort('date')}
                      className="inline-flex items-center gap-1 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      Date
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleSort('amount')}
                      className="inline-flex items-center gap-1 hover:text-slate-600 dark:hover:text-slate-200 justify-end"
                    >
                      Amount
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {paginatedTransactions.map((tx) => {
                  const isIncome = tx.type === 'income';
                  const catColor = categoryColorMap[tx.category.toLowerCase()] || '#64748b';

                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              isIncome
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                            }`}
                          >
                            {isIncome ? (
                              <ArrowUpRight className="w-4 h-4" />
                            ) : (
                              <ArrowDownRight className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-white block">
                              {tx.description}
                            </span>
                            {tx.notes && (
                              <span className="text-xs text-slate-400 truncate max-w-xs block">
                                {tx.notes}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge label={tx.category} color={catColor} />
                      </td>

                      <td className="py-3.5 px-4 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {formatDate(tx.date)}
                      </td>

                      <td className="py-3.5 px-4 text-xs text-slate-600 dark:text-slate-400">
                        {tx.paymentMethod}
                      </td>

                      <td
                        className={`py-3.5 px-4 text-right font-bold tracking-tight whitespace-nowrap ${
                          isIncome
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {isIncome ? '+' : '-'}
                        {formatCurrency(tx.amount, settings.currency)}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setEditingTransaction(tx)}
                            title="Edit"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingId(tx.id)}
                            title="Delete"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {paginatedTransactions.map((tx) => {
              const isIncome = tx.type === 'income';
              const catColor = categoryColorMap[tx.category.toLowerCase()] || '#64748b';

              return (
                <div key={tx.id} className="p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isIncome
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {isIncome ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                          {tx.description}
                        </h4>
                        <span className="text-[11px] text-slate-400">{formatDate(tx.date)}</span>
                      </div>
                    </div>

                    <div
                      className={`text-sm font-bold ${
                        isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                      {formatCurrency(tx.amount, settings.currency)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <Badge label={tx.category} color={catColor} size="sm" />
                      <span className="text-[11px] text-slate-400">{tx.paymentMethod}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingTransaction(tx)}
                        aria-label="Edit transaction"
                        className="p-2 rounded-lg text-slate-500 hover:text-blue-600 bg-slate-100 dark:bg-slate-800/80 active:scale-95 transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingId(tx.id)}
                        aria-label="Delete transaction"
                        className="p-2 rounded-lg text-slate-500 hover:text-rose-600 bg-slate-100 dark:bg-slate-800/80 active:scale-95 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-slate-400 ml-2">
                Showing {Math.min((currentPage - 1) * pageSize + 1, filteredTransactions.length)} to{' '}
                {Math.min(currentPage * pageSize, filteredTransactions.length)} of {filteredTransactions.length}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-medium text-slate-700 dark:text-slate-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Edit Transaction Modal */}
      {editingTransaction && (
        <TransactionModal
          isOpen={!!editingTransaction}
          onClose={() => setEditingTransaction(null)}
          editTransaction={editingTransaction}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId) {
            deleteTransaction(deletingId);
            setDeletingId(null);
          }
        }}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action will immediately update your balance and charts."
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
};
