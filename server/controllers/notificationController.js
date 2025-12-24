const Notification = require('../models/Notification');

// Get all notifications for the user
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .limit(50); // Limit to last 50 notifications
        res.json(notifications);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};

// Get unread count
exports.getUnreadCount = async (req, res) => {
    try {
        const count = await Notification.countDocuments({ user: req.user.id, isRead: false });
        res.json({ count });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        // If id is 'all', mark all as read
        if (id === 'all') {
            await Notification.updateMany(
                { user: req.user.id, isRead: false },
                { $set: { isRead: true } }
            );
            return res.json({ msg: 'All notifications marked as read' });
        }

        let notification = await Notification.findById(id);

        if (!notification) return res.status(404).json({ msg: 'Notification not found' });

        // Make sure user owns notification
        if (notification.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        notification = await Notification.findByIdAndUpdate(
            id,
            { $set: { isRead: true } },
            { new: true }
        );

        res.json(notification);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Internal helper to create notification
exports.createNotification = async (userId, title, message, type = 'info') => {
    try {
        const newNotification = new Notification({
            user: userId,
            title,
            message,
            type
        });
        await newNotification.save();
        return newNotification;
    } catch (err) {
        console.error('Error creating notification:', err);
    }
};
