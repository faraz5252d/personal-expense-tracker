import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  ShieldCheck 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatters';

export const OverviewCards = ({ overview, loading }) => {
  const { currency } = useApp();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="glass-panel rounded-2xl p-5 animate-pulse">
            <div className="w-8 h-8 rounded-lg bg-slate-800 mb-3" />
            <div className="h-4 bg-slate-800 rounded w-1/2 mb-2" />
            <div className="h-6 bg-slate-800 rounded w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  const {
    totalIncome = 0,
    totalExpense = 0,
    netSavings = 0,
    savingsRate = 0,
    healthScore = 75
  } = overview || {};

  const cards = [
    {
      title: 'Net Balance',
      value: formatCurrency(netSavings, currency),
      subtext: netSavings >= 0 ? 'Surplus in account' : 'Deficit spending',
      icon: DollarSign,
      color: 'from-blue-500 to-cyan-500',
      textColor: netSavings >= 0 ? 'text-emerald-400' : 'text-rose-400',
      bgGlow: 'shadow-blue-500/10'
    },
    {
      title: 'Total Income',
      value: formatCurrency(totalIncome, currency),
      subtext: 'Revenue earned',
      icon: TrendingUp,
      color: 'from-emerald-500 to-teal-500',
      textColor: 'text-emerald-400',
      bgGlow: 'shadow-emerald-500/10'
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(totalExpense, currency),
      subtext: 'Cash outflow',
      icon: TrendingDown,
      color: 'from-rose-500 to-amber-500',
      textColor: 'text-rose-400',
      bgGlow: 'shadow-rose-500/10'
    },
    {
      title: 'Savings Rate',
      value: `${savingsRate}%`,
      subtext: savingsRate > 30 ? 'Strong savings pace' : 'Target: 20%+',
      icon: PiggyBank,
      color: 'from-indigo-500 to-purple-500',
      textColor: 'text-indigo-400',
      bgGlow: 'shadow-indigo-500/10'
    },
    {
      title: 'Financial Health',
      value: `${healthScore}/100`,
      subtext: healthScore >= 70 ? 'Optimal rating' : 'Action recommended',
      icon: ShieldCheck,
      color: 'from-amber-500 to-yellow-500',
      textColor: 'text-amber-400',
      bgGlow: 'shadow-amber-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((c, idx) => {
        const Icon = c.icon;
        return (
          <div
            key={idx}
            className={`glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between shadow-lg ${c.bgGlow}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {c.title}
              </span>
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${c.color} flex items-center justify-center text-white shadow-md`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className={`text-2xl font-bold tracking-tight ${c.textColor}`}>
                {c.value}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {c.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
