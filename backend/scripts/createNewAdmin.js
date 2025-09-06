const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function createNewAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/manga-qyn');

        // Delete existing admin if exists
        await User.deleteOne({ email: 'newadmin@example.com' });

        // Hash password
        const hashedPassword = await bcrypt.hash('newadmin123', 12);

        // Create new admin
        const newAdmin = new User({
            username: 'newadmin',
            email: 'newadmin@example.com',
            password: hashedPassword,
            role: 'admin'
        });

        await newAdmin.save();
        console.log('New admin created:', newAdmin.email);

        // Verify password
        const isMatch = await bcrypt.compare('newadmin123', newAdmin.password);
        console.log('Password verification:', isMatch);

        mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        mongoose.connection.close();
    }
}

createNewAdmin();