const mongoose = require('mongoose');

const userRelationshipSchema = new mongoose.Schema({
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    following: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'blocked'],
        default: 'accepted' // For public profiles, auto-accept
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    notifications: {
        enabled: { type: Boolean, default: true }
    }
});

// Compound index to prevent duplicate relationships
userRelationshipSchema.index({ follower: 1, following: 1 }, { unique: true });

module.exports = mongoose.models.UserRelationship || mongoose.model('UserRelationship', userRelationshipSchema);