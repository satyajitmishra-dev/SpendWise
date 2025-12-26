const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const validator = require('email-validator');
const { sendEmail } = require('../services/emailService');
const Account = require('../models/Account');
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');
const Loan = require('../models/Loan');
const Subscription = require('../models/Subscription');
const Notification = require('../models/Notification');
const admin = require('../config/firebase'); // Firebase Admin

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refreshsecret';




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


        const { accessToken, refreshToken } = generateTokens(user.id);
        user.refreshToken = refreshToken;
        await user.save();

        res.json({ token: accessToken, refreshToken, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};


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
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; -webkit-font-smoothing: antialiased; }
            .container { max-width: 500px; margin: 40px auto; background: #ffffff; border-radius: 24px; box-shadow: 0 10px 40px -10px rgba(0,0,0,0.1); overflow: hidden; border: 1px solid #f1f5f9; }
            .header { background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%); padding: 40px 0; text-align: center; position: relative; }
            .header::after { content: ''; position: absolute; bottom: -20px; left: 0; right: 0; height: 40px; background: #ffffff; border-radius: 24px 24px 0 0; }
            .logo { color: white; font-size: 28px; font-weight: 800; letter-spacing: -1px; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .content { padding: 40px 40px 60px; text-align: center; color: #334155; }
            .title { font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 16px; letter-spacing: -0.5px; }
            .text { font-size: 16px; line-height: 1.6; margin-bottom: 32px; color: #475569; }
            .otp-container { background: #f0fdf4; border: 2px dashed #86efac; border-radius: 16px; padding: 24px; margin: 0 auto 32px; display: inline-block; min-width: 200px; }
            .otp-code { font-size: 36px; font-weight: 800; color: #166534; letter-spacing: 8px; font-family: monospace; display: block; }
            .otp-label { display: block; font-size: 12px; font-weight: 600; color: #166534; text-transform: uppercase; letter-spacing: 1px; margin-top: 8px; }
            .warning { font-size: 13px; color: #94a3b8; background: #f8fafc; padding: 12px; border-radius: 8px; display: inline-block; }
            .footer { background: #ffffff; padding: 20px; text-align: center; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8; }
            .social-links { margin-bottom: 12px; }
            .social-link { display: inline-block; width: 32px; height: 32px; background: #f1f5f9; border-radius: 50%; padding: 6px; margin: 0 4px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 class="logo">SpendWise</h1>
            </div>
            <div class="content">
                <h2 class="title">Secure Login</h2>
                <p class="text">You requested a secure login to your SpendWise account. Use the code below to complete verification.</p>
                
                <div class="otp-container">
                    <span class="otp-code">${otp}</span>
                    <span class="otp-label">Verification Code</span>
                </div>

                <div class="warning">
                    Valid for 10 minutes • Do not share this code
                </div>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} SpendWise Student Edition. All rights reserved.</p>
                <p>Secure System Notification</p>
            </div>
        </div>
    </body>
    </html>
    `
        };
        mailOptions.text = `Secure Login\n\nCode: ${otp}\n\nValid for 10 minutes.`;
        await sendEmail(mailOptions);


        res.json({ msg: 'OTP sent to email' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};


exports.signupInit = async (req, res) => {
    const { name, email, status, currency } = req.body;



    if (!email) {

        return res.status(400).json({ msg: 'Email is required' });
    }

    if (!validator.validate(email)) {

        return res.status(400).json({ msg: 'Invalid email address' });
    }

    try {
        let user = await User.findOne({ email });
        if (user) {

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
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', sans-serif; }
            .container { max-width: 500px; margin: 40px auto; background: #ffffff; border-radius: 24px; box-shadow: 0 10px 40px -10px rgba(0,0,0,0.1); overflow: hidden; border: 1px solid #f1f5f9; }
            .header { background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); padding: 40px 0; text-align: center; position: relative; }
            .header::after { content: ''; position: absolute; bottom: -20px; left: 0; right: 0; height: 40px; background: #ffffff; border-radius: 24px 24px 0 0; }
            .logo { color: white; font-size: 28px; font-weight: 800; letter-spacing: -1px; margin: 0; }
            .content { padding: 40px 40px 60px; text-align: center; color: #334155; }
            .title { font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 16px; }
            .text { font-size: 16px; line-height: 1.6; margin-bottom: 32px; color: #475569; }
            .otp-container { background: #f5f3ff; border: 2px dashed #c4b5fd; border-radius: 16px; padding: 24px; margin: 0 auto 32px; display: inline-block; min-width: 200px; }
            .otp-code { font-size: 36px; font-weight: 800; color: #5b21b6; letter-spacing: 8px; font-family: monospace; display: block; }
            .otp-label { display: block; font-size: 12px; font-weight: 600; color: #5b21b6; text-transform: uppercase; letter-spacing: 1px; margin-top: 8px; }
            .footer { background: #ffffff; padding: 20px; text-align: center; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 class="logo">SpendWise</h1>
            </div>
            <div class="content">
                <h2 class="title">Verify Account</h2>
                <p class="text">Welcome to SpendWise! Please verify your email address to start your financial journey.</p>
                <div class="otp-container">
                    <span class="otp-code">${otp}</span>
                    <span class="otp-label">Activation Code</span>
                </div>
                <p style="font-size: 13px; color: #94a3b8;">Valid for 10 minutes</p>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} SpendWise
            </div>
        </div>
    </body>
    </html>
    `
        };
        mailOptions.text = `Welcome to SpendWise!\n\nVerify your account with this code:\n\nOTP: ${otp}\n\nValid for 10 minutes.`;
        await sendEmail(mailOptions);

        res.json({ msg: 'OTP sent for verification', userId: user.id });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.resendSignupOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: 'Email is required' });

    try {
        // Ensure lowercase comparison if desired, but for now exact match or similar
        // Ideally we should always lowercase emails on ingress. 
        // Let's assume user entered same email.
        let user = await User.findOne({ email });

        // If user not found, maybe they are trying to resend for an email that wasn't registered?
        if (!user) {
            return res.status(404).json({ msg: 'User not found. Please sign up first.' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 600000; // 10 mins
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
            <h2 style="color: #1e293b; font-size: 20px; margin-top: 0;">Resend Verification Code</h2>
            <p style="color: #64748b; margin-bottom: 24px; font-size: 16px; line-height: 1.5;">You requested to resend your verification code. Please use the following One-Time Password (OTP) to verify your email address. This code is valid for 10 minutes.</p>
            <div style="background-color: #f1f5f9; padding: 16px; text-align: center; border-radius: 8px; margin: 24px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #4f46e5; display: block;">${otp}</span>
            </div>
            <p style="color: #94a3b8; font-size: 14px; margin-top: 24px;">If you didn't request this code, please ignore this email.</p>
        </div>
            body { margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', sans-serif; }
            .container { max-width: 500px; margin: 40px auto; background: #ffffff; border-radius: 24px; box-shadow: 0 10px 40px -10px rgba(0,0,0,0.1); border: 1px solid #f1f5f9; overflow: hidden; }
            .header { background: linear-gradient(135deg, #0f172a 0%, #334155 100%); padding: 40px 0; text-align: center; position: relative; }
            .header::after { content: ''; position: absolute; bottom: -20px; left: 0; right: 0; height: 40px; background: #ffffff; border-radius: 24px 24px 0 0; }
            .logo { color: white; font-size: 28px; font-weight: 800; letter-spacing: -1px; margin: 0; }
            .content { padding: 40px 40px 60px; text-align: center; color: #334155; }
            .title { font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 16px; }
            .text { font-size: 16px; line-height: 1.6; margin-bottom: 32px; color: #475569; }
            .otp-container { background: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 16px; padding: 24px; margin: 0 auto 32px; display: inline-block; min-width: 200px; }
            .otp-code { font-size: 36px; font-weight: 800; color: #0f172a; letter-spacing: 8px; font-family: monospace; display: block; }
            .otp-label { display: block; font-size: 12px; font-weight: 600; color: #475569; text-transform: uppercase; letter-spacing: 1px; margin-top: 8px; }
            .footer { background: #ffffff; padding: 20px; text-align: center; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 class="logo">SpendWise</h1>
            </div>
            <div class="content">
                <h2 class="title">New Verification Code</h2>
                <p class="text">You requested a new verification code. Codes are valid for 10 minutes from request.</p>
                <div class="otp-container">
                    <span class="otp-code">${otp}</span>
                    <span class="otp-label">Verification Code</span>
                </div>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} SpendWise
            </div>
        </div>
    </body>
    </html>
    `
        };
        mailOptions.text = `New Verification Code\n\nOTP: ${otp}\n\nValid for 10 minutes.`;

        await sendEmail(mailOptions);
        res.json({ msg: 'OTP resent for verification' });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;


    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'User not found' });

        if (user.otp !== otp) return res.status(400).json({ msg: 'Invalid OTP' });
        if (user.otpExpires < Date.now()) return res.status(400).json({ msg: 'OTP Expired' });


        user.otp = undefined;
        user.otpExpires = undefined;

        const { accessToken, refreshToken } = generateTokens(user.id);
        user.refreshToken = refreshToken;
        await user.save();

        res.json({ token: accessToken, refreshToken, user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};


exports.loadUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-otp -otpExpires -refreshToken -passcode');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('loadUser Error:', err);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};

exports.updateProfile = async (req, res) => {
    const { userId, name, college, status, currency, budget, onboardingComplete, avatar } = req.body;

    try {
        let user = await User.findById(userId);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.name = name || user.name;
        user.college = college || user.college;
        user.status = status || user.status;
        user.currency = currency || user.currency;
        user.budget = budget || user.budget;
        if (onboardingComplete !== undefined) user.onboardingComplete = onboardingComplete;
        if (avatar !== undefined) user.avatar = avatar;

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.uploadAvatar = async (req, res) => {
    try {
        // req.file is available due to multer
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        // The URL is provided by cloudinary storage
        const avatarUrl = req.file.path;

        // Update user
        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.avatar = avatarUrl;
        await user.save();

        res.json({ avatar: avatarUrl, user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.deleteAvatar = async (req, res) => {
    try {
        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.avatar = ''; // Clear avatar
        await user.save();

        res.json({ avatar: '', user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.setPasscode = async (req, res) => {
    const { passcode } = req.body;
    // Passcode should be 4 or 6 digits
    if (!passcode || !/^\d{4,6}$/.test(passcode)) {
        return res.status(400).json({ msg: 'Invalid passcode format' });
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Simple hash (for production use bcrypt, but sticking to built-in crypto/simple approach if needed, 
        // strictly speaking we should use bcrypt for pins too effectively)
        // Let's reuse what we have or just store it. Wait, previously no password hashing shown?
        // Ah, this project uses OTP mostly. I will use simple comparison for MVP or better, just store it directly if user insists on 
        // "secure like...". But standard is hashing. I'll stick to direct storage for simplicity or a simple hash if I import crypto.
        // Actually, let's just use crypto from imports if available or just store it. 
        // Looking at imports: const crypto = require('crypto'); is there.
        // Let's use SHA256 for PIN.

        const hash = crypto.createHash('sha256').update(passcode).digest('hex');

        user.passcode = hash;
        user.passcodeLength = passcode.length;
        user.isPasscodeEnabled = true;
        await user.save();

        // Send Email Notification
        if (user.email) {
            const mailOptions = {
                from: `"SpendWise Security" <${process.env.EMAIL_USER}>`,
                to: user.email,
                subject: 'App Lock Enabled - SpendWise',
                html: `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
             body { margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', sans-serif; }
            .container { max-width: 500px; margin: 40px auto; background: #ffffff; border-radius: 24px; box-shadow: 0 10px 40px -10px rgba(0,0,0,0.1); border: 1px solid #f1f5f9; overflow: hidden; }
            .header { background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 40px 0; text-align: center; position: relative; }
            .header::after { content: ''; position: absolute; bottom: -20px; left: 0; right: 0; height: 40px; background: #ffffff; border-radius: 24px 24px 0 0; }
            .logo { color: white; font-size: 28px; font-weight: 800; letter-spacing: -1px; margin: 0; }
            .content { padding: 40px 40px 60px; text-align: center; color: #334155; }
            .title { font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 16px; }
            .text { font-size: 16px; line-height: 1.6; margin-bottom: 32px; color: #475569; }
            .box { background: #ecfdf5; border: 1px solid #6ee7b7; border-radius: 12px; padding: 20px; margin-bottom: 24px; color: #065f46; font-weight: 500; }
            .footer { background: #ffffff; padding: 20px; text-align: center; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 class="logo">SpendWise</h1>
            </div>
            <div class="content">
                <h2 class="title" style="color: #059669;">App Lock Enabled</h2>
                <p class="text">Your account is now secured with a PIN.</p>
                <div class="box">
                    ${passcode.length}-Digit PIN Active
                </div>
                <p style="font-size: 14px; color: #059669;"><strong>Tip:</strong> Change your passcode periodically.</p>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} SpendWise
            </div>
        </div>
    </body>
    </html>
                `
            };
            mailOptions.text = `App Lock Enabled\n\nYour account is now secured with a ${passcode.length}-digit PIN.`;


            try {
                await sendEmail(mailOptions);
            } catch (emailErr) {
                console.error("Failed to send passcode email", emailErr);
            }
        }

        res.json({ msg: 'Passcode updated successfully', isPasscodeEnabled: true, passcodeLength: passcode.length });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.verifyPasscode = async (req, res) => {
    const { passcode } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        if (!user.isPasscodeEnabled || !user.passcode) {
            return res.status(400).json({ msg: 'Passcode not enabled' });
        }

        const hash = crypto.createHash('sha256').update(passcode).digest('hex');
        if (user.passcode !== hash) {
            return res.status(400).json({ msg: 'Incorrect passcode' });
        }

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.disablePasscode = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.isPasscodeEnabled = false;
        user.passcode = undefined;
        await user.save();

        res.json({ msg: 'Passcode disabled', isPasscodeEnabled: false });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.forgotPasscode = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 600000; // 10 mins
        await user.save();

        // Send Email
        if (user.email) {
            const mailOptions = {
                from: `"SpendWise Security" <${process.env.EMAIL_USER}>`,
                to: user.email,
                subject: 'Reset App Lock - SpendWise',
                html: `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
             body { margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', sans-serif; }
            .container { max-width: 500px; margin: 40px auto; background: #ffffff; border-radius: 24px; box-shadow: 0 10px 40px -10px rgba(0,0,0,0.1); border: 1px solid #f1f5f9; overflow: hidden; }
            .header { background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%); padding: 40px 0; text-align: center; position: relative; }
            .header::after { content: ''; position: absolute; bottom: -20px; left: 0; right: 0; height: 40px; background: #ffffff; border-radius: 24px 24px 0 0; }
            .logo { color: white; font-size: 28px; font-weight: 800; letter-spacing: -1px; margin: 0; }
            .content { padding: 40px 40px 60px; text-align: center; color: #334155; }
            .title { font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 16px; }
            .text { font-size: 16px; line-height: 1.6; margin-bottom: 32px; color: #475569; }
            .otp-container { background: #fff7ed; border: 2px dashed #fdba74; border-radius: 16px; padding: 24px; margin: 0 auto 32px; display: inline-block; min-width: 200px; }
            .otp-code { font-size: 36px; font-weight: 800; color: #9a3412; letter-spacing: 8px; font-family: monospace; display: block; }
            .otp-label { display: block; font-size: 12px; font-weight: 600; color: #9a3412; text-transform: uppercase; letter-spacing: 1px; margin-top: 8px; }
            .footer { background: #ffffff; padding: 20px; text-align: center; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 class="logo">SpendWise</h1>
            </div>
            <div class="content">
                <h2 class="title">Reset Passcode</h2>
                <p class="text">We received a request to reset your App Lock. If this was you, use the code below.</p>
                <div class="otp-container">
                    <span class="otp-code">${otp}</span>
                    <span class="otp-label">Reset PIN</span>
                </div>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} SpendWise
            </div>
        </div>
    </body>
    </html>
                `
            };
            mailOptions.text = `Reset Passcode\n\nOTP: ${otp}`;

            await sendEmail(mailOptions);
            res.json({ msg: 'OTP sent to your email' });
        } else {
            // Should not happen for guests as they don't have passcode enabled usually, but safety:
            res.status(400).json({ msg: 'No email associated with this account' });
        }

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.resetPasscode = async (req, res) => {
    const { otp } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        if (user.otp !== otp) return res.status(400).json({ msg: 'Invalid OTP' });
        if (user.otpExpires < Date.now()) return res.status(400).json({ msg: 'OTP Expired' });

        // Reset Logic: Disable passcode
        user.otp = undefined;
        user.otpExpires = undefined;
        user.isPasscodeEnabled = false;
        user.passcode = undefined;
        await user.save();

        res.json({ msg: 'App Lock disabled successfully. You can set a new PIN in settings.', isPasscodeEnabled: false });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.resetDataInit = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 600000; // 10 mins
        await user.save();

        if (user.email) {
            const mailOptions = {
                from: `"SpendWise Security" <${process.env.EMAIL_USER}>`,
                to: user.email,
                subject: 'Confirm Data Reset - SpendWise',
                html: `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
             body { margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', sans-serif; }
            .container { max-width: 500px; margin: 40px auto; background: #ffffff; border-radius: 24px; box-shadow: 0 10px 40px -10px rgba(0,0,0,0.1); border: 1px solid #f1f5f9; overflow: hidden; }
            .header { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 40px 0; text-align: center; position: relative; }
            .header::after { content: ''; position: absolute; bottom: -20px; left: 0; right: 0; height: 40px; background: #ffffff; border-radius: 24px 24px 0 0; }
            .logo { color: white; font-size: 28px; font-weight: 800; letter-spacing: -1px; margin: 0; }
            .content { padding: 40px 40px 60px; text-align: center; color: #334155; }
            .title { font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 16px; }
            .text { font-size: 16px; line-height: 1.6; margin-bottom: 32px; color: #475569; }
            .warning { background: #fef2f2; color: #dc2626; padding: 16px; border-radius: 12px; font-size: 14px; font-weight: 600; margin-bottom: 24px; border: 1px solid #fee2e2; }
            .otp-container { background: #fef2f2; border: 2px dashed #fca5a5; border-radius: 16px; padding: 24px; margin: 0 auto 32px; display: inline-block; min-width: 200px; }
            .otp-code { font-size: 36px; font-weight: 800; color: #dc2626; letter-spacing: 8px; font-family: monospace; display: block; }
            .otp-label { display: block; font-size: 12px; font-weight: 600; color: #dc2626; text-transform: uppercase; letter-spacing: 1px; margin-top: 8px; }
            .footer { background: #ffffff; padding: 20px; text-align: center; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 class="logo">SpendWise</h1>
            </div>
            <div class="content">
                <h2 class="title" style="color: #dc2626;">Data Reset Request</h2>
                <div class="warning">
                    Warning: This action will permanently delete all your account data.
                </div>
                <p class="text">If you requested this full account reset, please use the confirmation code below.</p>
                <div class="otp-container">
                    <span class="otp-code">${otp}</span>
                    <span class="otp-label">Confirmation Code</span>
                </div>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} SpendWise
            </div>
        </div>
    </body>
    </html>
                `
            };
            mailOptions.text = `Confirm Data Reset\n\nYou have requested to reset all your account data. This action cannot be undone.\n\nUse the following OTP to confirm:\n\nOTP: ${otp}\n\nIf you did not request this, please change your password immediately.`;

            await sendEmail(mailOptions);
            res.json({ msg: 'Verification code sent to your email' });
        } else {
            res.status(400).json({ msg: 'No email associated with this account' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.resetDataConfirm = async (req, res) => {
    const { otp } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        if (user.otp !== otp) return res.status(400).json({ msg: 'Invalid OTP' });
        if (user.otpExpires < Date.now()) return res.status(400).json({ msg: 'OTP Expired' });

        // Clear OTP
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        // DELETE ALL DATA
        const userId = req.user.id;
        await Promise.all([
            Expense.deleteMany({ user: userId }),
            Account.deleteMany({ user: userId }),
            Budget.deleteMany({ user: userId }),
            Loan.deleteMany({ user: userId }),
            Subscription.deleteMany({ user: userId }),
            Notification.deleteMany({ user: userId })
        ]);

        // Reset User Profile for "Fresh Start"
        user.budget = 0;
        user.currency = 'INR';
        user.onboardingComplete = false;
        user.status = 'student'; // Default
        // user.college = undefined; // Optional: Keep college or reset? "Like new user" implies reset.
        await user.save();

        res.json({ msg: 'All account data has been reset successfully.' });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
        const user = await User.findById(decoded.user.id);

        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Check if the token matches the one in DB
        if (user.refreshToken !== refreshToken) {
            return res.status(401).json({ msg: 'Invalid refresh token' });
        }

        const tokens = generateTokens(user.id);
        user.refreshToken = tokens.refreshToken; // Rotate refresh token
        await user.save();

        res.json({ token: tokens.accessToken, refreshToken: tokens.refreshToken });
    } catch (err) {
        console.error('Refresh Token Error:', err.message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

exports.firebaseLogin = async (req, res) => {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ msg: 'No token provided' });

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, email, phone_number, name, picture } = decodedToken;

        console.log('Firebase Auth Verified:', { uid, email, phone: phone_number });

        // 1. Try to find user by firebaseUid
        let user = await User.findOne({ firebaseUid: uid });

        // 2. If not found, try by Email (Link account)
        if (!user && email) {
            user = await User.findOne({ email });
            if (user) {
                // Link Firebase UID to existing email account
                user.firebaseUid = uid;
                if (!user.avatar && picture) user.avatar = picture;
                await user.save();
            }
        }

        // 3. If not found, try by Phone (Link account)
        if (!user && phone_number) {
            user = await User.findOne({ phone: phone_number });
            if (user) {
                user.firebaseUid = uid;
                await user.save();
            }
        }

        // 4. Create New User if still not found
        if (!user) {
            user = new User({
                firebaseUid: uid,
                name: name || (phone_number ? 'Mobile User' : 'New User'),
                email: email, // might be undefined for phone auth
                phone: phone_number, // might be undefined for google auth
                avatar: picture,
                status: 'student',
                currency: 'INR', // Default
                onboardingComplete: false
            });
            await user.save();
        }

        // 5. Generate SpendWise Session Tokens
        const tokens = generateTokens(user.id);
        user.refreshToken = tokens.refreshToken;
        await user.save();

        res.json({ token: tokens.accessToken, refreshToken: tokens.refreshToken, user });

    } catch (err) {
        console.error('Firebase Login Error:', err);
        res.status(401).json({ msg: 'Invalid Firebase Token', error: err.message });
    }
};
