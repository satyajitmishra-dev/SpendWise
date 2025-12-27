const { sendEmail } = require('../services/emailService');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.contactSupport = async (req, res) => {
    try {
        const { type, message, attachment, email } = req.body;

        let userData = {
            name: 'Guest User',
            email: email,
            id: 'n/a'
        };

        // 1. Try to get user from token manually (since we removed strict auth middleware)
        const token = req.header('x-auth-token');
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
                const user = await User.findById(decoded.user.id).select('name email');
                if (user) {
                    userData = {
                        name: user.name,
                        email: user.email,
                        id: user._id
                    };
                }
            } catch (err) {
                // Token invalid/expired - treat as guest, but ensure we have an email
                console.log("Support: Invalid token, processing as guest");
            }
        }

        // 2. Validation: We MUST have an email either from DB or Body
        if (!userData.email) {
            return res.status(400).json({ msg: 'Email address is required for support requests.' });
        }

        if (!type || !message) {
            return res.status(400).json({ msg: 'Please provide issue type and description.' });
        }

        // Prepare attachments if present
        let attachments = [];
        if (attachment) {
            // attachment is expected to be { name: "filename.png", data: "base64string..." }
            // Remove header if present (e.g. "data:image/png;base64,")
            const base64Content = attachment.data.split(',')[1] || attachment.data;

            attachments.push({
                content: base64Content,
                filename: attachment.name,
                type: 'image/png', // Valid for SendGrid
                disposition: 'attachment',
                encoding: 'base64' // Valid for Nodemailer
            });
        }

        // 1. Email to Support Team (Admin)
        const supportEmailOptions = {
            from: `"SpendWise Help" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Send to self/support team
            replyTo: userData.email, // Allow admin to reply directly to user
            subject: `[Support] ${type} - ${userData.name}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #4f46e5;">New Support Request</h2>
                    <p><strong>User:</strong> ${userData.name} (<a href="mailto:${userData.email}">${userData.email}</a>)</p>
                    <p><strong>User ID:</strong> ${userData.id}</p>
                    <p><strong>Issue Type:</strong> <span style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px;">${type}</span></p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <h3 style="color: #374151;">Message:</h3>
                    <p style="white-space: pre-wrap; color: #4b5563; background: #f9fafb; padding: 15px; border-radius: 8px;">${message}</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #9ca3af;">Sent via SpendWise App • ${new Date().toLocaleString()}</p>
                </div>
            `,
            text: `New Support Request\n\nUser: ${userData.name} (${userData.email})\nUser ID: ${userData.id}\nIssue Type: ${type}\n\nMessage:\n${message}\n\nReply to user: ${userData.email}\n\nSent via SpendWise App • ${new Date().toLocaleString()}`,
            attachments: attachments
        };
        await sendEmail(supportEmailOptions);

        // Mock Ticket ID
        const ticketId = '#SW-' + Math.floor(1000 + Math.random() * 9000);

        // 2. Auto-Reply Confirmation Email to User
        const confirmationEmailOptions = {
            from: `"SpendWise Support" <${process.env.EMAIL_USER}>`,
            to: userData.email,
            subject: `Request Received: ${type} (${ticketId})`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #10b981;">Request Received</h2>
                    <p>Hi ${userData.name},</p>
                    <p>Thanks for contacting SpendWise Support. We have received your request regarding <strong>${type}</strong>.</p>
                    <p>Our team will review your message and get back to you within 24 hours.</p>
                    <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0; font-weight: bold; color: #374151;">Ticket ID: ${ticketId}</p>
                    </div>
                    <p style="color: #6b7280; font-size: 14px;">If you have any additional information, you can reply directly to this email.</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #9ca3af;">SpendWise Support Team</p>
                </div>
            `,
            text: `Request Received (${ticketId})\n\nHi ${userData.name},\n\nThanks for contacting SpendWise Support. We have received your request regarding "${type}".\n\nOur team will review your message and get back to you within 24 hours.\n\nTicket ID: ${ticketId}\n\nSpendWise Support Team`
        };

        // Send confirmation asynchronously (fire and forget) so user doesn't wait
        sendEmail(confirmationEmailOptions).catch(err => console.error("Failed to send confirmation email:", err));

        res.json({ msg: 'Support request sent successfully', ticketId });

    } catch (err) {
        console.error('Support Error:', err);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};
