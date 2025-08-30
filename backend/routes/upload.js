const express = require('express');
const { uploadCover, uploadPage, cloudinary } = require('../config/cloudinary');
const router = express.Router();

// Upload ảnh bìa
router.post('/cover', uploadCover.single('cover'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        res.status(200).json({
            message: 'Cover uploaded successfully',
            imageUrl: req.file.path,
            publicId: req.file.filename
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Upload một trang truyện
router.post('/page', uploadPage.single('page'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        res.status(200).json({
            message: 'Page uploaded successfully',
            imageUrl: req.file.path,
            publicId: req.file.filename
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Upload nhiều trang truyện cùng lúc - QUAN TRỌNG
router.post('/pages', uploadPage.array('pages', 50), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const uploadedFiles = req.files.map((file, index) => ({
            imageUrl: file.path,
            publicId: file.filename,
            pageNumber: index + 1 // Tự động đánh số trang
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