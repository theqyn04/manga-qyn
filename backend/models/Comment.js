// models/Comment.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    manga: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Manga'
    },
    chapter: {
        type: mongoose.Schema.Types.ObjectId
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    content: {
        type: String,
        required: true,
        maxlength: 1000
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
    isEdited: {
        type: Boolean,
        default: false
    },
    isSpoiler: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Virtuals
commentSchema.virtual('likeCount').get(function () {
    return this.likes.length;
});

commentSchema.virtual('dislikeCount').get(function () {
    return this.dislikes.length;
});

commentSchema.virtual('replyCount', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'parentComment'
});

module.exports = mongoose.model('Comment', commentSchema);