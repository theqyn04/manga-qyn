//config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cấu hình lưu trữ cho ảnh bìa
const coverStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'manga-covers',
        format: async (req, file) => 'webp',
        transformation: [{ width: 600, height: 800, crop: 'fill' }],
        public_id: (req, file) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            return 'cover-' + uniqueSuffix;
        },
    },
});

// Cấu hình lưu trữ cho trang truyện
const pageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'manga-pages',
        format: async (req, file) => 'webp',
        transformation: [{ width: 800, height: 1200, crop: 'limit' }],
        public_id: (req, file) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            return 'page-' + uniqueSuffix;
        },
    },
});

// Middleware upload
const uploadCover = multer({ storage: coverStorage });
const uploadPage = multer({ storage: pageStorage });

module.exports = { uploadCover, uploadPage, cloudinary };