import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  CreditCard, 
  PieChart as PieIcon, 
  Award, 
  Lightbulb, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';

export const AnalyticsView = () => {
  const { currency, refreshKey } = useApp();
  const [overview, setOverview] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ovRes, trRes, catRes, payRes] = await Promise.all([
          api.getOverview(),
          api.getMonthlyTrend(),
          api.getCategoryBreakdown('expense'),
          api.getPaymentMethods()
        ]);
        setOverview(ovRes.data);
        setTrendData(trRes.data || []);
        setCategoryData(catRes.data || []);
        setPaymentData(payRes.data || []);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refreshKey]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="glass-panel rounded-2xl p-6 h-40 animate-pulse bg-slate-800/40" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-panel rounded-2xl p-6 h-72 animate-pulse bg-slate-800/40" />
          <div className="glass-panel rounded-2xl p-6 h-72 animate-pulse bg-slate-800/40" />
        </div>
      </div>
    );
  }

  const {
    totalIncome = 0,
    totalExpense = 0,
    netSavings = 0,
    savingsRate = 0,
    averageExpense = 0,
    highestExpense = null,
    healthScore = 75
  } = overview || {};

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="glass-panel rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <span>Financial Analytics & Insights</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Deep dive into spending patterns, payment methods, and cash flow trends
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-slate-200">
            Health Score: {healthScore}/100
          </span>
        </div>
      </div>

      {/* Cash Flow Area Chart */}
      <div className="glass-panel rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-100">Net Cash Flow Trajectory</h3>
            <p className="text-xs text-slate-400">Monthly net surplus and cash flow accumulation</p>
          </div>
        </div>

        <div className="h-64 w-full">
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  formatter={(val) => [formatCurrency(val, currency), 'Net Savings']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="net" 
                  stroke="#06b6d4" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#colorNet)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
              No trend data available yet.
            </div>
          )}
        </div>
      </div>

      {/* Two Columns: Payment Methods & Top Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Payment Methods */}
        <div className="glass-panel rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <CreditCard className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-slate-100">Payment Modes Breakdown</h3>
            </div>

            <div className="space-y-3.5">
              {paymentData.map((pm, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">{pm.method}</span>
                    <span className="text-slate-200">
                      {formatCurrency(pm.amount, currency)} ({pm.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                      style={{ width: `${pm.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400">
            Total tracked via payment channels: <span className="font-bold text-slate-200">{formatCurrency(totalExpense, currency)}</span>
          </div>
        </div>

        {/* Highest Spend & Smart Recommendations */}
        <div className="glass-panel rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-slate-100">Financial Insights</h3>
            </div>

            <div className="space-y-3">
              {highestExpense && (
                <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Largest Single Outflow
                    </span>
                    <div className="font-bold text-sm text-slate-100 mt-0.5">
                      {highestExpense.title}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {formatDate(highestExpense.date)} • {highestExpense.category?.name}
                    </div>
                  </div>
                  <div className="text-base font-extrabold text-rose-400">
                    {formatCurrency(highestExpense.amount, currency)}
                  </div>
                </div>
              )}

              <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Average Outflow Size
                </span>
                <div className="text-lg font-bold text-slate-100 mt-0.5">
                  {formatCurrency(averageExpense, currency)}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Average transaction expenditure across all categories
                </div>
              </div>

              <div className="p-3.5 bg-cyan-500/10 rounded-xl border border-cyan-500/20 text-xs text-cyan-200">
                <span className="font-bold text-cyan-300">💡 Optimization Recommendation:</span>{' '}
                {savingsRate >= 30
                  ? 'Your savings rate is in the top tier! Consider directing surplus funds into an emergency buffer or investments.'
                  : savingsRate >= 15
                  ? 'Healthy savings habits. Review top discretionary categories to unlock an additional 5% savings cushion.'
                  : 'Outflows are nearing inflows. Setting category budget limits can help curtail impulse expenditures.'}
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
