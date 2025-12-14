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
