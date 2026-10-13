const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');

router.get('/', budgetController.getBudgets);
router.post('/', budgetController.setBudget);
router.delete('/:id', budgetController.deleteBudget);

module.exports = router;
