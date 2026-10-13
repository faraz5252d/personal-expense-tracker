import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Edit3, 
  Trash2, 
  ArrowUpDown, 
  Calendar,
  CreditCard,
  Tag,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import { CategoryIcon } from '../utils/categoryIcons';

export const TransactionList = ({ transactions = [], categories = [], loading, onRefresh }) => {
  const { currency, openAddModal, showToast } = useApp();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [isDeleting, setIsDeleting] = useState(null);

  // Filtered and sorted transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      // Type
      if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
      // Category
      if (categoryFilter !== 'all' && tx.categoryId !== categoryFilter) return false;
      // Payment Method
      if (paymentFilter !== 'all' && tx.paymentMethod !== paymentFilter) return false;
      // Search
      if (search) {
        const q = search.toLowerCase();
        const matchTitle = tx.title?.toLowerCase().includes(q);
        const matchNotes = tx.notes?.toLowerCase().includes(q);
        const matchCat = tx.category?.name?.toLowerCase().includes(q);
        if (!matchTitle && !matchNotes && !matchCat) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'amount-desc') return Number(b.amount) - Number(a.amount);
      if (sortBy === 'amount-asc') return Number(a.amount) - Number(b.amount);
      return 0;
    });
  }, [transactions, search, typeFilter, categoryFilter, paymentFilter, sortBy]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    setIsDeleting(id);
    try {
      await api.deleteTransaction(id);
      showToast('Transaction removed', 'success');
      if (onRefresh) onRefresh();
    } catch (err) {
      showToast('Failed to delete: ' + err.message, 'error');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleExportCSV = () => {
    window.open(api.getExportCsvUrl(), '_blank');
    showToast('Exporting CSV download...', 'info');
  };

  const clearFilters = () => {
    setSearch('');
    setTypeFilter('all');
    setCategoryFilter('all');
    setPaymentFilter('all');
    setSortBy('date-desc');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Controls Bar */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
        
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search expenses by title, notes, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition"
              title="Export as CSV"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => openAddModal()}
              className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold rounded-xl shadow-md shadow-cyan-500/20 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>New Entry</span>
            </button>
          </div>

        </div>

        {/* Filter Pills / Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-800">
          
          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-900/80 border border-slate-700 text-slate-300 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="expense">Expenses Only</option>
            <option value="income">Income Only</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-900/80 border border-slate-700 text-slate-300 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Payment Method */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="bg-slate-900/80 border border-slate-700 text-slate-300 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="all">All Payment Modes</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="UPI">UPI</option>
            <option value="Cash">Cash</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-900/80 border border-slate-700 text-slate-300 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>

        </div>

      </div>

      {/* Transactions Table / List */}
      <div className="glass-panel rounded-2xl shadow-xl overflow-hidden">
        
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100">Transaction History</h3>
            <p className="text-xs text-slate-400">
              Showing {filteredTransactions.length} of {transactions.length} total records
            </p>
          </div>
          {(search || typeFilter !== 'all' || categoryFilter !== 'all' || paymentFilter !== 'all') && (
            <button
              onClick={clearFilters}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading transactions...
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Tag className="w-10 h-10 mx-auto mb-3 text-slate-600" />
            <p className="font-semibold text-slate-300">No transactions found</p>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your filter criteria or record a new transaction.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-800/80 bg-slate-900/40 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-4 sm:px-6">Date</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Payment Mode</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTransactions.map((tx) => {
                  const isIncome = tx.type === 'income';
                  const catColor = tx.category?.color || '#64748b';
                  const catIcon = tx.category?.icon || 'Tag';

                  return (
                    <tr 
                      key={tx.id} 
                      className="hover:bg-slate-800/40 transition group"
                    >
                      {/* Date */}
                      <td className="py-3.5 px-4 sm:px-6 text-slate-400 whitespace-nowrap text-xs">
                        {formatDate(tx.date)}
                      </td>

                      {/* Title & Notes */}
                      <td className="py-3.5 px-4 font-medium text-slate-200">
                        <div className="font-semibold text-slate-100">{tx.title}</div>
                        {tx.notes && (
                          <div className="text-[11px] text-slate-400 line-clamp-1">{tx.notes}</div>
                        )}
                      </td>

                      {/* Category Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span 
                          className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor: `${catColor}18`,
                            color: catColor,
                            border: `1px solid ${catColor}35`
                          }}
                        >
                          <CategoryIcon name={catIcon} className="w-3.5 h-3.5" />
                          <span>{tx.category?.name || 'Other'}</span>
                        </span>
                      </td>

                      {/* Payment Mode */}
                      <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap text-xs hidden md:table-cell">
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60">
                          {tx.paymentMethod || 'Card'}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className={`py-3.5 px-4 text-right font-bold whitespace-nowrap ${
                        isIncome ? 'text-emerald-400' : 'text-slate-100'
                      }`}>
                        {isIncome ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => openAddModal(tx)}
                            className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(tx.id, tx.title)}
                            disabled={isDeleting === tx.id}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                            title="Delete"
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
        )}

      </div>

    </div>
  );
};
