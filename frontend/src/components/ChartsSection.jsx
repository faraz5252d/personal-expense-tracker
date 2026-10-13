import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatters';

const DEFAULT_COLORS = [
  '#6366f1', '#10b981', '#f59e0b', '#3b82f6', 
  '#ec4899', '#8b5cf6', '#ef4444', '#14b8a6', 
  '#06b6d4', '#64748b'
];

export const ChartsSection = ({ trendData = [], categoryData = [], loading }) => {
  const { currency } = useApp();

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 h-80 animate-pulse bg-slate-800/40" />
        <div className="glass-panel rounded-2xl p-6 h-80 animate-pulse bg-slate-800/40" />
      </div>
    );
  }

  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs">
          <p className="font-semibold text-slate-200 mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="flex justify-between space-x-4">
              <span>{entry.name}:</span>
              <span className="font-bold">{formatCurrency(entry.value, currency)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs">
          <p className="font-semibold text-slate-200">{data.name}</p>
          <p className="font-bold text-cyan-400 mt-0.5">
            {formatCurrency(data.value, currency)} ({data.payload.percentage || 0}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const pieData = (categoryData || []).map((cat, idx) => ({
    name: cat.categoryName,
    value: cat.amount,
    percentage: cat.percentage,
    color: cat.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length]
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Monthly Trend Chart */}
      <div className="lg:col-span-2 glass-panel rounded-2xl p-6 shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-100">Monthly Cash Flow Trend</h3>
            <p className="text-xs text-slate-400">Income vs Expenses over the past 6 months</p>
          </div>
          <span className="text-xs px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg border border-slate-700">
            6 Months
          </span>
        </div>

        <div className="h-72 w-full">
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomBarTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} 
                  iconType="circle"
                />
                <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
              No trend data recorded yet.
            </div>
          )}
        </div>
      </div>

      {/* Category Breakdown Donut */}
      <div className="glass-panel rounded-2xl p-6 shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-base font-bold text-slate-100">Expense Allocation</h3>
            <p className="text-xs text-slate-400">Spending breakdown by category</p>
          </div>
        </div>

        <div className="h-56 w-full flex items-center justify-center">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
              No expense categories available.
            </div>
          )}
        </div>

        {/* Legend pills */}
        <div className="max-h-24 overflow-y-auto space-y-1 pr-1 text-xs mt-2">
          {pieData.slice(0, 4).map((entry, idx) => (
            <div key={idx} className="flex items-center justify-between py-0.5">
              <div className="flex items-center space-x-2 truncate">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
                <span className="text-slate-300 truncate">{entry.name}</span>
              </div>
              <span className="font-semibold text-slate-200 ml-2">
                {entry.percentage}%
              </span>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
