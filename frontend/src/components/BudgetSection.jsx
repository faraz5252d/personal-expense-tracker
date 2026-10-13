import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Trash2, 
  Edit2, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import { CategoryIcon } from '../utils/categoryIcons';
import { BudgetModal } from './BudgetModal';

export const BudgetSection = ({ categories = [], onRefresh }) => {
  const { currency, showToast, refreshKey } = useApp();
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const loadBudgets = async () => {
    setLoading(true);
    try {
      const res = await api.getBudgets(month);
      setBudgetData(res);
    } catch (err) {
      showToast('Failed to load budgets: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudgets();
  }, [month, refreshKey]);

  const handleDelete = async (id, catName) => {
    if (!window.confirm(`Remove budget for ${catName}?`)) return;
    try {
      await api.deleteBudget(id);
      showToast('Budget removed', 'success');
      loadBudgets();
      if (onRefresh) onRefresh();
    } catch (err) {
      showToast('Failed to remove: ' + err.message, 'error');
    }
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingBudget(null);
    setIsModalOpen(true);
  };

  const summary = budgetData?.summary || { totalBudget: 0, totalSpent: 0, totalRemaining: 0, overallPercent: 0 };
  const budgets = budgetData?.data || [];
  const alerts = budgetData?.alerts || [];

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Month Selector */}
      <div className="glass-panel rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <span>Budget Control & Financial Goals</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track category spending caps and monitor real-time threshold alerts
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="bg-slate-800 text-slate-200 text-xs sm:text-sm font-semibold rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-cyan-500 cursor-pointer"
          />

          <button
            onClick={handleAddNew}
            className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-cyan-500/20 active:scale-95 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Set Budget</span>
          </button>
        </div>
      </div>

      {/* Budget Alerts Banner */}
      {alerts.length > 0 && (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 sm:p-5 shadow-lg space-y-2">
          <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>Budget Limit Warnings Detected</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {alerts.map((alert, idx) => (
              <div 
                key={idx} 
                className={`p-2.5 rounded-xl border flex items-center justify-between ${
                  alert.status === 'exceeded'
                    ? 'bg-rose-500/20 border-rose-500/30 text-rose-300 font-medium'
                    : 'bg-amber-500/20 border-amber-500/30 text-amber-300 font-medium'
                }`}
              >
                <span>{alert.message}</span>
                <span className="font-bold ml-2">{alert.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Total Monthly Budget Overview Card */}
      <div className="glass-panel rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
              Total Budgeted for {month}
            </span>
            <div className="text-3xl font-extrabold text-slate-100 mt-1">
              {formatCurrency(summary.totalSpent, currency)} <span className="text-lg font-normal text-slate-400">/ {formatCurrency(summary.totalBudget, currency)}</span>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs font-semibold text-slate-400">Remaining Cushion</span>
            <div className={`text-xl font-bold ${summary.totalRemaining >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatCurrency(summary.totalRemaining, currency)}
            </div>
          </div>
        </div>

        {/* Big Overall Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                summary.overallPercent >= 100 
                  ? 'bg-gradient-to-r from-rose-500 to-red-600'
                  : summary.overallPercent >= 75
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500'
              }`}
              style={{ width: `${Math.min(100, summary.overallPercent)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 font-medium">
            <span>0%</span>
            <span>{summary.overallPercent}% allocated spend</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Category Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="glass-panel rounded-2xl p-5 h-44 animate-pulse bg-slate-800/40" />
          ))
        ) : budgets.length === 0 ? (
          <div className="col-span-full glass-panel rounded-2xl p-12 text-center text-slate-400">
            <Target className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h4 className="font-bold text-slate-200 text-base">No Budgets Defined Yet</h4>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Allocate your first monthly budget to keep expenses under control.
            </p>
            <button
              onClick={handleAddNew}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-bold rounded-xl transition"
            >
              Add First Budget
            </button>
          </div>
        ) : (
          budgets.map((b) => {
            const catColor = b.category?.color || '#3b82f6';
            const catIcon = b.category?.icon || 'Tag';
            const isExceeded = b.status === 'exceeded';
            const isWarning = b.status === 'warning';

            return (
              <div
                key={b.id}
                className="glass-panel glass-panel-hover rounded-2xl p-5 shadow-lg flex flex-col justify-between"
              >
                <div>
                  
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2.5">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-sm"
                        style={{ backgroundColor: catColor }}
                      >
                        <CategoryIcon name={catIcon} className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-100">{b.category?.name}</h4>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isExceeded
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : isWarning
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {isExceeded ? 'Exceeded' : isWarning ? 'Warning' : 'On Track'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleEdit(b)}
                        className="p-1.5 text-slate-400 hover:text-cyan-400 rounded-lg hover:bg-slate-800 transition"
                        title="Edit budget"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(b.id, b.category?.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
                        title="Delete budget"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Amounts */}
                  <div className="flex items-baseline justify-between mt-3 mb-2">
                    <div>
                      <span className="text-[11px] text-slate-400">Spent: </span>
                      <span className="font-bold text-slate-200">
                        {formatCurrency(b.spent, currency)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400">Cap: </span>
                      <span className="font-semibold text-slate-300">
                        {formatCurrency(b.amount, currency)}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isExceeded
                          ? 'bg-rose-500'
                          : isWarning
                          ? 'bg-amber-500'
                          : 'bg-cyan-500'
                      }`}
                      style={{ width: `${Math.min(100, b.percent)}%` }}
                    />
                  </div>

                </div>

                {/* Remaining Info Footer */}
                <div className="flex items-center justify-between text-xs pt-3 mt-3 border-t border-slate-800/80">
                  <span className="text-slate-400">
                    {b.percent}% of budget
                  </span>
                  <span className={`font-semibold ${b.remaining >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {b.remaining >= 0 
                      ? `${formatCurrency(b.remaining, currency)} left` 
                      : `${formatCurrency(Math.abs(b.remaining), currency)} over`
                    }
                  </span>
                </div>

              </div>
            );
          })
        )}
      </div>

      <BudgetModal
        isOpen={isModalOpen}
        categories={categories}
        existingBudget={editingBudget}
        onClose={() => setIsModalOpen(false)}
        onSaved={() => {
          loadBudgets();
          if (onRefresh) onRefresh();
        }}
      />

    </div>
  );
};
