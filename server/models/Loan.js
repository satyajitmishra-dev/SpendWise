const mongoose = require('mongoose');

const LoanSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    person: { type: String, required: true }, // Name of person
    amount: { type: Number, required: true },
    type: { type: String, enum: ['given', 'taken'], required: true }, // Given = I Lent, Taken = I Borrowed
    dueDate: { type: Date },
    status: { type: String, enum: ['pending', 'settled'], default: 'pending' },
    note: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Loan', LoanSchema);
