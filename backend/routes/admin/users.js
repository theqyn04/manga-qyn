// backend/routes/admin/users.js
const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const auth = require('../../middleware/auth');
const requireAdmin = require('../../middleware/admin');

// Get all users with filtering
router.get('/users', auth, requireAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const filter = {};

        // Filter by role
        if (req.query.role) {
            filter.role = req.query.role;
        }

        // Filter by status
        if (req.query.status) {
            filter.status = req.query.status;
        }

        // Search by username or email
        if (req.query.search) {
            filter.$or = [
                { username: { $regex: req.query.search, $options: 'i' } },
                { email: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        const users = await User.find(filter)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments(filter);

        res.json({
            users,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user by ID
router.get('/users/:id', auth, requireAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password')
            .populate('bookmarks.mangaId', 'title coverImage')
            .populate('readingHistory.mangaId', 'title coverImage');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update user
router.put('/users/:id', auth, requireAdmin, async (req, res) => {
    try {
        // Don't allow password updates through this route
        if (req.body.password) {
            delete req.body.password;
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete user
router.delete('/users/:id', auth, requireAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Ban/unban user
router.post('/users/:id/ban', auth, requireAdmin, async (req, res) => {
    try {
        const { reason, duration } = req.body;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                isBanned: true,
                banReason: reason,
                banExpiresAt: duration ? new Date(Date.now() + duration * 60 * 60 * 1000) : null
            },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User banned successfully', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/users/:id/unban', auth, requireAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                isBanned: false,
                banReason: null,
                banExpiresAt: null
            },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User unbanned successfully', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;