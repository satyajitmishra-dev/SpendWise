const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true }, // Food, Travel, etc.
    type: { type: String, enum: ['expense', 'income'], default: 'expense' },
    note: { type: String },
    date: { type: Date, default: Date.now },
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' } // Optional link to wallet
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);
