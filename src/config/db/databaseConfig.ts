import 'dotenv/config';
import { Pool } from 'pg';
const pool = new Pool({
    user: process.env.DATABASE_USER as string,
    host: process.env.DATABASE_HOST as string,
    database: process.env.DATABASE_NAME as string,
    password: process.env.DATABASE_PASSWORD as string,
    port: Number(process.env.DATABASE_PORT),
});
// Function to initialize the database connection
export async function initializeDatabase() {
    try {
        const client = await pool.connect(); // Connect to the database
        console.log('Postgres is connected successfully to the backend!');
        client.release(); // Release the client after checking the connection
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Failed to connect to DB..", {
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString(),
            });
            process.exit(1);
        }
    } 
}
export default pool;