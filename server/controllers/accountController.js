const Account = require('../models/Account');
const { createNotification } = require('./notificationController');

exports.getAccounts = async (req, res) => {
    try {
        const accounts = await Account.find({ userId: req.user.id });
        res.json(accounts);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};

exports.addAccount = async (req, res) => {
    try {
        const newAccount = new Account({ ...req.body, userId: req.user.id });
        const account = await newAccount.save();

        await createNotification(req.user.id, 'New Account', `You added a new ${req.body.type} account: ${req.body.name}`, 'success');

        res.json(account);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error', error: err.message });
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
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        console.log(`[DeleteAccount] Request to delete account: ${req.params.id} by user: ${req.user.id}`);
        const account = await Account.findById(req.params.id);

        if (!account) {
            console.warn(`[DeleteAccount] Account not found: ${req.params.id}`);
            return res.status(404).json({ msg: 'Account not found' });
        }

        if (account.userId.toString() !== req.user.id) {
            console.warn(`[DeleteAccount] Unauthorized deletion attempt by ${req.user.id} on account ${account._id}`);
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await account.deleteOne();
        console.log(`[DeleteAccount] Successfully deleted account: ${account._id}`);
        res.json({ msg: 'Account removed' });
    } catch (err) {
        console.error(`[DeleteAccount] Error: ${err.message}`);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};
