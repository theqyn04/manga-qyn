//routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

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
        const { email, password } = req.body;

        // Tìm user bằng email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Kiểm tra password
        const isMatch = await user.correctPassword(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Tạo JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
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
        const user = await User.findById(req.params.id)
            .select('-password'); // Không trả về password

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
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

module.exports = router;