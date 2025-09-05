//routes/forum.js
const express = require('express');
const router = express.Router();
const ForumCategory = require('../models/ForumCategory');
const ForumThread = require('../models/ForumThread');
const ForumReply = require('../models/ForumReply');
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');

// Get all forum categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await ForumCategory.find({ isPublic: true })
            .sort({ order: 1, name: 1 });

        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new thread
router.post('/threads', auth, async (req, res) => {
    try {
        const { title, content, categoryId, tags } = req.body;

        const thread = new ForumThread({
            title,
            content,
            author: req.user._id,
            category: categoryId,
            tags: tags || []
        });

        await thread.save();

        // Update category thread count
        await ForumCategory.findByIdAndUpdate(categoryId, {
            $inc: { threadCount: 1 }
        });

        // Create activity
        const activity = new Activity({
            user: req.user._id,
            type: 'forum_thread',
            title: `Posted a new thread: ${title}`,
            content: content.substring(0, 200), // First 200 chars
            target: { type: 'thread', id: thread._id }
        });

        await activity.save();

        await thread.populate('author', 'username avatar');
        res.status(201).json(thread);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get threads in a category
router.get('/categories/:categoryId/threads', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const sortBy = req.query.sortBy || 'lastReplyAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

        const threads = await ForumThread.find({ category: req.params.categoryId })
            .populate('author', 'username avatar')
            .populate('lastReply')
            .sort({ [sortBy]: sortOrder, createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await ForumThread.countDocuments({ category: req.params.categoryId });

        res.json({
            threads,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add reply to thread
router.post('/threads/:threadId/replies', auth, async (req, res) => {
    try {
        const { content, parentReplyId } = req.body;

        const thread = await ForumThread.findById(req.params.threadId);
        if (!thread) {
            return res.status(404).json({ message: 'Thread not found' });
        }

        if (thread.isLocked) {
            return res.status(400).json({ message: 'Thread is locked' });
        }

        const reply = new ForumReply({
            content,
            author: req.user._id,
            thread: req.params.threadId,
            parentReply: parentReplyId
        });

        await reply.save();

        // Update thread stats
        thread.replyCount += 1;
        thread.lastReply = reply._id;
        thread.lastReplyAt = new Date();
        await thread.save();

        // Update category post count
        await ForumCategory.findByIdAndUpdate(thread.category, {
            $inc: { postCount: 1 }
        });

        // Create activity
        const activity = new Activity({
            user: req.user._id,
            type: 'forum_reply',
            title: `Replied to thread: ${thread.title}`,
            content: content.substring(0, 200),
            target: { type: 'thread', id: thread._id }
        });

        await activity.save();

        await reply.populate('author', 'username avatar');
        res.status(201).json(reply);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;