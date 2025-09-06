const bcrypt = require('bcryptjs');

async function testBcrypt() {
    console.log('Testing bcrypt directly...');

    const password = 'adminpassword123';
    const hash = await bcrypt.hash(password, 12);
    console.log('Generated hash:', hash);

    const match = await bcrypt.compare(password, hash);
    console.log('Direct bcrypt comparison:', match);

    // Test with the hash from your database
    const dbHash = '$2b$12$J8I2dGQWi4IqD13V5w3S5ewWDUjNEyBNgCgr6Fccx2KkzeatZJO/C';
    const matchWithDb = await bcrypt.compare(password, dbHash);
    console.log('Comparison with DB hash:', matchWithDb);
}

testBcrypt();