const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getBudgets, addBudget, updateBudget, deleteBudget } = require('../controllers/budgetController');

router.get('/', auth, getBudgets);
router.post('/', auth, addBudget);
router.put('/:id', auth, updateBudget);
router.delete('/:id', auth, deleteBudget);

module.exports = router;
