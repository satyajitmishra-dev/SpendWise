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


        await sendEmail(mailOptions);

        res.json({ msg: 'OTP sent for verification', userId: user.id });
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
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden;">
                        <div style="background-color: #4f46e5; padding: 24px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">SpendWise</h1>
                        </div>
                        <div style="padding: 32px 24px;">
                            <h2 style="color: #1e293b; font-size: 20px; margin-top: 0;">App Lock Enabled</h2>
                            <p style="color: #64748b; margin-bottom: 24px; font-size: 16px; line-height: 1.5;">You have successfully enabled App Lock with a ${passcode.length}-digit PIN. This PIN will be required to access the app.</p>
                            <div style="background-color: #fff1f2; border-left: 4px solid #e11d48; padding: 16px; margin: 24px 0; border-radius: 4px;">
                                <p style="color: #9f1239; font-size: 14px; margin: 0;"><strong>Security Note:</strong> It is recommended to change your passcode every 24 hours.</p>
                            </div>
                            <p style="color: #94a3b8; font-size: 14px; margin-top: 24px;">If you did not make this change, please contact support immediately.</p>
                        </div>
                    </div>
                `
            };
            // Fire and forget email to not block response? Or await? Await is safer for feedback but slower.
            // Let's await but catch error so we don't fail the request if email fails.
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
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden;">
                        <div style="background-color: #4f46e5; padding: 24px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">SpendWise</h1>
                        </div>
                        <div style="padding: 32px 24px;">
                            <h2 style="color: #1e293b; font-size: 20px; margin-top: 0;">Reset App Lock</h2>
                            <p style="color: #64748b; margin-bottom: 24px; font-size: 16px; line-height: 1.5;">Use the following OTP to reset your App Lock PIN:</p>
                            <div style="background-color: #f1f5f9; padding: 16px; text-align: center; border-radius: 8px; margin: 24px 0;">
                                <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #4f46e5; display: block;">${otp}</span>
                            </div>
                            <p style="color: #94a3b8; font-size: 14px; margin-top: 24px;">If you didn't request this, you can ignore this email.</p>
                        </div>
                    </div>
                `
            };
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
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden;">
                        <div style="background-color: #ef4444; padding: 24px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">SpendWise</h1>
                        </div>
                        <div style="padding: 32px 24px;">
                            <h2 style="color: #1e293b; font-size: 20px; margin-top: 0;">Confirm Data Reset</h2>
                            <p style="color: #64748b; margin-bottom: 24px; font-size: 16px; line-height: 1.5;">You have requested to reset all your account data. <strong>This action cannot be undone.</strong></p>
                            <p style="color: #64748b; margin-bottom: 16px; font-size: 16px;">Use the following OTP to confirm:</p>
                            <div style="background-color: #fee2e2; padding: 16px; text-align: center; border-radius: 8px; margin: 24px 0;">
                                <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #ef4444; display: block;">${otp}</span>
                            </div>
                            <p style="color: #94a3b8; font-size: 14px; margin-top: 24px;">If you did not request this, please change your password immediately.</p>
                        </div>
                    </div>
                `
            };
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
