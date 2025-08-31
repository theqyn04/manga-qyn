const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Password is optional for Google auth
    googleId: { type: String, unique: true, sparse: true }, // Added for Google OAuth
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
    createdAt: { type: Date, default: Date.now }
});

// Mã hóa mật khẩu trước khi lưu (chỉ áp dụng nếu có password)
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// So sánh mật khẩu
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('User', userSchema);