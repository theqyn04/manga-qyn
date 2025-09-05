const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        maxlength: 2000
    },
    thread: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MessageThread'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    readAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.models.Message || mongoose.model('Message', messageSchema);