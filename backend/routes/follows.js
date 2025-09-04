// routes/follows.js
const express = require('express');
const router = express.Router();
const Follow = require('../models/Follow');
const Manga = require('../models/Manga');
const Notification = require('../models/Notification');
const passport = require('passport');

// GET user's followed mangas
router.get('/my-follows', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const follows = await Follow.find({ user: req.user._id })
            .populate('manga', 'title coverImage author status rating followers')
            .sort({ createdAt: -1 });

        res.json(follows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST follow a manga
router.post('/:mangaId', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { mangaId } = req.params;

        // Check if manga exists
        const manga = await Manga.findById(mangaId);
        if (!manga) {
            return res.status(404).json({ message: 'Manga not found' });
        }

        // Check if already following
        const existingFollow = await Follow.findOne({
            user: req.user._id,
            manga: mangaId
        });

        if (existingFollow) {
            return res.status(400).json({ message: 'Already following this manga' });
        }

        // Create follow
        const follow = new Follow({
            user: req.user._id,
            manga: mangaId,
            notificationsEnabled: true
        });

        await follow.save();

        // Update manga followers count
        await Manga.findByIdAndUpdate(mangaId, {
            $inc: { followers: 1 }
        });

        res.status(201).json(follow);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE unfollow a manga
router.delete('/:mangaId', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { mangaId } = req.params;

        const follow = await Follow.findOneAndDelete({
            user: req.user._id,
            manga: mangaId
        });

        if (!follow) {
            return res.status(404).json({ message: 'Follow not found' });
        }

        // Update manga followers count
        await Manga.findByIdAndUpdate(mangaId, {
            $inc: { followers: -1 }
        });

        res.json({ message: 'Unfollowed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT update notification settings
router.put('/:mangaId/notifications', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { mangaId } = req.params;
        const { enabled } = req.body;

        const follow = await Follow.findOneAndUpdate(
            { user: req.user._id, manga: mangaId },
            { notificationsEnabled: enabled },
            { new: true }
        );

        if (!follow) {
            return res.status(404).json({ message: 'Follow not found' });
        }

        res.json(follow);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET check if following a manga
router.get('/:mangaId/status', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { mangaId } = req.params;

        const follow = await Follow.findOne({
            user: req.user._id,
            manga: mangaId
        });

        res.json({ isFollowing: !!follow, notificationsEnabled: follow?.notificationsEnabled || false });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;