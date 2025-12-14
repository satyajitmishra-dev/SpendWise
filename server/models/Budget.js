const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    period: { type: String, default: 'monthly' } // monthly, yearly
}, { timestamps: true });

module.exports = mongoose.model('Budget', BudgetSchema);
