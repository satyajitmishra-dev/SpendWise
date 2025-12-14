const Expense = require('../models/Expense');

exports.getExpenses = async (req, res) => {
    try {
        console.log('GET Expenses for User:', req.user.id);
        const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
        console.log('Found Expenses:', expenses.length);
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
            userId: req.user.id,
            amount,
            category,
            note,
            date,
            accountId
        });
        console.log('ADD Expense for User:', req.user.id);
        const expense = await newExpense.save();
        console.log('Saved Expense:', expense._id);
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

        console.log(`Synced ${newExpenses.length} expenses for user ${req.user.id}`);
        res.json({ msg: 'Sync successful', count: newExpenses.length });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
