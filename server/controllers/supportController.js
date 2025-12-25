const { sendEmail } = require('../services/emailService');
const User = require('../models/User');

exports.contactSupport = async (req, res) => {
    try {
        const { type, message, attachment } = req.body;
        const userId = req.user.id;

        // Fetch user details for context
        const user = await User.findById(userId).select('name email');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
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

        // Email to Support Team
        const supportEmailOptions = {
            from: `"SpendWise Support System" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Send to self/support team
            replyTo: user.email, // Allow admin to reply directly to user
            subject: `[Support Ticket] ${type} - ${user.name}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #4f46e5;">New Support Request</h2>
                    <p><strong>User:</strong> ${user.name} (${user.email})</p>
                    <p><strong>User ID:</strong> ${userId}</p>
                    <p><strong>Issue Type:</strong> <span style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px;">${type}</span></p>
                    <p><a href="mailto:${user.email}?subject=Re: Support Ticket ${type}" style="color: #4f46e5; text-decoration: none; font-weight: bold;">Reply to User</a></p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <h3 style="color: #374151;">Message:</h3>
                    <p style="white-space: pre-wrap; color: #4b5563; background: #f9fafb; padding: 15px; border-radius: 8px;">${message}</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #9ca3af;">Sent via SpendWise App • ${new Date().toLocaleString()}</p>
                </div>
            `,
            text: `New Support Request\n\nUser: ${user.name} (${user.email})\nUser ID: ${userId}\nIssue Type: ${type}\n\nMessage:\n${message}\n\nReply to user: ${user.email}\n\nSent via SpendWise App • ${new Date().toLocaleString()}`,
            attachments: attachments
        };

        await sendEmail(supportEmailOptions);

        // Verification Email to User (Optional, but requested UX "Reply within 24h")
        // We actually just send a success 200 OK for now, user sees success screen.
        // If we want to send an auto-reply, we can do it here.
        // For now, let's stick to the core requirement: "make sure mail is sending" (to support).

        // Mock Ticket ID
        const ticketId = '#SW-' + Math.floor(1000 + Math.random() * 9000);

        res.json({ msg: 'Support request sent successfully', ticketId });

    } catch (err) {
        console.error('Support Error:', err);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};
