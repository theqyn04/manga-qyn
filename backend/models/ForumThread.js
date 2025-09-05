const mongoose = require('mongoose');

const forumThreadSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 200
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ForumCategory',
        required: true
    },
    tags: [String],
    isSticky: {
        type: Boolean,
        default: false
    },
    isLocked: {
        type: Boolean,
        default: false
    },
    viewCount: {
        type: Number,
        default: 0
    },
    replyCount: {
        type: Number,
        default: 0
    },
    lastReply: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ForumReply'
    },
    lastReplyAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

forumThreadSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.models.ForumThread || mongoose.model('ForumThread', forumThreadSchema);