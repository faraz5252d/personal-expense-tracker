const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
  baseUrl: API_BASE,

  // Health
  checkHealth: async () => {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return res.ok;
    } catch {
      return false;
    }
  },

  // Transactions
  getTransactions: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        params.append(key, val);
      }
    });
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return request(`/transactions${queryString}`);
  },

  createTransaction: (data) => {
    return request('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateTransaction: (id, data) => {
    return request(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteTransaction: (id) => {
    return request(`/transactions/${id}`, {
      method: 'DELETE',
    });
  },

  // Categories
  getCategories: () => {
    return request('/categories');
  },

  createCategory: (data) => {
    return request('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  deleteCategory: (id) => {
    return request(`/categories/${id}`, {
      method: 'DELETE',
    });
  },

  // Budgets
  getBudgets: (month) => {
    const query = month ? `?month=${month}` : '';
    return request(`/budgets${query}`);
  },

  setBudget: (data) => {
    return request('/budgets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  deleteBudget: (id) => {
    return request(`/budgets/${id}`, {
      method: 'DELETE',
    });
  },

  // Analytics
  getOverview: () => {
    return request('/analytics/overview');
  },

  getMonthlyTrend: () => {
    return request('/analytics/monthly-trend');
  },

  getCategoryBreakdown: (type = 'expense') => {
    return request(`/analytics/category-breakdown?type=${type}`);
  },

  getPaymentMethods: () => {
    return request('/analytics/payment-methods');
  },

  getExportCsvUrl: () => {
    return `${API_BASE}/analytics/export-csv`;
  },

  // Settings
  getSettings: () => {
    return request('/settings');
  },

  updateSettings: (data) => {
    return request('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Reset Demo Data
  resetDemoData: () => {
    return request('/reset', {
      method: 'POST',
    });
  }
};
