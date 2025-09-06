// backend/routes/admin/analytics.js
const express = require('express');
const router = express.Router();
const Manga = require('../../models/Manga');
const User = require('../../models/User');
const Review = require('../../models/Review');
const Comment = require('../../models/Comment');
const Report = require('../../models/Report');
const auth = require('../../middleware/auth');
const requireAdmin = require('../../middleware/admin');

// Get dashboard statistics
router.get('/dashboard', auth, requireAdmin, async (req, res) => {
    try {
        const [
            totalUsers,
            totalMangas,
            totalReviews,
            totalComments,
            pendingReports,
            newUsersThisWeek,
            newMangasThisWeek
        ] = await Promise.all([
            User.countDocuments(),
            Manga.countDocuments(),
            Review.countDocuments(),
            Comment.countDocuments(),
            Report.countDocuments({ status: 'pending' }),
            User.countDocuments({
                createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
            }),
            Manga.countDocuments({
                createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
            })
        ]);

        // Get user growth data (last 30 days)
        const userGrowth = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Get popular manga categories
        const popularCategories = await Manga.aggregate([
            { $unwind: '$categories' },
            {
                $group: {
                    _id: '$categories',
                    count: { $sum: 1 },
                    avgRating: { $avg: '$rating' }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        res.json({
            stats: {
                totalUsers,
                totalMangas,
                totalReviews,
                totalComments,
                pendingReports,
                newUsersThisWeek,
                newMangasThisWeek
            },
            userGrowth,
            popularCategories
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get content statistics
router.get('/content-stats', auth, requireAdmin, async (req, res) => {
    try {
        const { period = '7days' } = req.query;
        let days;

        switch (period) {
            case '7days': days = 7; break;
            case '30days': days = 30; break;
            case '90days': days = 90; break;
            default: days = 7;
        }

        const dateFilter = { createdAt: { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) } };

        const [mangaStats, userStats, reviewStats] = await Promise.all([
            Manga.aggregate([
                { $match: dateFilter },
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        avgRating: { $avg: '$rating' },
                        avgFollowers: { $avg: '$followers' }
                    }
                }
            ]),
            User.aggregate([
                { $match: dateFilter },
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        avgReputation: { $avg: '$stats.reputation' }
                    }
                }
            ]),
            Review.aggregate([
                { $match: dateFilter },
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        avgRating: { $avg: '$rating' }
                    }
                }
            ])
        ]);

        res.json({
            period,
            mangaStats: mangaStats[0] || { total: 0, avgRating: 0, avgFollowers: 0 },
            userStats: userStats[0] || { total: 0, avgReputation: 0 },
            reviewStats: reviewStats[0] || { total: 0, avgRating: 0 }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;