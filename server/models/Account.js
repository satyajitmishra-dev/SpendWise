const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['bank', 'wallet', 'cash', 'other'], default: 'bank' },
    balance: { type: Number, default: 0 },
    color: { type: String, default: '#6366f1' }, // UI color
    isArchived: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Account', AccountSchema);
