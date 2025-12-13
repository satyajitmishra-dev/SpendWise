const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true }, // Sparse allows multiple nulls (guests)
    otp: { type: String },
    otpExpires: { type: Date },
    refreshToken: { type: String },

    // Legacy/Context fields
    status: { type: String, enum: ['student', 'intern', 'professional', 'other'], default: 'student' },
    college: { type: String },
    currency: { type: String, default: 'INR' },
    budget: { type: Number, default: 0 },
    onboardingComplete: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
