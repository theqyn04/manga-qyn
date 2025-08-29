//routes/upload.js
const express = require('express');
const { uploadCover, uploadPage } = require('../config/cloudinary');
const Manga = require('../models/manga');
const router = express.Router();

// Upload ảnh bìa
router.post('/cover', uploadCover.single('cover'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        res.status(200).json({
            message: 'Cover uploaded successfully',
            imageUrl: req.file.path
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Upload trang truyện
router.post('/page', uploadPage.single('page'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        res.status(200).json({
            message: 'Page uploaded successfully',
            imageUrl: req.file.path
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Xóa ảnh
router.delete('/:publicId', async (req, res) => {
    try {
        const { publicId } = req.params;

        // Xóa ảnh từ Cloudinary
        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result === 'ok') {
            res.status(200).json({ message: 'Image deleted successfully' });
        } else {
            res.status(404).json({ error: 'Image not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;