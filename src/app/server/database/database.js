const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    connectionString: process.env.DB_URI,
});

const dbConnection = async () => {
    try {
        await client.connect();
        console.log('Database connected');
    } catch (error) {
        console.error('Error connecting to DB', error);
        throw error; // Propagate the error if needed
    }
};


module.exports = { dbConnection, client };
