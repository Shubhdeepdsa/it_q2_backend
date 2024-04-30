// Import required modules
import * as dotenv from 'dotenv';
import { Application, Request, Response } from 'express';
import { Pool, QueryResult } from 'pg';
import express = require('express')
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
        rejectUnauthorized: true,
    },
});

const app: Application = express();
app.use(express.json()); // Middleware to parse JSON request body

app.get('/ping', (req, res) => {
    res.send('Pong!');
});
// Start the Express.js server
const PORT: number = parseInt(process.env.PORT || '5000');
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
