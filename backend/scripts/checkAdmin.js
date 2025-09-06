const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function checkAdminUser() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/manga-qyn');

        const admin = await User.findOne({ email: 'admin@example.com' });
        console.log('Admin user from DB:', admin);

        if (admin && admin.password) {
            // Test password manually
            const isMatch = await bcrypt.compare('adminpassword123', admin.password);
            console.log('Manual password check:', isMatch);
        }

        mongoose.connection.close();
    } catch (error) {
        console.error('Error checking admin:', error);
        mongoose.connection.close();
    }
}

checkAdminUser();