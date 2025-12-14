const Account = require('../models/Account');

exports.getAccounts = async (req, res) => {
    try {
        const accounts = await Account.find({ userId: req.user.id });
        res.json(accounts);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.addAccount = async (req, res) => {
    try {
        const newAccount = new Account({ ...req.body, userId: req.user.id });
        const account = await newAccount.save();
        res.json(account);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};
exports.updateAccount = async (req, res) => {
    try {
        let account = await Account.findById(req.params.id);
        if (!account) return res.status(404).json({ msg: 'Account not found' });

        if (account.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        account = await Account.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(account);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        const account = await Account.findById(req.params.id);
        if (!account) return res.status(404).json({ msg: 'Account not found' });

        if (account.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await account.deleteOne();
        res.json({ msg: 'Account removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
