import * as dotenv from 'dotenv';
import { Application, Request, Response } from 'express';
import { Pool, QueryResult } from 'pg';
import express = require('express')
dotenv.config();

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
app.use(express.json());

// Function to add a product to the cart
export const addToCart = async (req: Request, res: Response) => {
    // Extract required data from request body
    const { product_id, quantity, customer_id } = req.body;
    
    try {
        // Connect to the database
        const client = await pool.connect();

        try {
            let cartId = req.body.cart_id;
            if (!cartId) {
                // If cart_id is not provided, create a new cart
                const createCartQuery = `
                    INSERT INTO Cart (customer_id)
                    VALUES ($1)
                    RETURNING cart_item_id`; // Assuming cart_id is renamed to cart_item_id
                const createCartValues = [customer_id];
                const createCartResult = await client.query(createCartQuery, createCartValues);
                cartId = createCartResult.rows[0].cart_item_id; // Assuming cart_id is renamed to cart_item_id
            }

            // Insert the product into the cart as a cart item
            const query = `
                INSERT INTO Cart_Item (cart_id, product_id, quantity)
                VALUES ($1, $2, $3)
                RETURNING *`;
            const result: QueryResult = await client.query(query, [cartId, product_id, quantity]);

            // Send response with the newly added cart item
            res.status(201).json(result.rows[0]);
        } finally {
            // Release the client
            client.release();
        }
    } catch (error) {
        // Handle errors
        console.error('Error adding item to cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



// Function to remove a product from the cart
export const removeFromCart = async (req: Request, res: Response) => {
    // Extract required data from request body
    const { cart_item_id } = req.body;

    try {
        // Connect to the database
        const client = await pool.connect();

        try {
            // Execute SQL query to delete the product from the cart
            const query = `
                DELETE FROM Cart_Item
                WHERE cart_item_id = $1`;
            await client.query(query, [cart_item_id]);

            // Send success response
            res.status(204).send();
        } finally {
            // Release the client
            client.release();
        }
    } catch (error) {
        // Handle errors
        console.error('Error removing item from cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to increment the quantity of a product in the cart
export const incrementQuantityInCart = async (req: Request, res: Response) => {
    // Extract required data from request body
    const { cart_item_id, quantity } = req.body;

    try {
        // Connect to the database
        const client = await pool.connect();

        try {
            // Execute SQL query to increment the quantity of the product in the cart
            const query = `
                UPDATE Cart_Item
                SET quantity = quantity + $2
                WHERE cart_item_id = $1`;
            await client.query(query, [cart_item_id, quantity]);

            // Send success response
            res.status(200).send('Quantity incremented successfully');
        } finally {
            // Release the client
            client.release();
        }
    } catch (error) {
        // Handle errors
        console.error('Error incrementing quantity in cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Define endpoints
app.post('/cart/add', addToCart);
app.post('/cart/remove', removeFromCart);
app.post('/cart/increment', incrementQuantityInCart);

// Ping endpoint
app.get('/ping', (req, res) => {
    res.send('Pong!');
});

// Start the server
const PORT: number = parseInt(process.env.PORT || '5000');
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});