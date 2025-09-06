const mongoose = require('mongoose');
const User = require('../models/User');

async function checkCurrentState() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/manga-qyn');

        console.log('Checking current database state...');

        const admin = await User.findOne({ email: 'admin@example.com' });
        console.log('Current admin data:');
        console.log('Email:', admin.email);
        console.log('Password hash:', admin.password);
        console.log('Updated at:', admin.updatedAt);

        // Test with the password we want to use
        const bcrypt = require('bcryptjs');
        const isMatch = await bcrypt.compare('adminpassword123', admin.password);
        console.log('Password "adminpassword123" matches current hash:', isMatch);

        mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        mongoose.connection.close();
    }
}

checkCurrentState();