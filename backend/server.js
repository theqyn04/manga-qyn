const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: true, // Cho phép tất cả origins
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/mangas', require('./routes/Manga'));
app.use('/api/upload', require('./routes/upload'));
// app.use('/api/users', require('./routes/users'));

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