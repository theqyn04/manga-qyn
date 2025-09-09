// models/Genre.js
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    mangaCount: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Tạo index cho tìm kiếm
genreSchema.index({ name: 'text' });

module.exports = mongoose.model('Genre', genreSchema);