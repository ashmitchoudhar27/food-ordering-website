import Restaurant from '../models/restaurantModel.js';
import FoodItem from '../models/foodItemModel.js';
import { catchAsync } from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const getAllRestaurants = catchAsync(async (req, res, next) => {
    let query = {};

    if (req.query.category && req.query.category !== 'All') {
        const foods = await FoodItem.find({
            $or: [
                { category: { $regex: new RegExp(req.query.category, 'i') } },
                { name: { $regex: new RegExp(req.query.category, 'i') } }
            ]
        });
        const restaurantIds = foods.map(f => f.restaurantId);
        query._id = { $in: restaurantIds };
    }

    const restaurants = await Restaurant.find(query);

    res.status(200).json({
        status: 'success',
        results: restaurants.length,
        data: {
            restaurants,
        },
    });
});

export const getRestaurant = catchAsync(async (req, res, next) => {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
        return next(new AppError('No restaurant found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            restaurant,
        },
    });
});

export const createRestaurant = catchAsync(async (req, res, next) => {
    const newRestaurant = await Restaurant.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            restaurant: newRestaurant,
        },
    });
});

export const updateRestaurant = catchAsync(async (req, res, next) => {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!restaurant) {
        return next(new AppError('No restaurant found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            restaurant,
        },
    });
});

export const deleteRestaurant = catchAsync(async (req, res, next) => {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);

    if (!restaurant) {
        return next(new AppError('No restaurant found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});
