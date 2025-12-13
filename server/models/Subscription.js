const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    cycle: { type: String, enum: ['monthly', 'yearly'], default: 'monthly' },
    renewalDate: { type: Date, required: true },
    autoRenew: { type: Boolean, default: true },
    notificationSent: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Subscription', SubscriptionSchema);
