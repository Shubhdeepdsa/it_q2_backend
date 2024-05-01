import express = require('express')

import { getCart, addToCart, removeFromCart, clearCart } from '../controllers/cartController';

const router = express.Router();

router.get('/:customer_id', getCart);
router.post('/add', addToCart);
router.post('/remove', removeFromCart);
router.post('/clear', clearCart);

export default router;