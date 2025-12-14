const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getExpenses, addExpense, updateExpense, deleteExpense, syncExpenses, getExpenseStats } = require('../controllers/expenseController');

// @route   GET api/expenses
// @desc    Get all user expenses
// @access  Private
router.get('/', auth, getExpenses);

// @route   POST api/expenses
// @desc    Add new expense
// @access  Private
router.post('/', auth, addExpense);

// @route   PUT api/expenses/:id
// @desc    Update expense
// @access  Private
router.put('/:id', auth, updateExpense);

// @route   DELETE api/expenses/:id
// @desc    Delete expense
// @access  Private
router.delete('/:id', auth, deleteExpense);

// @route   POST api/expenses/sync
// @desc    Sync guest expenses (Bulk Insert)
// @access  Private
router.post('/sync', auth, syncExpenses);

// @route   GET api/expenses/stats
// @desc    Get analytics data
// @access  Private
router.get('/stats', auth, getExpenseStats);

module.exports = router;
