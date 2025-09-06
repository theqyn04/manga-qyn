const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function verifySuperAdmin() {
    const client = new MongoClient('mongodb://localhost:27017/mangadb');

    try {
        await client.connect();
        const db = client.db();
        const usersCollection = db.collection('users');

        const superadmin = await usersCollection.findOne({ email: 'superadmin@example.com' });

        if (superadmin) {
            console.log('✅ Superadmin found in mangadb!');
            console.log('Email:', superadmin.email);

            // Test password
            const isMatch = await bcrypt.compare('superadmin123', superadmin.password);
            console.log('Password test:', isMatch ? '✅ WORKS' : '❌ FAILS');
        } else {
            console.log('❌ Superadmin not found in mangadb');
        }

    } finally {
        await client.close();
    }
}

verifySuperAdmin();