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
    }
});

module.exports = mongoose.models.ForumReply || mongoose.model('ForumReply', forumReplySchema);