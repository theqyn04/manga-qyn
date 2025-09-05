const mongoose = require('mongoose');

const forumCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 100
    },
    description: {
        type: String,
        maxlength: 500
    },
    order: {
        type: Number,
        default: 0
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    moderators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    threadCount: {
        type: Number,
        default: 0
    },
    postCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.models.ForumCategory || mongoose.model('ForumCategory', forumCategorySchema);