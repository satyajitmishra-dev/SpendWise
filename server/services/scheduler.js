const cron = require('node-cron');
// const nodemailer = require('nodemailer'); // Removed
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Loan = require('../models/Loan');
const { sendEmail } = require('./emailService');

// Email Transporter (Moved to emailService.js)
// ...

const triggerEmail = async (to, subject, html) => {
    try {
        await sendEmail({
            from: `"SpendWise Reminders" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        });
    } catch (error) {
        console.error(`Failed to send email to ${to}`, error);
    }
};

const checkSubscriptions = async () => {
    try {
        const users = await User.find({ email: { $exists: true, $ne: null } });

        for (const user of users) {
            const subscriptions = await Subscription.find({ userId: user._id, status: 'active' });

            // Simple check: Is today 3 days before due date?

            const today = new Date();
            const currentDay = today.getDate();
            const threeDaysFromNow = currentDay + 3;

            const upcomingSubs = subscriptions.filter(sub => {
                const dueDay = parseInt(sub.date || sub.dueDate); // Handling variations in field name
                // If dueDay is close (simple logic, ignoring month rollover for MVP)
                return dueDay === threeDaysFromNow;
            });

            if (upcomingSubs.length > 0) {
                const list = upcomingSubs.map(s => `<li><strong>${s.name}</strong>: ₹${s.amount} due on day ${s.date}</li>`).join('');
                await triggerEmail(
                    user.email,
                    'Upcoming Subscription Renewals',
                    `<h3>Hi ${user.name},</h3><p>The following subscriptions are renewing in 3 days:</p><ul>${list}</ul>`
                );
            }
        }
    } catch (err) {
        console.error('Subscription Check Error:', err);
    }
};

const checkLoans = async () => {
    try {
        const users = await User.find({ email: { $exists: true, $ne: null } });

        for (const user of users) {
            // Find pending loans where I OWE money (Payable) check created date > 30 days?
            // Or just remind about all pending loans every month?
            // Let's remind if "Payable" and status "pending".
            const loans = await Loan.find({ userId: user._id, type: 'payable', status: 'pending' });

            if (loans.length > 0) {
                const list = loans.map(l => `<li><strong>${l.name}</strong>: ₹${l.amount} (Pending)</li>`).join('');
                // Spam prevention: Could limit frequency here
                // For demo purposes, we allow manual triggers
            }
        }
    } catch (err) {
        console.error('Loan Check Error:', err);
    }
}

// Public function to trigger manual check
exports.triggerReminders = async (req, res) => {

    await checkSubscriptions();
    // await checkLoans();
    res.json({ msg: 'Reminders processed' });
}

exports.initScheduler = () => {
    // Run every day at 09:00 AM
    cron.schedule('0 9 * * *', () => {
        console.log('Running Daily Cron Job...');
        checkSubscriptions();
    });
    console.log('Scheduler Initialized: Jobs scheduled for 09:00 AM');
};
