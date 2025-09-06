// models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    manga: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Manga',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    title: {
        type: String,
        maxlength: 100
    },
    content: {
        type: String,
        maxlength: 2000
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    reports: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        reason: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    // Moderation fields
    isHidden: {
        type: Boolean,
        default: false
    },
    hiddenReason: String,
    hiddenBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    hiddenAt: Date,
    flags: [{
        flaggedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        reason: String,
        flaggedAt: {
            type: Date,
            default: Date.now
        }
    }],
    flagCount: {
        type: Number,
        default: 0
    },
    isSpoiler: {
        type: Boolean,
        default: false
    },
    isEdited: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Compound index để mỗi user chỉ review 1 manga 1 lần
reviewSchema.index({ manga: 1, user: 1 }, { unique: true });

// Virtual for like/dislike count
reviewSchema.virtual('likeCount').get(function () {
    return this.likes.length;
});

reviewSchema.virtual('dislikeCount').get(function () {
    return this.dislikes.length;
});

reviewSchema.virtual('reportCount').get(function () {
    return this.reports.length;
});

module.exports = mongoose.model('Review', reviewSchema);