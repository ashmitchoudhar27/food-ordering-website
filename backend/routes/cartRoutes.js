import express from 'express';
import { getCart, addToCart, removeFromCart } from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All cart routes are protected for standard logged in users

router.route('/')
    .get(getCart);

router.route('/add')
    .post(addToCart);

router.route('/remove/:foodId')
    .delete(removeFromCart);

export default router;
