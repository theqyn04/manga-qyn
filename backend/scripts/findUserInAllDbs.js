const { MongoClient } = require('mongodb');

async function findUserInAllDbs() {
    const client = new MongoClient('mongodb://localhost:27017');

    try {
        await client.connect();
        const adminDb = client.db('admin');
        const result = await adminDb.admin().listDatabases();

        for (const dbInfo of result.databases) {
            if (dbInfo.name !== 'admin' && dbInfo.name !== 'local' && dbInfo.name !== 'config') {
                try {
                    const db = client.db(dbInfo.name);
                    const usersCollection = db.collection('users');
                    const user = await usersCollection.findOne({
                        $or: [
                            { email: 'superadmin@example.com' },
                            { email: 'admin@example.com' }
                        ]
                    });

                    if (user) {
                        console.log(`✅ Found user in database: ${dbInfo.name}`);
                        console.log('User:', {
                            email: user.email,
                            password: user.password,
                            database: dbInfo.name
                        });
                    }
                } catch (error) {
                    console.log(`No users collection in ${dbInfo.name}`);
                }
            }
        }

    } finally {
        await client.close();
    }
}

findUserInAllDbs();