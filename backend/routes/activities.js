// routes/activities.js
const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');

// Get user activity feed
router.get('/feed', auth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // Get activities from users that the current user follows
        const activities = await Activity.find({
            $or: [
                { user: req.user._id },
                { privacy: 'public' },
                {
                    privacy: 'friends',
                    user: { $in: req.user.following } // This would need population first
                }
            ]
        })
            .populate('user', 'username avatar')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Activity.countDocuments({
            $or: [
                { user: req.user._id },
                { privacy: 'public' },
                {
                    privacy: 'friends',
                    user: { $in: req.user.following }
                }
            ]
        });

        res.json({
            activities,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get activities for a specific user
router.get('/user/:userId', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const activities = await Activity.find({
            user: req.params.userId,
            privacy: { $in: ['public', 'friends'] }
        })
            .populate('user', 'username avatar')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Activity.countDocuments({
            user: req.params.userId,
            privacy: { $in: ['public', 'friends'] }
        });

        res.json({
            activities,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;