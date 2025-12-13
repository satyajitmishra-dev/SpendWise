const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refreshsecret';

// Configure Nodemailer (Gmail)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Helper to generate tokens
const generateTokens = (userId) => {
    const accessToken = jwt.sign({ user: { id: userId } }, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ user: { id: userId } }, REFRESH_SECRET, { expiresIn: '7d' });
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
exports.sendOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: 'Email is required' });

    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        // In real app: Hash OTP before saving
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins

        let user = await User.findOne({ email });

        // If Requesting Login but no user exists
        if (!user && req.path.includes('login')) {
            // Optional: prevent user enumeration by sending fake success
            // For this app, strict separation:
            return res.status(404).json({ msg: 'User not found. Please sign up.' });
        }

        // Handle Signup case implicitly or explicitly properties
        if (!user) {
            // Temporary placeholder for potential new user logic if verified later
            // For now, we just store OTP potentially in a separate 'pending' collection 
            // OR we create a temporary user document. 
            // BETTER: For this simple app, we don't save OTP on user if user doesn't exist yet.
            // We can return success and verify simply against a separate store or create user provisionally.
            // SIMPLEST: Create user on first OTP request? No, that spams DB.

            // DECISION: We will handle logic in verify. For send, just pretend or email.
            // But we need to save OTP somewhere. 
            // Let's create a temporary record or use the 'User' model but mark as 'unverified'.
            // For simplicity in this project: We will create the user on 'verify' if signup,
            // so here we need a way to store OTP. 
            // Let's use a "PreAuth" model or just send OTP if user exists.
            // User requested: "Signup Page" vs "Login Page".
            // Let's create user if not exists but sparse email? 
            // NO, let's treat send-otp as generic.
        }

        // Re-using User model for simplicity. 
        // If user doesn't exist, we can't save OTP on them.
        // Let's upsert? 
        if (!user) {
            // If signup, we don't have a user yet.
            // We'll create a lightweight record?? 
            // Actually, let's just create a standard user with 'incomplete' flag?
            // Or simpler: The requester sends name/details with Signup? 
            // The prompt implies: Signup Page -> Enter Details -> OTP.
            // So we likely created the user record Step 1? 
            // Let's assume Signup = Create User (Pending) -> Verify.

            // NEW FLOW: 
            // Signup: POST /api/auth/signup-init { email, name ... } -> Sends OTP, Saves User (verified: false)
            // Verify: POST /api/auth/verify -> Sets verified: true

            // Login: POST /api/auth/send-otp { email } -> Finds User -> Sends OTP.

            // But to reuse 'sendOtp', let's stick to: 
            // If user exists, update OTP.
            // If user doesn't exist AND it's a login attempt, error.
            // If it's a signup attempt, the user creation should handle generating OTP?
        }

        // Let's implement specific controllers for clarity
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// SIMPLIFIED APPROACH:
// 1. sendOtp: Just updates OTP on existing user (Login)
// 2. signupInit: Creates user + sends OTP (Signup)
// 3. verifyOtp: Checks OTP, clears it, issues tokens

exports.loginSendOtp = async (req, res) => {
    const { email } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 600000; // 10 mins
        await user.save();

        console.log(`LOGIN OTP for ${email}: ${otp}`); // For Dev


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

        await transporter.sendMail(mailOptions);


        res.json({ msg: 'OTP sent to email' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};


exports.signupInit = async (req, res) => {
    const { name, email, status, currency } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists. Please login.' });

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
        console.log(`SIGNUP OTP for ${email}: ${otp}`); // For Dev

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

        await transporter.sendMail(mailOptions);

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
        // user.onboardingComplete = true; // REMOVED: Let user complete profile first

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
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.updateProfile = async (req, res) => {
    // ... existing logic but perhaps protected logic ...
    // Keeping existing function for now to not break guest flow immediately
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
