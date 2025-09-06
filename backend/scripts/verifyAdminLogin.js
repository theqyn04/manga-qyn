const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function verifyAdminLogin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/manga-qyn');

        const admin = await User.findOne({ email: 'admin@example.com' });
        console.log('Admin user:', admin.email);

        // Test password
        const isMatch = await bcrypt.compare('adminpassword123', admin.password);
        console.log('Password match:', isMatch);

        if (isMatch) {
            console.log('✅ Admin login should work now!');
        } else {
            console.log('❌ Password still not matching. Need to investigate further.');
        }

        mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        mongoose.connection.close();
    }
}

verifyAdminLogin();