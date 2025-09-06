const { MongoClient } = require('mongodb');

async function listDatabases() {
    const client = new MongoClient('mongodb://localhost:27017');

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const adminDb = client.db('admin');
        const result = await adminDb.admin().listDatabases();

        console.log('Available databases:');
        result.databases.forEach(db => {
            console.log(`- ${db.name} (size: ${db.sizeOnDisk} bytes)`);
        });

    } finally {
        await client.close();
    }
}

listDatabases();