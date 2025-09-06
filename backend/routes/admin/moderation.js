// backend/routes/admin/moderation.js
const express = require('express');
const router = express.Router();
const Manga = require('../../models/Manga');
const Review = require('../../models/Review');
const Comment = require('../../models/Comment');
const ForumThread = require('../../models/ForumThread');
const ForumReply = require('../../models/ForumReply');
const auth = require('../../middleware/auth');
const requireAdmin = require('../../middleware/admin');

// Content moderation endpoints
router.delete('/content/:type/:id', auth, requireAdmin, async (req, res) => {
    try {
        const { type, id } = req.params;
        let content;

        switch (type) {
            case 'review':
                content = await Review.findByIdAndDelete(id);
                break;
            case 'comment':
                content = await Comment.findByIdAndDelete(id);
                break;
            case 'forum_thread':
                content = await ForumThread.findByIdAndDelete(id);
                break;
            case 'forum_reply':
                content = await ForumReply.findByIdAndDelete(id);
                break;
            default:
                return res.status(400).json({ message: 'Invalid content type' });
        }

        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }

        res.json({ message: 'Content deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Toggle content visibility
router.post('/content/:type/:id/toggle', auth, requireAdmin, async (req, res) => {
    try {
        const { type, id } = req.params;
        let content;

        switch (type) {
            case 'review':
                content = await Review.findById(id);
                if (content) {
                    content.isHidden = !content.isHidden;
                    await content.save();
                }
                break;
            case 'comment':
                content = await Comment.findById(id);
                if (content) {
                    content.isHidden = !content.isHidden;
                    await content.save();
                }
                break;
            case 'forum_thread':
                content = await ForumThread.findById(id);
                if (content) {
                    content.isLocked = !content.isLocked;
                    await content.save();
                }
                break;
            default:
                return res.status(400).json({ message: 'Invalid content type' });
        }

        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }

        res.json({
            message: 'Content updated successfully',
            content
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get flagged content
router.get('/flagged-content', auth, requireAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const { type } = req.query;
        let model;

        switch (type) {
            case 'review':
                model = Review;
                break;
            case 'comment':
                model = Comment;
                break;
            case 'forum_thread':
                model = ForumThread;
                break;
            case 'forum_reply':
                model = ForumReply;
                break;
            default:
                return res.status(400).json({ message: 'Invalid content type' });
        }

        const content = await model.find({ flags: { $exists: true, $ne: [] } })
            .populate('author', 'username')
            .populate('flags.flaggedBy', 'username')
            .sort({ 'flags.count': -1 })
            .skip(skip)
            .limit(limit);

        const total = await model.countDocuments({ flags: { $exists: true, $ne: [] } });

        res.json({
            content,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;