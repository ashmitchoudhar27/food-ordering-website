import express from 'express';
import {
    getAllRestaurants,
    getRestaurant,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
} from '../controllers/restaurantController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getAllRestaurants)
    .post(protect, restrictTo('admin'), createRestaurant);

router.route('/:id')
    .get(getRestaurant)
    .put(protect, restrictTo('admin'), updateRestaurant)
    .delete(protect, restrictTo('admin'), deleteRestaurant);

export default router;
