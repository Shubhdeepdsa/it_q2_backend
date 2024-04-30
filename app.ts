// Import required modules
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { Pool, QueryResult } from 'pg';

// Load environment variables from .env file
dotenv.config();

// PostgreSQL configuration
const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
const pool = new Pool({
    host: PGHOST,
    database: PGDATABASE,
    user: PGUSER,
    password: PGPASSWORD,
    port: 5432,
    ssl: {
        rejectUnauthorized : true,
    },
});

// Create Express application
const app = express();

// Define a route to handle GET requests to "/products"
app.get('/products', async (req: Request, res: Response) => {
    try {
        // Connect to the database
        const client = await pool.connect();

        try {
            // Execute the query to retrieve products
            const result: QueryResult = await client.query('SELECT * FROM products');

            // Send the retrieved products as JSON response
            res.json(result.rows);
        } finally {
            // Release the database connection
            client.release();
        }
    } catch (error) {
        // If an error occurs, send an error response
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the Express.js server
const PORT: number = parseInt(process.env.PORT || '5000');
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
