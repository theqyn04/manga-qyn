// backend/routes/admin/manga.js
const express = require('express');
const router = express.Router();
const Manga = require('../../models/Manga');
const auth = require('../../middleware/auth');
const requireAdmin = require('../../middleware/admin');

// Get all mangas with filtering and pagination
router.get('/mangas', auth, requireAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const filter = {};

        // Filter by status
        if (req.query.status) {
            filter.status = req.query.status;
        }

        // Filter by category
        if (req.query.category) {
            filter.categories = req.query.category;
        }

        // Search by title
        if (req.query.search) {
            filter.title = { $regex: req.query.search, $options: 'i' };
        }

        const mangas = await Manga.find(filter)
            .populate('author', 'username')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Manga.countDocuments(filter);

        res.json({
            mangas,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get manga by ID
router.get('/mangas/:id', auth, requireAdmin, async (req, res) => {
    try {
        const manga = await Manga.findById(req.params.id)
            .populate('author', 'username email');

        if (!manga) {
            return res.status(404).json({ message: 'Manga not found' });
        }

        res.json(manga);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update manga
router.put('/mangas/:id', auth, requireAdmin, async (req, res) => {
    try {
        const manga = await Manga.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!manga) {
            return res.status(404).json({ message: 'Manga not found' });
        }

        res.json(manga);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete manga
router.delete('/mangas/:id', auth, requireAdmin, async (req, res) => {
    try {
        const manga = await Manga.findByIdAndDelete(req.params.id);

        if (!manga) {
            return res.status(404).json({ message: 'Manga not found' });
        }

        res.json({ message: 'Manga deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Bulk actions
router.post('/mangas/bulk', auth, requireAdmin, async (req, res) => {
    try {
        const { action, mangaIds } = req.body;

        if (!['delete', 'publish', 'unpublish'].includes(action)) {
            return res.status(400).json({ message: 'Invalid action' });
        }

        let update = {};
        switch (action) {
            case 'delete':
                await Manga.deleteMany({ _id: { $in: mangaIds } });
                break;
            case 'publish':
                update = { status: 'published' };
                break;
            case 'unpublish':
                update = { status: 'draft' };
                break;
        }

        if (action !== 'delete') {
            await Manga.updateMany(
                { _id: { $in: mangaIds } },
                update
            );
        }

        res.json({ message: `Bulk ${action} completed successfully` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;