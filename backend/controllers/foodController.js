import FoodItem from '../models/foodItemModel.js';
import Restaurant from '../models/restaurantModel.js';
import { catchAsync } from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const getFoodsByRestaurant = catchAsync(async (req, res, next) => {
    const foods = await FoodItem.find({ restaurantId: req.params.restaurantId });

    res.status(200).json({
        status: 'success',
        results: foods.length,
        data: {
            foods,
        },
    });
});

export const createFood = catchAsync(async (req, res, next) => {
    // Check if restaurant exists
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) {
        return next(new AppError('No restaurant found with that ID', 404));
    }

    const newFood = await FoodItem.create({
        ...req.body,
        restaurantId: req.params.restaurantId
    });

    res.status(201).json({
        status: 'success',
        data: {
            food: newFood,
        },
    });
});

export const updateFood = catchAsync(async (req, res, next) => {
    const food = await FoodItem.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!food) {
        return next(new AppError('No food item found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            food,
        },
    });
});

export const deleteFood = catchAsync(async (req, res, next) => {
    const food = await FoodItem.findByIdAndDelete(req.params.id);

    if (!food) {
        return next(new AppError('No food item found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});
