const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getNotifications, getUnreadCount, markAsRead } = require('../controllers/notificationController');

router.get('/', auth, getNotifications);
router.get('/unread-count', auth, getUnreadCount);
router.put('/read/:id', auth, markAsRead);

module.exports = router;
