const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const validator = require('email-validator');
const { sendEmail } = require('../services/emailService');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refreshsecret';

// Configure Nodemailer (Gmail) - MOVED TO emailService.js
// const transporter = ...

// Helper to generate tokens
const generateTokens = (userId) => {
    const accessToken = jwt.sign(
        { user: { id: userId } },
        JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '15m' }
    );
    const refreshToken = jwt.sign(
        { user: { id: userId } },
        REFRESH_SECRET,
        { expiresIn: process.env.REFRESH_EXPIRE || '7d' }
    );
    return { accessToken, refreshToken };
};

// @route   POST api/auth/init
// @desc    Initialize a new GUEST user
exports.initUser = async (req, res) => {
    const { name, status, currency, budget } = req.body;
    try {
        const user = new User({
            name: name || 'Guest',
            status: status || 'student',
            currency: currency || 'INR',
            budget: budget || 0
        });
        await user.save();

        // Even guests get a long-lived token effectively acting as "forever" until cleared
        const { accessToken, refreshToken } = generateTokens(user.id);
        user.refreshToken = refreshToken;
        await user.save();

        res.json({ token: accessToken, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};

// @route   POST api/auth/send-otp
// @desc    Send OTP to email for Login or Signup
// NOTE: This function appears to be legacy/placeholder logic. 
// The actual logic is in loginSendOtp and signupInit below.
exports.sendOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: 'Email is required' });
    if (!validator.validate(email)) return res.status(400).json({ msg: 'Invalid email address' });

    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins

        let user = await User.findOne({ email });

        if (!user && req.path.includes('login')) {
            return res.status(404).json({ msg: 'User not found. Please sign up.' });
        }

        // Logic for generic send OTP would go here if needed.
        // For now, specific endpoints handle this.

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.loginSendOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: 'Email is required' });
    if (!validator.validate(email)) return res.status(400).json({ msg: 'Invalid email address' });

    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 600000; // 10 mins
        await user.save();
        const mailOptions = {
            from: `"SpendWise Security" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Login Verification Code - SpendWise',
            html: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden;">
        <div style="background-color: #4f46e5; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 0.5px;">SpendWise</h1>
        </div>
        <div style="padding: 32px 24px;">
            <h2 style="color: #1e293b; font-size: 20px; margin-top: 0;">Welcome Back!</h2>
            <p style="color: #64748b; margin-bottom: 24px; font-size: 16px; line-height: 1.5;">It looks like you're trying to log in. Here represents your One-Time Password (OTP) to complete the process. This code is valid for 10 minutes.</p>
            <div style="background-color: #f1f5f9; padding: 16px; text-align: center; border-radius: 8px; margin: 24px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #4f46e5; display: block;">${otp}</span>
            </div>
            <p style="color: #94a3b8; font-size: 14px; margin-top: 24px;">If you didn't request this code, you can safely ignore this email.</p>
        </div>
        <div style="background-color: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} SpendWise Student Edition</p>
        </div>
    </div>
    `
        };

        // Use unified service
        await sendEmail(mailOptions);


        res.json({ msg: 'OTP sent to email' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};


exports.signupInit = async (req, res) => {
    const { name, email, status, currency } = req.body;

    // Debug logging for production
    console.log('Signup request received:', { name, email, status, currency });

    if (!email) {
        console.log('Error: Email is required');
        return res.status(400).json({ msg: 'Email is required' });
    }

    if (!validator.validate(email)) {
        console.log('Error: Invalid email format:', email);
        return res.status(400).json({ msg: 'Invalid email address' });
    }

    try {
        let user = await User.findOne({ email });
        if (user) {
            console.log('Error: User already exists:', email);
            return res.status(400).json({ msg: 'User already exists. Please login.' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user = new User({
            name,
            email,
            status: status || 'student',
            currency: currency || 'INR',
            otp,
            otpExpires: Date.now() + 600000
        });

        await user.save();


        const mailOptions = {
            from: `"SpendWise Team" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Verify Your Email - SpendWise',
            html: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden;">
        <div style="background-color: #4f46e5; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 0.5px;">SpendWise</h1>
        </div>
        <div style="padding: 32px 24px;">
            <h2 style="color: #1e293b; font-size: 20px; margin-top: 0;">Welcome Aboard!</h2>
            <p style="color: #64748b; margin-bottom: 24px; font-size: 16px; line-height: 1.5;">Thanks for starting your journey with SpendWise. Please use the following One-Time Password (OTP) to verify your email address. This code is valid for 10 minutes.</p>
            <div style="background-color: #f1f5f9; padding: 16px; text-align: center; border-radius: 8px; margin: 24px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #4f46e5; display: block;">${otp}</span>
            </div>
            <p style="color: #94a3b8; font-size: 14px; margin-top: 24px;">If you didn't create an account, please ignore this email.</p>
        </div>
        <div style="background-color: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} SpendWise Student Edition</p>
        </div>
    </div>
    `
        };

        // Use unified service
        await sendEmail(mailOptions);

        res.json({ msg: 'OTP sent for verification', userId: user.id });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    // For signup verify, email is safer than userId passed from client

    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'User not found' });

        if (user.otp !== otp) return res.status(400).json({ msg: 'Invalid OTP' });
        if (user.otpExpires < Date.now()) return res.status(400).json({ msg: 'OTP Expired' });

        // Success
        user.otp = undefined;
        user.otpExpires = undefined;

        const { accessToken, refreshToken } = generateTokens(user.id);
        user.refreshToken = refreshToken;
        await user.save();

        res.json({ token: accessToken, user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// @route   GET api/auth/me
exports.loadUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-otp -otpExpires -refreshToken');
        if (!user) {            // If user deleted but token exists?
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('loadUser Error:', err);
        res.status(500).send('Server Error');
    }
};

exports.updateProfile = async (req, res) => {
    const { userId, name, college, status, currency, budget, onboardingComplete } = req.body;

    try {
        let user = await User.findById(userId);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.name = name || user.name;
        user.college = college || user.college;
        user.status = status || user.status;
        user.currency = currency || user.currency;
        user.budget = budget || user.budget;
        if (onboardingComplete !== undefined) user.onboardingComplete = onboardingComplete;

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
