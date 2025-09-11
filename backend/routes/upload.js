// routes/upload.js
const express = require('express');
const { uploadCover, uploadPage, cloudinary } = require('../config/cloudinary');
const router = express.Router();
const multer = require('multer');

// Middleware debug để xem request
const debugUpload = (req, res, next) => {
    console.log('=== UPLOAD DEBUG ===');
    console.log('Headers:', req.headers);
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Has body:', !!req.body);
    console.log('Has file:', !!req.file);
    console.log('Files:', req.files);
    console.log('Body keys:', Object.keys(req.body));
    next();
};

// Upload ảnh bìa
router.post('/cover', debugUpload, uploadCover.single('cover'), async (req, res) => {
    try {
        console.log('=== AFTER UPLOAD ===');
        console.log('File received:', req.file);
        console.log('Body after upload:', req.body);

        if (!req.file) {
            console.log('No file in req.file');
            // Kiểm tra xem file có trong body không
            if (req.body.cover) {
                console.log('But found cover in body:', typeof req.body.cover);
            }
            return res.status(400).json({ 
                success: false,
                error: 'No file uploaded - req.file is null'
            });
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(req.file.mimetype)) {
            return res.status(400).json({ 
                success: false,
                error: 'Chỉ chấp nhận file JPG, PNG, WebP' 
            });
        }

        console.log('File uploaded successfully:', {
            originalname: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype,
            cloudinaryUrl: req.file.path
        });

        res.status(200).json({
            success: true,
            message: 'Upload ảnh bìa thành công',
            imageUrl: req.file.path,
            publicId: req.file.filename
        });

    } catch (error) {
        console.error('Upload cover error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Lỗi server khi upload ảnh bìa: ' + error.message 
        });
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