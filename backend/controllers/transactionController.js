const Store = require('../data/store');

exports.getAllTransactions = (req, res) => {
  try {
    const { type, categoryId, startDate, endDate, paymentMethod, search, limit, page } = req.query;
    let transactions = Store.getTransactions({ type, categoryId, startDate, endDate, paymentMethod, search });
    const categories = Store.getCategories();
    const categoryMap = categories.reduce((acc, cat) => {
      acc[cat.id] = cat;
      return acc;
    }, {});

    // Attach category details
    const enriched = transactions.map(tx => ({
      ...tx,
      category: categoryMap[tx.categoryId] || {
        id: tx.categoryId,
        name: 'Uncategorized',
        color: '#94a3b8',
        icon: 'Tag'
      }
    }));

    const totalCount = enriched.length;
    let result = enriched;

    if (page && limit) {
      const p = parseInt(page, 10) || 1;
      const l = parseInt(limit, 10) || 10;
      const start = (p - 1) * l;
      result = enriched.slice(start, start + l);
    }

    res.json({
      success: true,
      totalCount,
      count: result.length,
      data: result
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTransactionById = (req, res) => {
  try {
    const tx = Store.getTransactionById(req.params.id);
    if (!tx) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    const category = Store.getCategoryById(tx.categoryId);
    res.json({
      success: true,
      data: { ...tx, category }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createTransaction = (req, res) => {
  try {
    const { title, amount, type, categoryId, date, paymentMethod, notes } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }
    if (amount === undefined || isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: 'Valid positive amount is required' });
    }
    if (!categoryId) {
      return res.status(400).json({ success: false, message: 'Category is required' });
    }

    const created = Store.addTransaction({
      title,
      amount,
      type: type || 'expense',
      categoryId,
      date,
      paymentMethod,
      notes
    });

    const category = Store.getCategoryById(created.categoryId);

    res.status(201).json({
      success: true,
      message: 'Transaction recorded successfully',
      data: { ...created, category }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateTransaction = (req, res) => {
  try {
    const { id } = req.params;
    const existing = Store.getTransactionById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    if (req.body.amount !== undefined && (isNaN(req.body.amount) || Number(req.body.amount) <= 0)) {
      return res.status(400).json({ success: false, message: 'Amount must be a positive number' });
    }

    const updated = Store.updateTransaction(id, req.body);
    const category = Store.getCategoryById(updated.categoryId);

    res.json({
      success: true,
      message: 'Transaction updated successfully',
      data: { ...updated, category }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteTransaction = (req, res) => {
  try {
    const success = Store.deleteTransaction(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    res.json({
      success: true,
      message: 'Transaction deleted successfully'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
