import React, { useState } from 'react';
import { 
  Wallet, 
  Plus, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Menu, 
  X,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useApp, CURRENCIES } from '../context/AppContext';
import { api } from '../services/api';

export const Navbar = ({ onToggleSidebar }) => {
  const { 
    currency, 
    changeCurrency, 
    openAddModal, 
    showToast, 
    isOnline, 
    triggerRefresh 
  } = useApp();
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    if (!window.confirm('Reset database to realistic initial sample transactions and budgets?')) {
      return;
    }
    setIsResetting(true);
    try {
      await api.resetDemoData();
      showToast('Database reset to fresh demo records!', 'success');
      triggerRefresh();
    } catch (err) {
      showToast('Failed to reset data: ' + err.message, 'error');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  VaultFlow
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700">
                  Expense System
                </span>
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Backend Status indicator */}
            <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800/80 border border-slate-700">
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
              <span className={isOnline ? 'text-slate-300' : 'text-rose-400'}>
                {isOnline ? 'API Connected' : 'Offline / Reconnecting'}
              </span>
            </div>

            {/* Currency selector */}
            <div className="relative">
              <select
                value={currency}
                onChange={(e) => changeCurrency(e.target.value)}
                className="bg-slate-800 text-slate-200 text-xs sm:text-sm font-semibold rounded-lg px-2.5 py-1.5 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                title="Select Currency"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.symbol} value={c.symbol} className="bg-slate-900 text-slate-100">
                    {c.symbol} {c.code}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Demo Data */}
            <button
              onClick={handleReset}
              disabled={isResetting}
              className="p-1.5 sm:px-3 sm:py-1.5 text-xs font-medium text-slate-400 hover:text-cyan-400 bg-slate-800/60 hover:bg-slate-800 border border-slate-700 rounded-lg transition flex items-center space-x-1.5"
              title="Reset demo data"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin text-cyan-400' : ''}`} />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>

            {/* Add Transaction Button */}
            <button
              onClick={() => openAddModal()}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-lg shadow-lg shadow-cyan-500/20 active:scale-95 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Record</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
