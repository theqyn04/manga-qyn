// routes/comments.js
const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const passport = require('passport');

// GET comments for manga/chapter
router.get('/', async (req, res) => {
    try {
        const { mangaId, chapterId, page = 1, limit = 20, parentComment = null } = req.query;

        const query = {};
        if (mangaId) query.manga = mangaId;
        if (chapterId) query.chapter = chapterId;
        if (parentComment) {
            query.parentComment = parentComment;
        } else {
            query.parentComment = { $exists: false };
        }

        const comments = await Comment.find(query)
            .populate('user', 'username avatar')
            .populate('replyCount')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Comment.countDocuments(query);

        res.json({
            comments,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST create comment
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { mangaId, chapterId, content, parentComment, isSpoiler } = req.body;

        const comment = new Comment({
            manga: mangaId,
            chapter: chapterId,
            user: req.user._id,
            content,
            parentComment,
            isSpoiler: isSpoiler || false
        });

        await comment.save();
        await comment.populate('user', 'username avatar');

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT update comment
router.put('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const comment = await Comment.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        Object.assign(comment, {
            content: req.body.content,
            isEdited: true,
            isSpoiler: req.body.isSpoiler || false
        });

        await comment.save();
        await comment.populate('user', 'username avatar');

        res.json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE comment
router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const comment = await Comment.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Also delete all replies
        await Comment.deleteMany({ parentComment: req.params.id });
        await Comment.findByIdAndDelete(req.params.id);

        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST like/dislike comment
router.post('/:id/reaction', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { reaction } = req.body;
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (reaction === 'like') {
            comment.dislikes.pull(req.user._id);
            if (comment.likes.includes(req.user._id)) {
                comment.likes.pull(req.user._id);
            } else {
                comment.likes.push(req.user._id);
            }
        } else {
            comment.likes.pull(req.user._id);
            if (comment.dislikes.includes(req.user._id)) {
                comment.dislikes.pull(req.user._id);
            } else {
                comment.dislikes.push(req.user._id);
            }
        }

        await comment.save();
        res.json({
            likes: comment.likes.length,
            dislikes: comment.dislikes.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST report comment
router.post('/:id/report', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { reason } = req.body;
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        const existingReport = comment.reports.find(
            report => report.user.toString() === req.user._id.toString()
        );

        if (existingReport) {
            return res.status(400).json({ message: 'You have already reported this comment' });
        }

        comment.reports.push({
            user: req.user._id,
            reason
        });

        await comment.save();
        res.json({ message: 'Comment reported successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;