import express from 'express';
import {
    getFoodsByRestaurant,
    createFood,
    updateFood,
    deleteFood,
} from '../controllers/foodController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

// Routes that don't need restaurantId in the URL
// Wait, the PRD says:
// GET /api/foods/:restaurantId
// POST /api/foods/:restaurantId (Admin)
// PUT /api/foods/:id (Admin)
// DELETE /api/foods/:id (Admin)

router.route('/restaurant/:restaurantId')
    .get(getFoodsByRestaurant)
    .post(protect, restrictTo('admin'), createFood);

router.route('/:id')
    .put(protect, restrictTo('admin'), updateFood)
    .delete(protect, restrictTo('admin'), deleteFood);

export default router;
