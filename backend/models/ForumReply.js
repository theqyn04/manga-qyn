const mongoose = require('mongoose');

const forumReplySchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    thread: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ForumThread',
        required: true
    },
    parentReply: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ForumReply'
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    likeCount: {
        type: Number,
        default: 0
    },
    isEdited: {
        type: Boolean,
        default: false
    },
    editedAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
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
    }
});

module.exports = mongoose.models.ForumReply || mongoose.model('ForumReply', forumReplySchema);