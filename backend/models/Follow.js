// models/Follow.js
const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    manga: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Manga',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    notificationsEnabled: {
        type: Boolean,
        default: true
    }
});

// Compound index để mỗi user chỉ follow 1 manga 1 lần
followSchema.index({ user: 1, manga: 1 }, { unique: true });

module.exports = mongoose.model('Follow', followSchema);