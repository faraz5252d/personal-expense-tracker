import React, { useState } from 'react';
import { Tags, Plus, Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import { CategoryIcon } from '../utils/categoryIcons';
import { CategoryModal } from './CategoryModal';

export const CategoryManager = ({ categories = [], onRefresh }) => {
  const { currency, showToast } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);

  const expenseCategories = categories.filter(c => c.type === 'expense');
  const incomeCategories = categories.filter(c => c.type === 'income');

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete custom category "${name}"?`)) return;
    setIsDeleting(id);
    try {
      await api.deleteCategory(id);
      showToast(`Category "${name}" deleted`, 'success');
      if (onRefresh) onRefresh();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsDeleting(null);
    }
  };

  const renderCategoryCards = (list, title, isIncome) => (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        {isIncome ? (
          <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
        ) : (
          <ArrowUpRight className="w-4 h-4 text-rose-400" />
        )}
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
          {title} ({list.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((cat) => (
          <div
            key={cat.id}
            className="glass-panel glass-panel-hover rounded-2xl p-4 flex items-center justify-between shadow-md"
          >
            <div className="flex items-center space-x-3 truncate">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm flex-shrink-0"
                style={{ backgroundColor: cat.color }}
              >
                <CategoryIcon name={cat.icon} className="w-5 h-5" />
              </div>
              <div className="truncate">
                <div className="font-bold text-sm text-slate-100 truncate flex items-center space-x-1.5">
                  <span>{cat.name}</span>
                  {cat.isDefault && (
                    <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-medium">
                      Default
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {cat.transactionCount || 0} records • {formatCurrency(cat.totalAmount || 0, currency)}
                </div>
              </div>
            </div>

            {!cat.isDefault && (
              <button
                onClick={() => handleDelete(cat.id, cat.name)}
                disabled={isDeleting === cat.id}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                title="Delete category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <span>Category Configuration</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Organize transactions and customize icons, colors, and classifications
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-cyan-500/20 active:scale-95 transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Expense Categories */}
      {renderCategoryCards(expenseCategories, 'Expense Classifications', false)}

      {/* Income Categories */}
      {renderCategoryCards(incomeCategories, 'Income Sources', true)}

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={onRefresh}
      />

    </div>
  );
};
