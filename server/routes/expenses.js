const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getExpenses, addExpense, deleteExpense } = require('../controllers/expenseController');

// @route   GET api/expenses
// @desc    Get all user expenses
// @access  Private
router.get('/', auth, getExpenses);

// @route   POST api/expenses
// @desc    Add new expense
// @access  Private
router.post('/', auth, addExpense);

// @route   DELETE api/expenses/:id
// @desc    Delete expense
// @access  Private
router.delete('/:id', auth, deleteExpense);

module.exports = router;
