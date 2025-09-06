const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function createSuperAdminInMangadb() {
    const client = new MongoClient('mongodb://localhost:27017/mangadb');

    try {
        await client.connect();
        const db = client.db();
        const usersCollection = db.collection('users');

        // Delete if exists
        await usersCollection.deleteOne({ email: 'superadmin@example.com' });

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

        await usersCollection.insertOne(superAdmin);
        console.log('✅ SUPER ADMIN CREATED in mangadb database!');
        console.log('Email: superadmin@example.com');
        console.log('Password: superadmin123');

    } finally {
        await client.close();
    }
}

createSuperAdminInMangadb();