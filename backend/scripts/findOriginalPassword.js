const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function findOriginalPassword() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/manga-qyn');

        const admin = await User.findOne({ email: 'admin@example.com' });
        const storedHash = admin.password;

        console.log('Testing common admin passwords against hash:', storedHash);

        // Common admin passwords to try
        const commonPasswords = [
            'admin', 'password', 'admin123', 'password123', '123456',
            'qwerty', 'letmein', 'welcome', 'monkey', 'admin@123',
            'Admin123', 'Admin@123', 'root', 'toor', '12345',
            '12345678', '123456789', 'adminadmin', 'administrator'
        ];

        for (const password of commonPasswords) {
            const isMatch = await bcrypt.compare(password, storedHash);
            if (isMatch) {
                console.log('✅ FOUND ORIGINAL PASSWORD:', password);
                mongoose.connection.close();
                return;
            }
        }

        console.log('❌ Original password not found in common passwords list');
        mongoose.connection.close();
    } catch (error) {
        console.log('❌ Error:', error.message);
    }
}

findOriginalPassword();