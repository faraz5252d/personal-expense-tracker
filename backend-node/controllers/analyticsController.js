const Store = require('../data/store');

exports.getOverview = (req, res) => {
  try {
    const transactions = Store.getTransactions();
    const categories = Store.getCategories();
    const categoryMap = categories.reduce((acc, c) => ({ ...acc, [c.id]: c }), {});

    let totalIncome = 0;
    let totalExpense = 0;
    let highestExpense = null;

    transactions.forEach(tx => {
      const amt = Number(tx.amount);
      if (tx.type === 'income') {
        totalIncome += amt;
      } else {
        totalExpense += amt;
        if (!highestExpense || amt > Number(highestExpense.amount)) {
          highestExpense = {
            ...tx,
            category: categoryMap[tx.categoryId] || { name: 'Expense', color: '#ef4444' }
          };
        }
      }
    });

    const netSavings = Math.round((totalIncome - totalExpense) * 100) / 100;
    const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;
    const avgExpense = transactions.filter(t => t.type === 'expense').length > 0
      ? Math.round((totalExpense / transactions.filter(t => t.type === 'expense').length) * 100) / 100
      : 0;

    // Calculate Financial Health Score (0-100)
    let healthScore = 50;
    if (savingsRate >= 40) healthScore += 30;
    else if (savingsRate >= 20) healthScore += 20;
    else if (savingsRate >= 0) healthScore += 10;
    else healthScore -= 20;

    if (totalExpense < totalIncome) healthScore += 15;
    if (transactions.length >= 10) healthScore += 5;
    healthScore = Math.max(10, Math.min(99, healthScore));

    res.json({
      success: true,
      data: {
        totalIncome: Math.round(totalIncome * 100) / 100,
        totalExpense: Math.round(totalExpense * 100) / 100,
        netSavings,
        savingsRate,
        transactionCount: transactions.length,
        averageExpense: avgExpense,
        highestExpense,
        healthScore
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMonthlyTrend = (req, res) => {
  try {
    const transactions = Store.getTransactions();
    const monthMap = {};

    // Get last 6 calendar months
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toISOString().slice(0, 7); // 'YYYY-MM'
      const label = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthMap[key] = { month: key, label, income: 0, expense: 0, net: 0 };
    }

    transactions.forEach(tx => {
      const mKey = tx.date.slice(0, 7);
      if (monthMap[mKey]) {
        const amt = Number(tx.amount);
        if (tx.type === 'income') {
          monthMap[mKey].income += amt;
        } else {
          monthMap[mKey].expense += amt;
        }
      }
    });

    const trend = Object.values(monthMap).map(m => ({
      ...m,
      income: Math.round(m.income * 100) / 100,
      expense: Math.round(m.expense * 100) / 100,
      net: Math.round((m.income - m.expense) * 100) / 100
    }));

    res.json({
      success: true,
      data: trend
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCategoryBreakdown = (req, res) => {
  try {
    const type = req.query.type || 'expense';
    const transactions = Store.getTransactions({ type });
    const categories = Store.getCategories();
    const categoryMap = categories.reduce((acc, c) => ({ ...acc, [c.id]: c }), {});

    const catSums = {};
    let grandTotal = 0;

    transactions.forEach(tx => {
      const amt = Number(tx.amount);
      grandTotal += amt;
      catSums[tx.categoryId] = (catSums[tx.categoryId] || 0) + amt;
    });

    const breakdown = Object.keys(catSums).map(catId => {
      const cat = categoryMap[catId] || { name: 'Other', color: '#94a3b8' };
      const amount = Math.round(catSums[catId] * 100) / 100;
      const percentage = grandTotal > 0 ? Math.round((amount / grandTotal) * 1000) / 10 : 0;
      return {
        categoryId: catId,
        categoryName: cat.name,
        color: cat.color,
        icon: cat.icon,
        amount,
        percentage
      };
    }).sort((a, b) => b.amount - a.amount);

    res.json({
      success: true,
      type,
      total: Math.round(grandTotal * 100) / 100,
      data: breakdown
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getPaymentMethodsBreakdown = (req, res) => {
  try {
    const transactions = Store.getTransactions({ type: 'expense' });
    const methodSums = {};
    let total = 0;

    transactions.forEach(tx => {
      const method = tx.paymentMethod || 'Cash';
      const amt = Number(tx.amount);
      total += amt;
      methodSums[method] = (methodSums[method] || 0) + amt;
    });

    const data = Object.keys(methodSums).map(method => ({
      method,
      amount: Math.round(methodSums[method] * 100) / 100,
      percentage: total > 0 ? Math.round((methodSums[method] / total) * 100) : 0
    })).sort((a, b) => b.amount - a.amount);

    res.json({
      success: true,
      total: Math.round(total * 100) / 100,
      data
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.exportCSV = (req, res) => {
  try {
    const transactions = Store.getTransactions();
    const categories = Store.getCategories();
    const categoryMap = categories.reduce((acc, c) => ({ ...acc, [c.id]: c }), {});

    const headers = ['ID', 'Date', 'Title', 'Type', 'Category', 'Amount', 'Payment Method', 'Notes'];
    const rows = transactions.map(tx => [
      `"${tx.id}"`,
      `"${tx.date}"`,
      `"${(tx.title || '').replace(/"/g, '""')}"`,
      `"${tx.type}"`,
      `"${(categoryMap[tx.categoryId]?.name || 'Unknown').replace(/"/g, '""')}"`,
      tx.amount,
      `"${tx.paymentMethod || 'Other'}"`,
      `"${(tx.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="expenses_export.csv"');
    res.status(200).send(csvContent);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
