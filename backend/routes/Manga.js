//routes/Manga.js
const express = require('express');
const router = express.Router();
const Manga = require('../models/manga');

// Lấy danh sách truyện
router.get('/', async (req, res) => {
    try {
        const mangas = await Manga.find();
        res.json(mangas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Lấy thông tin một truyện
router.get('/:id', async (req, res) => {
    try {
        const manga = await Manga.findById(req.params.id);
        if (!manga) {
            return res.status(404).json({ message: 'Không tìm thấy truyện' });
        }
        res.json(manga);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Tạo truyện mới
router.post('/', async (req, res) => {
    const manga = new Manga({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        coverImage: req.body.coverImage
    });

    try {
        const newManga = await manga.save();
        res.status(201).json(newManga);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;