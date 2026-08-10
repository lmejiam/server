// db.js
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export async function dbConnect() {
    try {
        const client = await pool.connect();
        console.log('Connected to the database');
        client.release();
    } catch (err) {
        console.error('Connection error', err.stack);
    }
}

export default pool;