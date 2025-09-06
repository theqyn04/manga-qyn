const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Password is optional for Google auth
    googleId: { type: String, unique: true, sparse: true },
    avatar: { type: String, default: '' },
    bookmarks: [{
        mangaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Manga' },
        chapterNumber: { type: Number, default: 0 },
        readAt: { type: Date, default: Date.now }
    }],
    readingHistory: [{
        mangaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Manga' },
        chapterNumber: { type: Number },
        readAt: { type: Date, default: Date.now }
    }],
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    createdAt: { type: Date, default: Date.now },
    notificationPreferences: {
        email: {
            newChapters: { type: Boolean, default: true },
            mangaUpdates: { type: Boolean, default: true },
            comments: { type: Boolean, default: true }
        },
        push: {
            newChapters: { type: Boolean, default: true },
            mangaUpdates: { type: Boolean, default: true }
        }
    },
    lastNotificationCheck: {
        type: Date,
        default: Date.now
    },
    // Add these fields for admin functionality
    isBanned: { type: Boolean, default: false },
    banReason: { type: String },
    banExpiresAt: { type: Date }
});

// Mã hóa mật khẩu trước khi lưu (chỉ áp dụng nếu có password)
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();

    try {
        // Only hash the password if it's modified or new
        if (this.isModified('password') && this.password) {
            const saltRounds = 12;
            this.password = await bcrypt.hash(this.password, saltRounds);
        }
        next();
    } catch (error) {
        next(error);
    }
});

// So sánh mật khẩu - FIXED METHOD
userSchema.methods.correctPassword = async function (candidatePassword) {
    if (!this.password) return false; // User doesn't have a password (Google auth)
    return await bcrypt.compare(candidatePassword, this.password);
};

// Check if model already exists before defining it
module.exports = mongoose.models.User || mongoose.model('User', userSchema);