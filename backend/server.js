const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();
const User = require('./models/User');

const app = express();

// Middleware
app.use(cors({
    origin: true, // Cho phép tất cả origins
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.json());

// Xử lý preflight requests
app.options('*', cors());

// Passport configuration
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.SERVER_URL}/api/users/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Tìm hoặc tạo user mới
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
                // Liên kết tài khoản Google với tài khoản hiện có
                user.googleId = profile.id;
                await user.save();
            } else {
                // Tạo user mới
                user = new User({
                    username: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    avatar: profile.photos[0].value
                });
                await user.save();
            }
        }

        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

app.use(passport.initialize());

// Routes
app.use('/api/mangas', require('./routes/Manga'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/users', require('./routes/user'));

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});