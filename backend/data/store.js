const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname);
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Initial default categories
const DEFAULT_CATEGORIES = [
  // Expense Categories
  { id: 'cat-housing', name: 'Housing & Rent', type: 'expense', icon: 'Home', color: '#6366f1', isDefault: true },
  { id: 'cat-groceries', name: 'Groceries', type: 'expense', icon: 'ShoppingBag', color: '#10b981', isDefault: true },
  { id: 'cat-dining', name: 'Food & Dining', type: 'expense', icon: 'Utensils', color: '#f59e0b', isDefault: true },
  { id: 'cat-transport', name: 'Transportation', type: 'expense', icon: 'Car', color: '#3b82f6', isDefault: true },
  { id: 'cat-utilities', name: 'Utilities & Bills', type: 'expense', icon: 'Zap', color: '#ec4899', isDefault: true },
  { id: 'cat-entertainment', name: 'Entertainment', type: 'expense', icon: 'Film', color: '#8b5cf6', isDefault: true },
  { id: 'cat-health', name: 'Healthcare & Fitness', type: 'expense', icon: 'Activity', color: '#ef4444', isDefault: true },
  { id: 'cat-shopping', name: 'Shopping & Gear', type: 'expense', icon: 'Package', color: '#14b8a6', isDefault: true },
  { id: 'cat-education', name: 'Education & Books', type: 'expense', icon: 'BookOpen', color: '#06b6d4', isDefault: true },
  { id: 'cat-other-exp', name: 'Miscellaneous', type: 'expense', icon: 'Tag', color: '#64748b', isDefault: true },
  // Income Categories
  { id: 'cat-salary', name: 'Salary', type: 'income', icon: 'Briefcase', color: '#22c55e', isDefault: true },
  { id: 'cat-freelance', name: 'Freelance & Contract', type: 'income', icon: 'Laptop', color: '#3b82f6', isDefault: true },
  { id: 'cat-investment', name: 'Investments & Dividends', type: 'income', icon: 'TrendingUp', color: '#8b5cf6', isDefault: true },
  { id: 'cat-other-inc', name: 'Other Income', type: 'income', icon: 'DollarSign', color: '#10b981', isDefault: true }
];

// Initial default budgets for current month
const DEFAULT_BUDGETS = [
  { id: 'b-housing', categoryId: 'cat-housing', amount: 1200, month: new Date().toISOString().slice(0, 7) },
  { id: 'b-groceries', categoryId: 'cat-groceries', amount: 450, month: new Date().toISOString().slice(0, 7) },
  { id: 'b-dining', categoryId: 'cat-dining', amount: 250, month: new Date().toISOString().slice(0, 7) },
  { id: 'b-transport', categoryId: 'cat-transport', amount: 200, month: new Date().toISOString().slice(0, 7) },
  { id: 'b-utilities', categoryId: 'cat-utilities', amount: 180, month: new Date().toISOString().slice(0, 7) },
  { id: 'b-entertainment', categoryId: 'cat-entertainment', amount: 150, month: new Date().toISOString().slice(0, 7) },
  { id: 'b-shopping', categoryId: 'cat-shopping', amount: 200, month: new Date().toISOString().slice(0, 7) }
];

// Generate realistic seed transactions
function generateSeedTransactions() {
  const now = new Date();
  const txs = [];

  const addTx = (title, amount, type, categoryId, daysAgo, paymentMethod, notes = '') => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    txs.push({
      id: uuidv4(),
      title,
      amount: Number(amount),
      type,
      categoryId,
      date: d.toISOString().split('T')[0],
      paymentMethod,
      notes,
      createdAt: d.toISOString()
    });
  };

  // Incomes
  addTx('Monthly Salary Deposit', 4200.00, 'income', 'cat-salary', 12, 'Bank Transfer', 'Primary payroll direct deposit');
  addTx('Freelance UI/UX Project', 850.00, 'income', 'cat-freelance', 6, 'Bank Transfer', 'Mobile app client payout');
  addTx('Stock Dividend Yield', 120.00, 'income', 'cat-investment', 18, 'Bank Transfer', 'Quarterly index fund dividend');

  // Expenses
  addTx('Apartment Rent', 1150.00, 'expense', 'cat-housing', 11, 'Bank Transfer', 'Monthly lease payment');
  addTx('Whole Foods Supermarket', 134.50, 'expense', 'cat-groceries', 2, 'Credit Card', 'Weekly grocery restocking');
  addTx('Trader Joe\'s Essentials', 86.20, 'expense', 'cat-groceries', 8, 'Debit Card', 'Snacks & organic staples');
  addTx('Electric & Power Utility', 92.40, 'expense', 'cat-utilities', 10, 'Bank Transfer', 'Electric bill');
  addTx('High-Speed Fiber Internet', 65.00, 'expense', 'cat-utilities', 14, 'Credit Card', 'Fiber broadband');
  addTx('Italian Bistro Dinner', 74.50, 'expense', 'cat-dining', 3, 'Credit Card', 'Dinner with teammates');
  addTx('Blue Bottle Specialty Coffee', 18.25, 'expense', 'cat-dining', 1, 'UPI', 'Coffee and bakery pastry');
  addTx('Subway & Transit Pass', 45.00, 'expense', 'cat-transport', 5, 'Debit Card', 'Monthly metro card reload');
  addTx('Shell Fuel Station', 52.80, 'expense', 'cat-transport', 9, 'Credit Card', 'Gas refill');
  addTx('Cinema IMAX Tickets', 34.00, 'expense', 'cat-entertainment', 4, 'Credit Card', 'Weekend movie premiere');
  addTx('Spotify Premium Subscription', 10.99, 'expense', 'cat-entertainment', 15, 'Credit Card', 'Family music plan');
  addTx('Fitness Gym Membership', 55.00, 'expense', 'cat-health', 13, 'Debit Card', 'Monthly gym dues');
  addTx('Running Shoes & Socks', 110.00, 'expense', 'cat-shopping', 7, 'Credit Card', 'Sportswear purchase');
  addTx('Online Cloud Course', 29.99, 'expense', 'cat-education', 16, 'Credit Card', 'Fullstack certification');

  return txs;
}

// In-memory cache
let cache = null;

function ensureDirExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getInitialData() {
  return {
    categories: DEFAULT_CATEGORIES,
    budgets: DEFAULT_BUDGETS,
    transactions: generateSeedTransactions(),
    settings: {
      currency: '$',
      monthlyBudgetCap: 3000
    }
  };
}

function loadDatabase() {
  if (cache) return cache;
  ensureDirExists();

  if (!fs.existsSync(DB_FILE)) {
    const initial = getInitialData();
    saveDatabase(initial);
    cache = initial;
    return cache;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    cache = JSON.parse(raw);
    return cache;
  } catch (err) {
    console.error('Failed to parse database.json, initializing fresh store:', err.message);
    const initial = getInitialData();
    saveDatabase(initial);
    cache = initial;
    return cache;
  }
}

function saveDatabase(data) {
  ensureDirExists();
  const tmpFile = `${DB_FILE}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tmpFile, DB_FILE);
  cache = data;
}

// Transaction API methods
const Store = {
  // Reset
  reset() {
    const fresh = getInitialData();
    saveDatabase(fresh);
    return fresh;
  },

  // Transactions
  getTransactions(filter = {}) {
    const db = loadDatabase();
    let txs = [...db.transactions];

    if (filter.type) {
      txs = txs.filter(t => t.type.toLowerCase() === filter.type.toLowerCase());
    }
    if (filter.categoryId) {
      txs = txs.filter(t => t.categoryId === filter.categoryId);
    }
    if (filter.startDate) {
      txs = txs.filter(t => t.date >= filter.startDate);
    }
    if (filter.endDate) {
      txs = txs.filter(t => t.date <= filter.endDate);
    }
    if (filter.paymentMethod) {
      txs = txs.filter(t => t.paymentMethod.toLowerCase() === filter.paymentMethod.toLowerCase());
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      txs = txs.filter(t => 
        (t.title && t.title.toLowerCase().includes(q)) || 
        (t.notes && t.notes.toLowerCase().includes(q))
      );
    }

    // Sort descending by date, then createdAt
    txs.sort((a, b) => new Date(b.date) - new Date(a.date) || new Date(b.createdAt) - new Date(a.createdAt));
    return txs;
  },

  getTransactionById(id) {
    const db = loadDatabase();
    return db.transactions.find(t => t.id === id) || null;
  },

  addTransaction(payload) {
    const db = loadDatabase();
    const newTx = {
      id: uuidv4(),
      title: payload.title.trim(),
      amount: parseFloat(payload.amount),
      type: payload.type || 'expense',
      categoryId: payload.categoryId,
      date: payload.date || new Date().toISOString().split('T')[0],
      paymentMethod: payload.paymentMethod || 'Credit Card',
      notes: (payload.notes || '').trim(),
      createdAt: new Date().toISOString()
    };
    db.transactions.unshift(newTx);
    saveDatabase(db);
    return newTx;
  },

  updateTransaction(id, updates) {
    const db = loadDatabase();
    const idx = db.transactions.findIndex(t => t.id === id);
    if (idx === -1) return null;

    const existing = db.transactions[idx];
    const updated = {
      ...existing,
      ...updates,
      amount: updates.amount !== undefined ? parseFloat(updates.amount) : existing.amount,
      updatedAt: new Date().toISOString()
    };
    db.transactions[idx] = updated;
    saveDatabase(db);
    return updated;
  },

  deleteTransaction(id) {
    const db = loadDatabase();
    const idx = db.transactions.findIndex(t => t.id === id);
    if (idx === -1) return false;
    db.transactions.splice(idx, 1);
    saveDatabase(db);
    return true;
  },

  // Categories
  getCategories() {
    const db = loadDatabase();
    return db.categories || DEFAULT_CATEGORIES;
  },

  getCategoryById(id) {
    const db = loadDatabase();
    return db.categories.find(c => c.id === id) || null;
  },

  addCategory(payload) {
    const db = loadDatabase();
    const newCat = {
      id: 'cat-' + uuidv4().slice(0, 8),
      name: payload.name.trim(),
      type: payload.type || 'expense',
      icon: payload.icon || 'Tag',
      color: payload.color || '#3b82f6',
      isDefault: false
    };
    db.categories.push(newCat);
    saveDatabase(db);
    return newCat;
  },

  updateCategory(id, updates) {
    const db = loadDatabase();
    const idx = db.categories.findIndex(c => c.id === id);
    if (idx === -1) return null;
    db.categories[idx] = { ...db.categories[idx], ...updates };
    saveDatabase(db);
    return db.categories[idx];
  },

  deleteCategory(id) {
    const db = loadDatabase();
    const idx = db.categories.findIndex(c => c.id === id);
    if (idx === -1) return false;
    // Don't delete if default
    if (db.categories[idx].isDefault) {
      throw new Error('Default categories cannot be deleted.');
    }
    db.categories.splice(idx, 1);
    saveDatabase(db);
    return true;
  },

  // Budgets
  getBudgets(month) {
    const db = loadDatabase();
    const currentMonth = month || new Date().toISOString().slice(0, 7);
    return (db.budgets || []).filter(b => !b.month || b.month === currentMonth);
  },

  setBudget(payload) {
    const db = loadDatabase();
    const month = payload.month || new Date().toISOString().slice(0, 7);
    const existingIdx = db.budgets.findIndex(b => b.categoryId === payload.categoryId && b.month === month);

    const budgetRecord = {
      id: existingIdx !== -1 ? db.budgets[existingIdx].id : 'b-' + uuidv4().slice(0, 8),
      categoryId: payload.categoryId,
      amount: parseFloat(payload.amount),
      month
    };

    if (existingIdx !== -1) {
      db.budgets[existingIdx] = budgetRecord;
    } else {
      db.budgets.push(budgetRecord);
    }
    saveDatabase(db);
    return budgetRecord;
  },

  deleteBudget(id) {
    const db = loadDatabase();
    const idx = db.budgets.findIndex(b => b.id === id);
    if (idx === -1) return false;
    db.budgets.splice(idx, 1);
    saveDatabase(db);
    return true;
  },

  // Settings
  getSettings() {
    const db = loadDatabase();
    return db.settings || { currency: '$', monthlyBudgetCap: 3000 };
  },

  updateSettings(updates) {
    const db = loadDatabase();
    db.settings = { ...db.settings, ...updates };
    saveDatabase(db);
    return db.settings;
  }
};

// Preload database on startup
loadDatabase();

module.exports = Store;
