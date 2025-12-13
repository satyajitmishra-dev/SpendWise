const Expense = require('../models/Expense');

exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.user._id }).sort({ date: -1 });
        res.json(expenses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.addExpense = async (req, res) => {
    const { amount, category, note, date, accountId } = req.body;

    try {
        const newExpense = new Expense({
            userId: req.user._id,
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

exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ msg: 'Expense not found' });
        }

        if (expense.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await expense.deleteOne();
        res.json({ msg: 'Expense removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
