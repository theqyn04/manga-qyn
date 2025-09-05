// routes/messages.js
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const MessageThread = require('../models/MessageThread');
const auth = require('../middleware/auth');

// Send a message
router.post('/', auth, async (req, res) => {
    try {
        const { recipientId, content } = req.body;

        if (recipientId === req.user._id.toString()) {
            return res.status(400).json({ message: 'Cannot message yourself' });
        }

        // Find or create thread
        let thread = await MessageThread.findOne({
            participants: { $all: [req.user._id, recipientId] }
        });

        if (!thread) {
            thread = new MessageThread({
                participants: [req.user._id, recipientId]
            });
            await thread.save();
        }

        // Create message
        const message = new Message({
            sender: req.user._id,
            recipient: recipientId,
            content,
            thread: thread._id
        });

        await message.save();

        // Update thread with last message
        thread.lastMessage = message._id;
        thread.lastMessageAt = new Date();
        await thread.save();

        // Populate sender info for response
        await message.populate('sender', 'username avatar');

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get message threads for user
router.get('/threads', auth, async (req, res) => {
    try {
        const threads = await MessageThread.find({
            participants: req.user._id,
            isArchived: false
        })
            .populate('participants', 'username avatar')
            .populate('lastMessage')
            .sort({ lastMessageAt: -1 });

        res.json(threads);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get messages in a thread
router.get('/threads/:threadId', auth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        // Verify user is participant in thread
        const thread = await MessageThread.findOne({
            _id: req.params.threadId,
            participants: req.user._id
        });

        if (!thread) {
            return res.status(404).json({ message: 'Thread not found' });
        }

        const messages = await Message.find({ thread: req.params.threadId })
            .populate('sender', 'username avatar')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Mark messages as read
        await Message.updateMany(
            {
                thread: req.params.threadId,
                recipient: req.user._id,
                isRead: false
            },
            {
                isRead: true,
                readAt: new Date()
            }
        );

        const total = await Message.countDocuments({ thread: req.params.threadId });

        res.json({
            messages: messages.reverse(), // Return in chronological order
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;