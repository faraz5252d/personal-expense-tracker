import React from 'react';
import { ArrowRight, Plus, Edit3, Trash2, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { CategoryIcon } from '../utils/categoryIcons';
import { api } from '../services/api';

export const RecentTransactions = ({ transactions = [], onRefresh }) => {
  const { currency, setActiveTab, openAddModal, showToast } = useApp();

  const recent = transactions.slice(0, 5);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await api.deleteTransaction(id);
      showToast('Transaction removed', 'success');
      if (onRefresh) onRefresh();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="glass-panel rounded-2xl shadow-xl overflow-hidden">
      
      {/* Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <h3 className="text-base font-bold text-slate-100">Recent Transactions</h3>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('transactions')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* List */}
      {recent.length === 0 ? (
        <div className="p-8 text-center text-slate-400 text-sm">
          No transactions yet. Click "+ Record Transaction" to add your first entry!
        </div>
      ) : (
        <div className="divide-y divide-slate-800/60">
          {recent.map((tx) => {
            const isIncome = tx.type === 'income';
            const catColor = tx.category?.color || '#64748b';
            const catIcon = tx.category?.icon || 'Tag';

            return (
              <div
                key={tx.id}
                className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-800/30 transition group"
              >
                <div className="flex items-center space-x-3.5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm flex-shrink-0"
                    style={{ backgroundColor: `${catColor}25`, border: `1px solid ${catColor}40`, color: catColor }}
                  >
                    <CategoryIcon name={catIcon} className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{tx.title}</h4>
                    <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                      <span>{formatDate(tx.date)}</span>
                      <span>•</span>
                      <span>{tx.category?.name}</span>
                      <span>•</span>
                      <span className="hidden sm:inline">{tx.paymentMethod}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className={`text-right font-extrabold text-sm sm:text-base ${
                    isIncome ? 'text-emerald-400' : 'text-slate-100'
                  }`}>
                    {isIncome ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                  </div>

                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openAddModal(tx)}
                      className="p-1.5 text-slate-400 hover:text-cyan-400 rounded-lg hover:bg-slate-800"
                      title="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(tx.id, tx.title)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
