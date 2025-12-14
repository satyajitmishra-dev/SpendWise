const Budget = require('../models/Budget');

exports.getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ userId: req.user.id });
        res.json(budgets);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.addBudget = async (req, res) => {
    try {
        const { category, amount, period } = req.body;
        const newBudget = new Budget({
            userId: req.user.id,
            category,
            amount,
            period
        });
        const budget = await newBudget.save();
        res.json(budget);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.updateBudget = async (req, res) => {
    try {
        let budget = await Budget.findById(req.params.id);
        if (!budget) return res.status(404).json({ msg: 'Budget not found' });

        if (budget.userId.toString() !== req.user.id.toString()) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        budget = await Budget.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json(budget);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.deleteBudget = async (req, res) => {
    try {
        const budget = await Budget.findById(req.params.id);
        if (!budget) return res.status(404).json({ msg: 'Budget not found' });

        if (budget.userId.toString() !== req.user.id.toString()) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Budget.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Budget removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};
