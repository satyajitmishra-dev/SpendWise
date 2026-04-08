const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');


const USE_SENDGRID = !!process.env.SENDGRID_API_KEY;


if (USE_SENDGRID) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verify connection configuration
if (!USE_SENDGRID) {
    transporter.verify(function (error, success) {
        if (error) {
            console.error("Email Service Error: Connection failed", error);
        } else {
            console.log("Email Service: Server is ready to take our messages");
        }
    });
}

/**
 * Send email using SendGrid (production) or Nodemailer (development)
 * @param {Object} mailOptions - Email configuration
 * @param {string} mailOptions.from - Sender email
 * @param {string} mailOptions.to - Recipient email
 * @param {string} mailOptions.subject - Email subject
 * @param {string} mailOptions.html - HTML content
 */
async function sendEmail(mailOptions) {
    if (USE_SENDGRID) {
        if (!process.env.SENDGRID_API_KEY) {
            console.warn('SendGrid API Key missing. Skipping email.');
            return;
        }
        try {
            const msg = {
                to: mailOptions.to,
                from: process.env.SENDGRID_FROM_EMAIL || mailOptions.from,
                subject: mailOptions.subject,
                replyTo: mailOptions.replyTo || process.env.EMAIL_REPLY_TO,
                text: mailOptions.text,
                html: mailOptions.html,
                attachments: mailOptions.attachments,
            };
            return await sgMail.send(msg);
        } catch (error) {
            console.error('SendGrid Error:', error.response ? error.response.body : error);
            // Fallback? Or just log.
        }
    } else {
        if (!transporter) {
            console.warn('Nodemailer transporter not ready. Skipping email.');
            return;
        }
        return await transporter.sendMail(mailOptions);
    }
}

module.exports = { sendEmail };
