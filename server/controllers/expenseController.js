const Expense = require('../models/Expense');
const mongoose = require('mongoose');
const { createNotification } = require('./notificationController');
const Budget = require('../models/Budget');
const User = require('../models/User');
const { sendEmail } = require('../services/emailService');

exports.getExpenses = async (req, res) => {
    try {

        const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });

        res.json(expenses);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};

exports.addExpense = async (req, res) => {
    let { amount, category, note, date, accountId, type = 'expense' } = req.body;

    // Validate accountId (handle guest/local IDs)
    if (accountId && !mongoose.Types.ObjectId.isValid(accountId)) {
        console.warn(`Invalid Account ID: ${accountId} - stripping from expense.`);
        accountId = null;
    }


    // Start a transaction or just do sequential updates (No transaction for simple MVP)
    try {
        // If accountId is provided, update account balance
        if (accountId) {
            const Account = require('../models/Account'); // Lazy import to avoid circular dependency if any
            const account = await Account.findById(accountId);

            if (!account) {
                return res.status(404).json({ msg: 'Account not found' });
            }

            // Verify ownership
            if (account.userId.toString() !== req.user.id) {
                return res.status(401).json({ msg: 'Unauthorized access to account' });
            }

            if (type === 'income') {
                account.balance += amount;
            } else {
                account.balance -= amount;
            }
            await account.save();
        }

        const newExpense = new Expense({
            userId: req.user.id,
            amount,
            category,
            note,
            date,
            accountId,
            type
        });

        const expense = await newExpense.save();

        // Trigger Notification
        await createNotification(
            req.user.id,
            'Transaction Added',
            `You added a ${type} of ${amount} for ${category}.`,
            'success'
        );

        // Check for Budget Alerts (Async - don't block response)
        checkBudgetAlerts(req.user.id, expense).catch(err => console.error("Budget Alert Error:", err));

        res.json(expense);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};

exports.updateExpense = async (req, res) => {
    try {
        let expense = await Expense.findById(req.params.id);
        if (!expense) return res.status(404).json({ msg: 'Expense not found' });

        if (expense.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const Account = require('../models/Account');

        // 1. Revert Old Balance Impact
        if (expense.accountId) {
            const oldAccount = await Account.findById(expense.accountId);
            if (oldAccount) {
                if (expense.type === 'income') oldAccount.balance -= expense.amount;
                else oldAccount.balance += expense.amount;
                await oldAccount.save();
            }
        }

        // 2. Prepare New Values
        let { amount, accountId, type } = req.body;

        // Validate new accountId
        if (accountId !== undefined && accountId !== null && !mongoose.Types.ObjectId.isValid(accountId)) {
            console.warn(`Invalid Account ID in update: ${accountId} - ignoring.`);
            accountId = null;
        }

        const newAmount = amount !== undefined ? Number(amount) : expense.amount;
        const newAccountId = accountId !== undefined ? accountId : expense.accountId;
        const newType = type !== undefined ? type : expense.type;

        // 3. Apply New Balance Impact
        if (newAccountId) {
            const newAccount = await Account.findById(newAccountId);
            if (newAccount) {
                if (newType === 'income') newAccount.balance += newAmount;
                else newAccount.balance -= newAmount;
                await newAccount.save();
            }
        }

        // Update body with validated accountId if it changed
        const updateBody = { ...req.body };
        if (accountId === null) updateBody.accountId = null;

        expense = await Expense.findByIdAndUpdate(req.params.id, { $set: updateBody }, { new: true });

        // Check for Budget Alerts
        checkBudgetAlerts(req.user.id, expense).catch(err => console.error("Budget Alert Error:", err));

        res.json(expense);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ msg: 'Expense not found' });
        }

        if (expense.userId.toString() !== req.user.id.toString()) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // Revert Account Balance
        if (expense.accountId) {
            const Account = require('../models/Account');
            const account = await Account.findById(expense.accountId);

            if (account) {
                if (expense.type === 'income') {
                    account.balance -= expense.amount;
                } else {
                    account.balance += expense.amount;
                }
                await account.save();
            }
        }

        await expense.deleteOne();

        await createNotification(
            req.user.id,
            'Transaction Removed',
            'You removed a transaction record.',
            'info'
        );

        res.json({ msg: 'Expense removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};

exports.syncExpenses = async (req, res) => {
    const { expenses } = req.body;
    if (!expenses || !Array.isArray(expenses)) {
        return res.status(400).json({ msg: 'Expenses array is required' });
    }

    try {
        const newExpenses = expenses.map(exp => {
            // Validate accountId is a real ObjectId
            const isValidAccount = exp.accountId && mongoose.Types.ObjectId.isValid(exp.accountId);

            return {
                userId: req.user.id,
                amount: exp.amount,
                category: exp.category,
                note: exp.note,
                date: exp.date,
                accountId: isValidAccount ? exp.accountId : null, // Strip invalid IDs
                type: exp.type || 'expense'
            };
        });

        if (newExpenses.length > 0) {
            await Expense.insertMany(newExpenses);
        }


        res.json({ msg: 'Sync successful', count: newExpenses.length });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};

exports.getExpenseStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        // 1. Monthly Trend (Last 6 Months)
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

        const monthlyStats = await Expense.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    date: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$date" },
                        year: { $year: "$date" }
                    },
                    total: { $sum: "$amount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Format for frontend
        const formatMonth = (m, y) => new Date(y, m - 1).toLocaleString('default', { month: 'short' });

        // Fill in missing months
        const trendData = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const month = d.getMonth() + 1;
            const year = d.getFullYear();

            const found = monthlyStats.find(s => s._id.month === month && s._id.year === year);
            trendData.push({
                name: formatMonth(month, year),
                amount: found ? found.total : 0
            });
        }

        // 2. Category Breakdown (Current Month)
        const startOfMonth = new Date(currentYear, currentMonth, 1);
        const endOfMonth = new Date(currentYear, currentMonth + 1, 0);

        const categoryStats = await Expense.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    date: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            {
                $group: {
                    _id: "$category",
                    value: { $sum: "$amount" }
                }
            }
        ]);

        const categoryData = categoryStats.map(s => ({
            name: s._id,
            value: s.value
        }));

        res.json({ trend: trendData, category: categoryData });
    } catch (err) {
        console.error('Stats Error:', err.message);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};

/**
 * Helper: Check if budget is exceeded > 90% and send email
 */
const checkBudgetAlerts = async (userId, expense) => {
    try {
        console.log(`Checking budget alerts for user ${userId}, category: ${expense.category}, amount: ${expense.amount}`);
        if (expense.type !== 'expense') return; // Only track expenses

        // 1. Find User (for email)
        const user = await User.findById(userId);
        if (!user || !user.email) return;

        const expenseDate = new Date(expense.date);

        // 2. Find Relevant Budgets (Category match OR Overall)
        // Active budgets that cover this expense date
        const budgets = await Budget.find({
            userId: userId,
            $or: [{ category: expense.category }, { category: 'Monthly Budget' }],
            startDate: { $lte: expenseDate },
            endDate: { $gte: expenseDate }
        });

        if (!budgets || budgets.length === 0) return;

        // 3. For each budget, calculate total spent
        for (const budget of budgets) {
            // Aggregate expenses in this budget's period and category (if specific)
            // If budget is 'Monthly Budget' (Overall), we sum ALL expenses in that period.
            // If budget is category specific, we sum only that category.

            const matchQuery = {
                userId: new mongoose.Types.ObjectId(userId),
                date: { $gte: new Date(budget.startDate), $lte: new Date(budget.endDate) },
                type: 'expense'
            };

            if (budget.category !== 'Monthly Budget') {
                matchQuery.category = budget.category;
            }

            const stats = await Expense.aggregate([
                { $match: matchQuery },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]);

            const totalSpent = stats.length > 0 ? stats[0].total : 0;
            const percentage = (totalSpent / budget.amount) * 100;

            // 4. Check Threshold (90%)
            if (percentage >= 90) {
                console.log(`Budget Alert Triggered: ${budget.category} is at ${percentage.toFixed(1)}%`);

                // Send Email
                const isOver = totalSpent > budget.amount;
                const subject = isOver
                    ? `🚨 Budget Exceeded: ${budget.category}`
                    : `⚠️ Budget Alert: ${budget.category} is ${percentage.toFixed(0)}% used`;

                const mailOptions = {
                    from: `"SpendWise Alert" <${process.env.EMAIL_USER}>`,
                    to: user.email,
                    subject: subject,
                    html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="utf-8">
                        <style>
                            body { font-family: 'Segoe UI', sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
                            .container { background-color: #ffffff; max-width: 500px; margin: 40px auto; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; }
                            .header { background-color: ${isOver ? '#ef4444' : '#f59e0b'}; padding: 30px 20px; text-align: center; color: white; }
                            .content { padding: 30px; color: #334155; }
                            .stat-box { background: #f1f5f9; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0; }
                            .big-number { font-size: 32px; font-weight: 800; color: #0f172a; display: block; }
                            .label { font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: 600; }
                            .footer { text-align: center; padding: 20px; color: #94a3b8; font-size: 12px; border-top: 1px solid #f1f5f9; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1 style="margin:0; font-size: 24px;">${isOver ? 'Budget Exceeded!' : 'Almost Full!'}</h1>
                            </div>
                            <div class="content">
                                <p style="font-size: 16px; line-height: 1.6;">
                                    Hello <strong>${user.name}</strong>,<br><br>
                                    You've used <strong>${percentage.toFixed(0)}%</strong> of your <strong>${budget.category}</strong> budget.
                                </p>
                                
                                <div class="stat-box">
                                    <span class="label">Total Spent</span>
                                    <span class="big-number">${user.currency === 'USD' ? '$' : '₹'}${totalSpent.toLocaleString()}</span>
                                    <span style="font-size: 14px; color: #64748b;">of ${user.currency === 'USD' ? '$' : '₹'}${budget.amount.toLocaleString()} limit</span>
                                </div>

                                <p style="font-size: 14px; color: #64748b; text-align: center;">
                                    ${isOver ? 'You have crossed your limit. Time to review your spending!' : 'Slow down! You are getting close to your limit.'}
                                </p>
                            </div>
                            <div class="footer">
                                SpendWise Smart Alerts
                            </div>
                        </div>
                    </body>
                    </html>
                    `
                };

                await sendEmail(mailOptions);
                console.log("Budget Alert Email Sent");
            }
        }
    } catch (err) {
        console.error("Error in checkBudgetAlerts:", err); // Non-blocking
    }
};
