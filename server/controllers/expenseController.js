const Expense = require('../models/Expense');
const mongoose = require('mongoose');

exports.getExpenses = async (req, res) => {
    try {

        const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });

        res.json(expenses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.addExpense = async (req, res) => {
    const { amount, category, note, date, accountId } = req.body;

    // Start a transaction or just do sequential updates (No transaction for simple MVP)
    try {
        // If accountId is provided, deduct from account
        if (accountId) {
            const Account = require('../models/Account'); // Lazy import to avoid circular dependency if any
            const account = await Account.findById(accountId);

            if (!account) {
                return res.status(404).json({ msg: 'Account not found' });
            }

            // Verify ownership
            if (account.userId.toString() !== req.user.id) {
                return res.status(401).json({ msg: 'Unauthorized access to account' });
            }

            account.balance -= amount;
            await account.save();
        }

        const newExpense = new Expense({
            userId: req.user.id,
            amount,
            category,
            note,
            date,
            accountId
        });

        const expense = await newExpense.save();

        res.json(expense);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateExpense = async (req, res) => {
    try {
        let expense = await Expense.findById(req.params.id);
        if (!expense) return res.status(404).json({ msg: 'Expense not found' });

        if (expense.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        expense = await Expense.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(expense);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ msg: 'Expense not found' });
        }

        if (expense.userId.toString() !== req.user.id.toString()) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await expense.deleteOne();
        res.json({ msg: 'Expense removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.syncExpenses = async (req, res) => {
    const { expenses } = req.body;
    if (!expenses || !Array.isArray(expenses)) {
        return res.status(400).json({ msg: 'Expenses array is required' });
    }

    try {
        const newExpenses = expenses.map(exp => ({
            userId: req.user.id,
            amount: exp.amount,
            category: exp.category,
            note: exp.note,
            date: exp.date,
            accountId: exp.accountId // Optional: might need mapping if account IDs are local
        }));

        if (newExpenses.length > 0) {
            await Expense.insertMany(newExpenses);
        }


        res.json({ msg: 'Sync successful', count: newExpenses.length });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getExpenseStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        // 1. Monthly Trend (Last 6 Months)
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

        const monthlyStats = await Expense.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    date: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$date" },
                        year: { $year: "$date" }
                    },
                    total: { $sum: "$amount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Format for frontend
        const formatMonth = (m, y) => new Date(y, m - 1).toLocaleString('default', { month: 'short' });

        // Fill in missing months
        const trendData = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const month = d.getMonth() + 1;
            const year = d.getFullYear();

            const found = monthlyStats.find(s => s._id.month === month && s._id.year === year);
            trendData.push({
                name: formatMonth(month, year),
                amount: found ? found.total : 0
            });
        }

        // 2. Category Breakdown (Current Month)
        const startOfMonth = new Date(currentYear, currentMonth, 1);
        const endOfMonth = new Date(currentYear, currentMonth + 1, 0);

        const categoryStats = await Expense.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    date: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            {
                $group: {
                    _id: "$category",
                    value: { $sum: "$amount" }
                }
            }
        ]);

        const categoryData = categoryStats.map(s => ({
            name: s._id,
            value: s.value
        }));

        res.json({ trend: trendData, category: categoryData });
    } catch (err) {
        console.error('Stats Error:', err.message);
        res.status(500).send('Server Error');
    }
};
