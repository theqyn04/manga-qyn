const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function createAdminUser() {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/manga-qyn');

        console.log('Connected to database');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@example.com' });
        if (existingAdmin) {
            console.log('Admin user already exists. Deleting and recreating...');
            await User.deleteOne({ email: 'admin@example.com' });
        }

        // Hash the password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash('adminpassword123', saltRounds);

        // Create admin user
        const adminUser = new User({
            username: 'admin',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin',
            avatar: '',
            notificationPreferences: {
                email: {
                    newChapters: true,
                    mangaUpdates: true,
                    comments: true
                },
                push: {
                    newChapters: true,
                    mangaUpdates: true
                }
            }
        });

        await adminUser.save();
        console.log('Admin user created successfully:', {
            email: adminUser.email,
            role: adminUser.role,
            id: adminUser._id
        });

        mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error);
        mongoose.connection.close();
        process.exit(1);
    }
}

createAdminUser();