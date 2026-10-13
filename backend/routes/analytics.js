const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/overview', analyticsController.getOverview);
router.get('/monthly-trend', analyticsController.getMonthlyTrend);
router.get('/category-breakdown', analyticsController.getCategoryBreakdown);
router.get('/payment-methods', analyticsController.getPaymentMethodsBreakdown);
router.get('/export-csv', analyticsController.exportCSV);

module.exports = router;
