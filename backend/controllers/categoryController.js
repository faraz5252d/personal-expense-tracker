const Store = require('../data/store');

exports.getAllCategories = (req, res) => {
  try {
    const categories = Store.getCategories();
    const transactions = Store.getTransactions();

    // Calculate aggregated spend/income for each category
    const stats = transactions.reduce((acc, tx) => {
      if (!acc[tx.categoryId]) {
        acc[tx.categoryId] = { count: 0, total: 0 };
      }
      acc[tx.categoryId].count += 1;
      acc[tx.categoryId].total += Number(tx.amount);
      return acc;
    }, {});

    const enriched = categories.map(cat => ({
      ...cat,
      transactionCount: stats[cat.id]?.count || 0,
      totalAmount: Math.round((stats[cat.id]?.total || 0) * 100) / 100
    }));

    res.json({
      success: true,
      count: enriched.length,
      data: enriched
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCategoryById = (req, res) => {
  try {
    const cat = Store.getCategoryById(req.params.id);
    if (!cat) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, data: cat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createCategory = (req, res) => {
  try {
    const { name, type, icon, color } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const created = Store.addCategory({
      name,
      type: type || 'expense',
      icon: icon || 'Tag',
      color: color || '#3b82f6'
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: created
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateCategory = (req, res) => {
  try {
    const { id } = req.params;
    const existing = Store.getCategoryById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const updated = Store.updateCategory(id, req.body);
    res.json({
      success: true,
      message: 'Category updated successfully',
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteCategory = (req, res) => {
  try {
    const { id } = req.params;
    const existing = Store.getCategoryById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    Store.deleteCategory(id);
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
