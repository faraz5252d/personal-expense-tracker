import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { OverviewCards } from './components/OverviewCards';
import { ChartsSection } from './components/ChartsSection';
import { RecentTransactions } from './components/RecentTransactions';
import { TransactionList } from './components/TransactionList';
import { BudgetSection } from './components/BudgetSection';
import { AnalyticsView } from './components/AnalyticsView';
import { CategoryManager } from './components/CategoryManager';
import { TransactionModal } from './components/TransactionModal';
import { Toast } from './components/Toast';
import { useApp } from './context/AppContext';
import { api } from './services/api';

export function App() {
  const { 
    activeTab, 
    isAddModalOpen, 
    closeAddModal, 
    refreshKey, 
    triggerRefresh 
  } = useApp();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [overview, setOverview] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);

  const loadAllData = async () => {
    try {
      const [ovRes, txRes, catRes, trRes, brRes] = await Promise.all([
        api.getOverview().catch(() => ({ data: {} })),
        api.getTransactions().catch(() => ({ data: [] })),
        api.getCategories().catch(() => ({ data: [] })),
        api.getMonthlyTrend().catch(() => ({ data: [] })),
        api.getCategoryBreakdown('expense').catch(() => ({ data: [] }))
      ]);

      setOverview(ovRes.data || {});
      setTransactions(txRes.data || []);
      setCategories(catRes.data || []);
      setTrendData(trRes.data || []);
      setCategoryBreakdown(brRes.data || []);
    } catch (err) {
      console.error('Failed to load application data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [refreshKey]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar onToggleSidebar={() => setIsSidebarOpen(prev => !prev)} />

      {/* Main Workspace */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Navigation Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        {/* Content View Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <OverviewCards overview={overview} loading={loading} />
              <ChartsSection 
                trendData={trendData} 
                categoryData={categoryBreakdown} 
                loading={loading} 
              />
              <RecentTransactions 
                transactions={transactions} 
                onRefresh={triggerRefresh} 
              />
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="animate-in fade-in duration-300">
              <TransactionList 
                transactions={transactions} 
                categories={categories} 
                loading={loading} 
                onRefresh={triggerRefresh} 
              />
            </div>
          )}

          {activeTab === 'budgets' && (
            <div className="animate-in fade-in duration-300">
              <BudgetSection 
                categories={categories} 
                onRefresh={triggerRefresh} 
              />
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="animate-in fade-in duration-300">
              <AnalyticsView />
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="animate-in fade-in duration-300">
              <CategoryManager 
                categories={categories} 
                onRefresh={triggerRefresh} 
              />
            </div>
          )}

        </main>
      </div>

      {/* Global Add / Edit Modal */}
      <TransactionModal
        isOpen={isAddModalOpen}
        categories={categories}
        onClose={closeAddModal}
        onSaved={triggerRefresh}
      />

      {/* Toast alert popup */}
      <Toast />

    </div>
  );
}

export default App;
