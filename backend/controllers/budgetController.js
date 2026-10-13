const Store = require('../data/store');

exports.getBudgets = (req, res) => {
  try {
    const month = req.query.month || new Date().toISOString().slice(0, 7);
    const budgets = Store.getBudgets(month);
    const categories = Store.getCategories();
    const categoryMap = categories.reduce((acc, cat) => {
      acc[cat.id] = cat;
      return acc;
    }, {});

    // Filter transactions for this month and expense type
    const [year, m] = month.split('-');
    const startDate = `${month}-01`;
    // Last day of month
    const lastDay = new Date(year, m, 0).getDate();
    const endDate = `${month}-${String(lastDay).padStart(2, '0')}`;

    const monthTxs = Store.getTransactions({
      type: 'expense',
      startDate,
      endDate
    });

    // Calculate actual spending per category
    const categorySpending = monthTxs.reduce((acc, tx) => {
      acc[tx.categoryId] = (acc[tx.categoryId] || 0) + Number(tx.amount);
      return acc;
    }, {});

    let totalBudget = 0;
    let totalSpent = 0;

    const enrichedBudgets = budgets.map(b => {
      const spent = Math.round((categorySpending[b.categoryId] || 0) * 100) / 100;
      const budgetAmount = Number(b.amount);
      const remaining = Math.round((budgetAmount - spent) * 100) / 100;
      const percent = budgetAmount > 0 ? Math.round((spent / budgetAmount) * 100) : 0;

      let status = 'safe';
      if (percent >= 100) status = 'exceeded';
      else if (percent >= 75) status = 'warning';

      totalBudget += budgetAmount;
      totalSpent += spent;

      return {
        ...b,
        spent,
        remaining,
        percent,
        status,
        category: categoryMap[b.categoryId] || { name: 'Unknown', color: '#64748b', icon: 'Tag' }
      };
    });

    const overallPercent = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
    const alerts = enrichedBudgets
      .filter(b => b.status === 'warning' || b.status === 'exceeded')
      .map(b => ({
        categoryId: b.categoryId,
        categoryName: b.category.name,
        budgetAmount: b.amount,
        spent: b.spent,
        percent: b.percent,
        status: b.status,
        message: b.status === 'exceeded'
          ? `Budget exceeded by $${(b.spent - b.amount).toFixed(2)} in ${b.category.name}`
          : `Approaching budget limit (${b.percent}% spent) in ${b.category.name}`
      }));

    res.json({
      success: true,
      month,
      summary: {
        totalBudget: Math.round(totalBudget * 100) / 100,
        totalSpent: Math.round(totalSpent * 100) / 100,
        totalRemaining: Math.round((totalBudget - totalSpent) * 100) / 100,
        overallPercent,
        alertsCount: alerts.length
      },
      alerts,
      data: enrichedBudgets
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.setBudget = (req, res) => {
  try {
    const { categoryId, amount, month } = req.body;

    if (!categoryId) {
      return res.status(400).json({ success: false, message: 'Category ID is required' });
    }
    if (amount === undefined || isNaN(amount) || Number(amount) < 0) {
      return res.status(400).json({ success: false, message: 'Valid budget amount is required' });
    }

    const saved = Store.setBudget({
      categoryId,
      amount,
      month: month || new Date().toISOString().slice(0, 7)
    });

    const category = Store.getCategoryById(saved.categoryId);

    res.json({
      success: true,
      message: 'Budget set successfully',
      data: { ...saved, category }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteBudget = (req, res) => {
  try {
    const { id } = req.params;
    const success = Store.deleteBudget(id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Budget record not found' });
    }
    res.json({ success: true, message: 'Budget removed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
