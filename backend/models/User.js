const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
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

    // Profile enhancements
    profile: {
        bio: { type: String, maxlength: 500 },
        location: String,
        website: String,
        socialLinks: {
            twitter: String,
            instagram: String,
            discord: String
        },
        birthDate: Date
    },
    stats: {
        mangaAdded: { type: Number, default: 0 },
        reviewsWritten: { type: Number, default: 0 },
        commentsMade: { type: Number, default: 0 },
        followersCount: { type: Number, default: 0 },
        followingCount: { type: Number, default: 0 },
        reputation: { type: Number, default: 0 }
    },
    preferences: {
        privacy: {
            profile: { type: String, enum: ['public', 'private', 'friends'], default: 'public' },
            activity: { type: String, enum: ['public', 'private', 'friends'], default: 'public' }
        },
        theme: { type: String, enum: ['light', 'dark', 'auto'], default: 'auto' }
    },
    badges: [{
        name: String,
        description: String,
        earnedAt: { type: Date, default: Date.now }
    }],
});

// Mã hóa mật khẩu trước khi lưu
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// So sánh mật khẩu
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

// Check if model already exists before defining it
module.exports = mongoose.models.User || mongoose.model('User', userSchema);