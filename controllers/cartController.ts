// controllers/cartController.ts
import { Request, Response } from 'express';
import { Pool, QueryResult } from 'pg';

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

// Retrieve the cart items for a specific customer
export const getCart = async (req: Request, res: Response) => {
    const { customer_id } = req.params;
    try {
        const client = await pool.connect();
        try {
            const query = `
                SELECT * FROM Cart_Item
                WHERE cart_id = (
                    SELECT cart_id FROM Cart
                    WHERE customer_id = $1
                )`;
            const result: QueryResult = await client.query(query, [customer_id]);
            res.json(result.rows);
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error retrieving cart items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Add an item to the cart
export const addToCart = async (req: Request, res: Response) => {
    const { cart_id, product_id, quantity } = req.body;
    try {
        const client = await pool.connect();
        try {
            const query = `
                INSERT INTO Cart_Item (cart_id, product_id, quantity)
                VALUES ($1, $2, $3)
                RETURNING *`;
            const result: QueryResult = await client.query(query, [cart_id, product_id, quantity]);
            res.status(201).json(result.rows[0]);
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Remove an item from the cart
export const removeFromCart = async (req: Request, res: Response) => {
    const { cart_item_id } = req.body;
    try {
        const client = await pool.connect();
        try {
            const query = `
                DELETE FROM Cart_Item
                WHERE cart_item_id = $1`;
            await client.query(query, [cart_item_id]);
            res.status(204).send();
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Clear the entire cart
export const clearCart = async (req: Request, res: Response) => {
    const { cart_id } = req.body;
    try {
        const client = await pool.connect();
        try {
            const query = `
                DELETE FROM Cart_Item
                WHERE cart_id = $1`;
            await client.query(query, [cart_id]);
            res.status(204).send();
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
