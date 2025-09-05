const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: [
            'manga_added', 'manga_updated', 'review_posted',
            'comment_posted', 'followed_user', 'badge_earned',
            'forum_thread', 'forum_reply', 'message_sent'
        ],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String
    },
    target: {
        type: {
            type: String,
            enum: ['manga', 'user', 'review', 'comment', 'forum', 'thread', 'badge']
        },
        id: mongoose.Schema.Types.ObjectId
    },
    privacy: {
        type: String,
        enum: ['public', 'private', 'friends'],
        default: 'public'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for efficient querying
activitySchema.index({ user: 1, createdAt: -1 });
activitySchema.index({ user: 1, type: 1, createdAt: -1 });

module.exports = mongoose.models.Activity || mongoose.model('Activity', activitySchema);