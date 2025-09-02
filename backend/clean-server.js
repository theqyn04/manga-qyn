// File: clean-server.js
// Xóa cache của tất cả modules trước khi require
Object.keys(require.cache).forEach(function(key) {
  delete require.cache[key];
});

// Now require fresh modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: true,
    credentials: true,
}));
app.use(express.json());

// Chỉ load routes cơ bản nhất
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;

// Không kết nối MongoDB, chỉ chạy server cơ bản
app.listen(PORT, () => {
    console.log(`🚀 Basic server running on port ${PORT}`);
    console.log(`✅ No routes loaded - just health check`);
});