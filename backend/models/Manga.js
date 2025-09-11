const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true },
    pageNumber: { type: Number, required: true }
});

const chapterSchema = new mongoose.Schema({
    title: { type: String, required: true },
    chapterNumber: { type: Number, required: true },
    pages: [pageSchema],
    uploadDate: { type: Date, default: Date.now },
    views: { type: Number, default: 0 }
});

const mangaSchema = new mongoose.Schema({
    title: { type: String, required: true },
    japaneseTitle: { type: String }, // Thêm trường tên tiếng Nhật
    author: { type: String, required: true },
    description: { type: String },
    coverImage: { type: String, required: true },
    categories: [{ type: String }],
    status: {
        type: String,
        enum: ['ongoing', 'completed', 'hiatus'],
        default: 'ongoing'
    },
    chapters: [chapterSchema],
    views: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Cập nhật updatedAt trước khi lưu
mangaSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Check if model already exists before defining it
module.exports = mongoose.models.Manga || mongoose.model('Manga', mangaSchema);