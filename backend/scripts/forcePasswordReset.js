const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function forcePasswordReset() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/manga-qyn');

        console.log('Force resetting password...');

        // First, check what's actually in the database
        const adminBefore = await User.findOne({ email: 'admin@example.com' });
        console.log('BEFORE - Password hash:', adminBefore.password);

        // Force update with explicit query
        const hashedPassword = await bcrypt.hash('adminpassword123', 12);
        const result = await User.updateOne(
            { email: 'admin@example.com' },
            {
                $set: {
                    password: hashedPassword,
                    updatedAt: new Date()
                }
            }
        );

        console.log('Update result:', result);

        // Read again to verify
        const adminAfter = await User.findOne({ email: 'admin@example.com' });
        console.log('AFTER - Password hash:', adminAfter.password);

        // Verify the password works
        const isMatch = await bcrypt.compare('adminpassword123', adminAfter.password);
        console.log('Password verification:', isMatch);

        if (isMatch) {
            console.log('✅ Password successfully reset!');
        } else {
            console.log('❌ Password still not working');
        }

        mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        mongoose.connection.close();
    }
}

forcePasswordReset();