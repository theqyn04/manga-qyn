const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
require('dotenv').config();

// Import models using the index file
const { User } = require('./models');

const app = express();

// Middleware
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.json());

// Xử lý preflight requests
app.options('*', cors());

// ==================== PASSPORT CONFIGURATION ====================

// JWT Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'your-fallback-secret-key'
};

passport.use(new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
        const user = await User.findById(jwtPayload.userId);
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    } catch (error) {
        return done(error, false);
    }
}));

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.SERVER_URL}/api/users/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
                user.googleId = profile.id;
                await user.save();
            } else {
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

// ==================== ROUTES ====================

// Import routes
const mangaRoutes = require('./routes/Manga');
const uploadRoutes = require('./routes/upload');
const userRoutes = require('./routes/user');
const reviewsRoutes = require('./routes/reviews');
const commentsRoutes = require('./routes/comments');
const followsRoutes = require('./routes/follows');
const notificationsRoutes = require('./routes/notifications');
const userRelationshipsRoutes = require('./routes/userRelationships');
const activitiesRoutes = require('./routes/activities');
const messagesRoutes = require('./routes/messages');
const forumRoutes = require('./routes/forum');

// Use routes
app.use('/api/mangas', mangaRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/follows', followsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/relationships', userRelationshipsRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/forum', forumRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// ==================== DATABASE CONNECTION ====================

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/manga-qyn';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch(err => console.log('❌ MongoDB Connection Error:', err));

// ==================== SERVER START ====================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 API Health: http://localhost:${PORT}/api/health`);
});