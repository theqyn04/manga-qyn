const mongoose = require('mongoose');

const messageThreadSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    lastMessageAt: {
        type: Date,
        default: Date.now
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Ensure each participant pair has only one thread
messageThreadSchema.index({ participants: 1 }, { unique: true });

module.exports = mongoose.models.MessageThread || mongoose.model('MessageThread', messageThreadSchema);