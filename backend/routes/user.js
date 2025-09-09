//routes/user.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const mongoose = require('mongoose');

// Đăng ký user mới (giữ nguyên chức năng đăng ký bằng email/password)
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Kiểm tra user đã tồn tại chưa
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }

        // Tạo user mới
        const user = new User({
            username,
            email,
            password
        });

        await user.save();

        // Tạo JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Đăng nhập bằng email/password
router.post('/login', async (req, res) => {
    try {
        console.log('=== LOGIN ATTEMPT STARTED ===');
        console.log('Request body:', req.body);
        console.log('Request headers:', req.headers);

        const { email, password } = req.body;

        if (!email || !password) {
            console.log('❌ Missing email or password');
            return res.status(400).json({ message: 'Email and password are required' });
        }

        console.log('Looking for user with email:', email);

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            console.log('❌ User not found for email:', email);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log('✅ User found:', {
            id: user._id,
            email: user.email,
            hasPassword: !!user.password,
            passwordHash: user.password ? '***' : 'none'
        });

        // Check if user has a password
        if (!user.password) {
            console.log('❌ User has no password (Google auth user)');
            return res.status(400).json({
                message: 'This email is registered with Google. Please use Google login.'
            });
        }

        // Check if user is banned
        if (user.isBanned) {
            console.log('❌ User is banned');
            const now = new Date();
            if (user.banExpiresAt && user.banExpiresAt > now) {
                return res.status(403).json({
                    message: 'Account is banned',
                    reason: user.banReason,
                    expiresAt: user.banExpiresAt
                });
            }
        }

        console.log('Comparing passwords...');
        console.log('Input password:', password);
        console.log('Stored hash:', user.password);

        // Kiểm tra password - FIXED
        const isMatch = await user.correctPassword(password);
        console.log('Password match result:', isMatch);

        if (!isMatch) {
            console.log('❌ Password does not match');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log('✅ Password matched! Creating JWT token...');

        // Tạo JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'fallback-secret-key',
            { expiresIn: '7d' }
        );

        console.log('✅ Login successful for user:', email);
        console.log('=== LOGIN ATTEMPT COMPLETED ===');

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        });
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// Google OAuth routes
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/google/callback',
    passport.authenticate('google', { session: false }),
    async (req, res) => {
        try {
            // Tạo JWT token
            const token = jwt.sign(
                { userId: req.user._id },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            // Redirect hoặc trả về token
            res.json({
                message: 'Google login successful',
                token,
                user: {
                    id: req.user._id,
                    username: req.user.username,
                    email: req.user.email
                }
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);

// Lấy thông tin user
router.get('/:id', async (req, res) => {
    try {
        // Validate if the ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }

        const user = await User.findById(req.params.id)
            .select('-password'); // Không trả về password

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        res.status(500).json({ message: error.message });
    }
});

// File: routes/users.js
// Thêm endpoint mới
router.get('/profile', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Verify token endpoint
router.get('/verify-token', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ valid: true, user: req.user });
});

module.exports = router;