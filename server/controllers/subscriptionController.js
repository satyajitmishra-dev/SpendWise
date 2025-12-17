const Subscription = require('../models/Subscription');

exports.getSubscriptions = async (req, res) => {
    try {
        const subs = await Subscription.find({ userId: req.user.id });
        res.json(subs);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.addSubscription = async (req, res) => {
    try {
        const newSub = new Subscription({ ...req.body, userId: req.user.id });
        const sub = await newSub.save();
        res.json(sub);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.deleteSubscription = async (req, res) => {
    try {
        let subscription = await Subscription.findById(req.params.id);

        if (!subscription) return res.status(404).json({ msg: 'Subscription not found' });

        // Make sure user owns subscription
        if (subscription.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Subscription.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Subscription removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateSubscription = async (req, res) => {
    const { name, amount, cycle, renewalDate, autoRenew } = req.body;

    const subscriptionFields = {};
    if (name) subscriptionFields.name = name;
    if (amount) subscriptionFields.amount = amount;
    if (cycle) subscriptionFields.cycle = cycle;
    if (renewalDate) subscriptionFields.renewalDate = renewalDate;
    if (autoRenew !== undefined) subscriptionFields.autoRenew = autoRenew;

    try {
        let subscription = await Subscription.findById(req.params.id);

        if (!subscription) return res.status(404).json({ msg: 'Subscription not found' });

        // Make sure user owns subscription
        if (subscription.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        subscription = await Subscription.findByIdAndUpdate(
            req.params.id,
            { $set: subscriptionFields },
            { new: true }
        );

        res.json(subscription);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


