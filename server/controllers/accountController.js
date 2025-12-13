const Account = require('../models/Account');

exports.getAccounts = async (req, res) => {
    try {
        const accounts = await Account.find({ userId: req.user._id });
        res.json(accounts);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.addAccount = async (req, res) => {
    try {
        const newAccount = new Account({ ...req.body, userId: req.user._id });
        const account = await newAccount.save();
        res.json(account);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};
