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

// Upload trang truyện - Sửa để xử lý cả single và multiple
router.post('/page', uploadPage.single('page'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: 'No file uploaded',
                details: 'Make sure the form field name is "page"'
            });
        }

        res.status(200).json({
            message: 'Page uploaded successfully',
            imageUrl: req.file.path,
            publicId: req.file.filename
        });
    } catch (error) {
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                error: 'Unexpected field',
                details: 'The field name for the file must be "page"'
            });
        }
        res.status(500).json({ error: error.message });
    }
});

// Upload nhiều trang truyện cùng lúc
router.post('/pages', uploadPage.array('pages', 50), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const uploadedFiles = req.files.map(file => ({
            imageUrl: file.path,
            publicId: file.filename
        }));

        res.status(200).json({
            message: 'Pages uploaded successfully',
            files: uploadedFiles
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