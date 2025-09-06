// File: scripts/checkCurrentDatabase.js
const { MongoClient } = require('mongodb');

async function checkCurrentDatabase() {
    const client = new MongoClient('mongodb://localhost:27017/mangadb');

    try {
        await client.connect();
        const db = client.db();
        const users = await db.collection('users').find().toArray();

        console.log('=== USERS IN MANGADB ===');
        users.forEach(user => {
            console.log(`- ${user.email} (${user.password ? 'has password' : 'no password'})`);
        });

    } finally {
        await client.close();
    }
}

checkCurrentDatabase();