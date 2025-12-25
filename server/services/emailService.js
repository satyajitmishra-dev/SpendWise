const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');


const USE_SENDGRID = process.env.NODE_ENV === 'production' && process.env.SENDGRID_API_KEY;


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

        const msg = {
            to: mailOptions.to,
            from: process.env.SENDGRID_FROM_EMAIL || mailOptions.from,
            subject: mailOptions.subject,
            html: mailOptions.html,
            attachments: mailOptions.attachments, // Pass attachments array { content, filename, type, disposition }
        };
        return await sgMail.send(msg);
    } else {

        return await transporter.sendMail(mailOptions);
    }
}

module.exports = { sendEmail };
