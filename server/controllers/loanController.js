const Loan = require('../models/Loan');

exports.getLoans = async (req, res) => {
    try {
        const loans = await Loan.find({ userId: req.user._id });
        res.json(loans);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.addLoan = async (req, res) => {
    try {
        const newLoan = new Loan({ ...req.body, userId: req.user._id });
        const loan = await newLoan.save();
        res.json(loan);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.updateLoan = async (req, res) => {
    try {
        let loan = await Loan.findById(req.params.id);
        if (!loan) return res.status(404).json({ msg: 'Loan not found' });

        if (loan.userId.toString() !== req.user._id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        loan = await Loan.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(loan);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};
