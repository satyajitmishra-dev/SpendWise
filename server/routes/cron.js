const express = require('express');
const router = express.Router();
const { triggerReminders } = require('../services/scheduler');

// Route to trigger reminders manually or via Vercel Cron
// Protected by a simple secret to prevent abuse
router.get('/reminders', async (req, res) => {
    // Check for Authorization header from Vercel Cron or a manual secret
    const authHeader = req.headers['authorization'];
    const secretQuery = req.query.key;

    // Validate: Either Vercel's automatic header or our manual CRON_SECRET
    const isVercelCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
    const isManualValid = secretQuery === process.env.CRON_SECRET;

    if (process.env.NODE_ENV === 'production' && !isVercelCron && !isManualValid) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        console.log('Triggering reminders via API...');
        await triggerReminders(req, res);
    } catch (error) {
        console.error('Cron Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
