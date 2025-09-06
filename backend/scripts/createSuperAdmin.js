const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function createSuperAdmin() {
    const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');

    try {
        await client.connect();
        const database = client.db('manga-qyn');
        const users = database.collection('users');

        // Delete if exists
        await users.deleteOne({ email: 'superadmin@example.com' });

        // Create fresh admin
        const hashedPassword = await bcrypt.hash('superadmin123', 12);

        const superAdmin = {
            username: 'superadmin',
            email: 'superadmin@example.com',
            password: hashedPassword,
            role: 'admin',
            avatar: '',
            createdAt: new Date(),
            updatedAt: new Date(),
            notificationPreferences: {
                email: { newChapters: true, mangaUpdates: true, comments: true },
                push: { newChapters: true, mangaUpdates: true }
            },
            lastNotificationCheck: new Date()
        };

        await users.insertOne(superAdmin);
        console.log('✅ SUPER ADMIN CREATED!');
        console.log('Email: superadmin@example.com');
        console.log('Password: superadmin123');

    } finally {
        await client.close();
    }
}

createSuperAdmin();