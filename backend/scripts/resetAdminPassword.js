const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function resetAdminPassword() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/manga-qyn');
        
        console.log('Connected to database');
        
        // Hash the correct password
        const hashedPassword = await bcrypt.hash('adminpassword123', 12);
        console.log('New hashed password:', hashedPassword);
        
        // Update the admin password
        const result = await User.updateOne(
            { email: 'admin@example.com' },
            { $set: { password: hashedPassword } }
        );
        
        console.log('Password reset result:', result);
        
        // Verify the update worked
        const admin = await User.findOne({ email: 'admin@example.com' });
        console.log('Updated admin password hash:', admin.password);
        
        // Test the new password
        const isMatch = await bcrypt.compare('adminpassword123', admin.password);
        console.log('Password verification after reset:', isMatch);
        
        if (isMatch) {
            console.log('✅ SUCCESS: Admin password has been reset!');
            console.log('You can now login with:');
            console.log('Email: admin@example.com');
            console.log('Password: adminpassword123');
        } else {
            console.log('❌ ERROR: Password still not matching');
        }
        
        mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error resetting password:', error);
        mongoose.connection.close();
        process.exit(1);
    }
}

resetAdminPassword();