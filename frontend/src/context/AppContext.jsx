import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const AppContext = createContext();

export const CURRENCIES = [
  { symbol: '$', code: 'USD', name: 'US Dollar ($)' },
  { symbol: '€', code: 'EUR', name: 'Euro (€)' },
  { symbol: '£', code: 'GBP', name: 'British Pound (£)' },
  { symbol: '₹', code: 'INR', name: 'Indian Rupee (₹)' },
];

export const AppProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => localStorage.getItem('vaultflow_currency') || '$');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [toast, setToast] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  const triggerRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  const changeCurrency = (symbol) => {
    setCurrency(symbol);
    localStorage.setItem('vaultflow_currency', symbol);
    showToast(`Currency changed to ${symbol}`, 'info');
  };

  const openAddModal = (tx = null) => {
    setEditingTransaction(tx);
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setEditingTransaction(null);
    setIsAddModalOpen(false);
  };

  // Health ping
  useEffect(() => {
    let interval;
    const check = async () => {
      const ok = await api.checkHealth();
      setIsOnline(ok);
    };
    check();
    interval = setInterval(check, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppContext.Provider
      value={{
        currency,
        changeCurrency,
        activeTab,
        setActiveTab,
        isAddModalOpen,
        editingTransaction,
        openAddModal,
        closeAddModal,
        toast,
        showToast,
        isOnline,
        refreshKey,
        triggerRefresh,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
