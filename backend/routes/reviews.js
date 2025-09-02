// routes/reviews.js
const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Manga = require('../models/manga');
const passport = require('passport');

// GET reviews for a manga
router.get('/manga/:mangaId', async (req, res) => {
    try {
        const { mangaId } = req.params;
        const { page = 1, limit = 10, sort = 'newest' } = req.query;

        const sortOptions = {
            newest: { createdAt: -1 },
            oldest: { createdAt: 1 },
            helpful: { likeCount: -1, createdAt: -1 },
            rating: { rating: -1, createdAt: -1 }
        };

        const reviews = await Review.find({ manga: mangaId })
            .populate('user', 'username avatar')
            .sort(sortOptions[sort] || { createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Review.countDocuments({ manga: mangaId });

        res.json({
            reviews,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST create review
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { mangaId, rating, title, content, isSpoiler } = req.body;

        // Check if user already reviewed this manga
        const existingReview = await Review.findOne({
            manga: mangaId,
            user: req.user._id
        });

        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this manga' });
        }

        const review = new Review({
            manga: mangaId,
            user: req.user._id,
            rating,
            title,
            content,
            isSpoiler: isSpoiler || false
        });

        await review.save();
        await review.populate('user', 'username avatar');

        // Update manga rating
        await updateMangaRating(mangaId);

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT update review
router.put('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const review = await Review.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        Object.assign(review, {
            ...req.body,
            isEdited: true
        });

        await review.save();
        await review.populate('user', 'username avatar');

        // Update manga rating if rating changed
        if (req.body.rating) {
            await updateMangaRating(review.manga);
        }

        res.json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE review
router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const review = await Review.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        const mangaId = review.manga;
        await Review.findByIdAndDelete(req.params.id);

        // Update manga rating
        await updateMangaRating(mangaId);

        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST like/dislike review
router.post('/:id/reaction', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { reaction } = req.body; // 'like' or 'dislike'
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Remove from opposite reaction
        if (reaction === 'like') {
            review.dislikes.pull(req.user._id);
            if (review.likes.includes(req.user._id)) {
                review.likes.pull(req.user._id);
            } else {
                review.likes.push(req.user._id);
            }
        } else {
            review.likes.pull(req.user._id);
            if (review.dislikes.includes(req.user._id)) {
                review.dislikes.pull(req.user._id);
            } else {
                review.dislikes.push(req.user._id);
            }
        }

        await review.save();
        res.json({
            likes: review.likes.length,
            dislikes: review.dislikes.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST report review
router.post('/:id/report', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { reason } = req.body;
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if user already reported
        const existingReport = review.reports.find(
            report => report.user.toString() === req.user._id.toString()
        );

        if (existingReport) {
            return res.status(400).json({ message: 'You have already reported this review' });
        }

        review.reports.push({
            user: req.user._id,
            reason
        });

        await review.save();
        res.json({ message: 'Review reported successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Helper function to update manga rating
async function updateMangaRating(mangaId) {
    const reviews = await Review.find({ manga: mangaId });
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    await Manga.findByIdAndUpdate(mangaId, {
        rating: averageRating,
        ratingCount: reviews.length
    });
}

module.exports = router;