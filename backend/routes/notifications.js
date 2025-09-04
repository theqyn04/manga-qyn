// routes/notifications.js
const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const passport = require('passport');

// GET user notifications
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { page = 1, limit = 20, unreadOnly = false } = req.query;

        const query = { user: req.user._id };
        if (unreadOnly) {
            query.isRead = false;
        }

        const notifications = await Notification.find(query)
            .populate('manga', 'title coverImage')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Notification.countDocuments(query);
        const unreadCount = await Notification.countDocuments({
            user: req.user._id,
            isRead: false
        });

        res.json({
            notifications,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total,
            unreadCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT mark as read
router.put('/:id/read', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT mark all as read
router.put('/read-all', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        await Notification.updateMany(
            { user: req.user._id, isRead: false },
            { isRead: true }
        );

        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE notification
router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.json({ message: 'Notification deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET notification stats
router.get('/stats', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const unreadCount = await Notification.countDocuments({
            user: req.user._id,
            isRead: false
        });

        const totalCount = await Notification.countDocuments({
            user: req.user._id
        });

        res.json({ unreadCount, totalCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;