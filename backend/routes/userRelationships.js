// backend/routes/userRelationships.js
const express = require('express');
const router = express.Router();
const UserRelationship = require('../models/UserRelationship');
const User = require('../models/User');
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');

// Follow a user
router.post('/:userId/follow', auth, async (req, res) => {
    try {
        const targetUserId = req.params.userId;

        if (targetUserId === req.user._id.toString()) {
            return res.status(400).json({ message: 'Cannot follow yourself' });
        }

        const targetUser = await User.findById(targetUserId);
        if (!targetUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if already following
        const existingRelationship = await UserRelationship.findOne({
            follower: req.user._id,
            following: targetUserId
        });

        if (existingRelationship) {
            return res.status(400).json({ message: 'Already following this user' });
        }

        // Create relationship
        const relationship = new UserRelationship({
            follower: req.user._id,
            following: targetUserId,
            status: targetUser.profile.privacy === 'public' ? 'accepted' : 'pending'
        });

        await relationship.save();

        // Update follower counts
        await User.findByIdAndUpdate(req.user._id, {
            $inc: { 'stats.followingCount': 1 }
        });

        await User.findByIdAndUpdate(targetUserId, {
            $inc: { 'stats.followersCount': 1 }
        });

        // Create activity
        const activity = new Activity({
            user: req.user._id,
            type: 'followed_user',
            title: `Started following ${targetUser.username}`,
            target: { type: 'user', id: targetUserId }
        });

        await activity.save();

        res.status(201).json(relationship);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Unfollow a user
router.delete('/:userId/follow', auth, async (req, res) => {
    try {
        const relationship = await UserRelationship.findOneAndDelete({
            follower: req.user._id,
            following: req.params.userId
        });

        if (!relationship) {
            return res.status(404).json({ message: 'Not following this user' });
        }

        // Update follower counts
        await User.findByIdAndUpdate(req.user._id, {
            $inc: { 'stats.followingCount': -1 }
        });

        await User.findByIdAndUpdate(req.params.userId, {
            $inc: { 'stats.followersCount': -1 }
        });

        res.json({ message: 'Unfollowed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user's followers
router.get('/:userId/followers', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const relationships = await UserRelationship.find({ following: req.params.userId, status: 'accepted' })
            .populate('follower', 'username avatar stats')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await UserRelationship.countDocuments({ following: req.params.userId, status: 'accepted' });

        res.json({
            followers: relationships,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get users followed by user
router.get('/:userId/following', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const relationships = await UserRelationship.find({ follower: req.params.userId, status: 'accepted' })
            .populate('following', 'username avatar stats')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await UserRelationship.countDocuments({ follower: req.params.userId, status: 'accepted' });

        res.json({
            following: relationships,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;