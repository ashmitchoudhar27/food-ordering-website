import express from 'express';
import { createOrder, getUserOrders, getAdminOrders, updateOrderStatus } from '../controllers/orderController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .post(createOrder);

router.route('/user')
    .get(getUserOrders);

router.route('/admin')
    .get(restrictTo('admin'), getAdminOrders);

router.route('/:id/status')
    .put(restrictTo('admin'), updateOrderStatus);

export default router;
