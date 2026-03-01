import Cart from '../models/cartModel.js';
import FoodItem from '../models/foodItemModel.js';
import { catchAsync } from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const getCart = catchAsync(async (req, res, next) => {
    let cart = await Cart.findOne({ userId: req.user.id }).populate('items.foodId', 'name price image');

    if (!cart) {
        cart = await Cart.create({ userId: req.user.id, items: [] });
    }

    res.status(200).json({
        status: 'success',
        data: {
            cart,
        },
    });
});

export const addToCart = catchAsync(async (req, res, next) => {
    const { foodId, quantity } = req.body;
    const food = await FoodItem.findById(foodId);

    if (!food) {
        return next(new AppError('No food found with that ID', 404));
    }

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
        cart = await Cart.create({ userId: req.user.id, items: [] });
    }

    const itemIndex = cart.items.findIndex((item) => item.foodId.toString() === foodId);

    if (itemIndex > -1) {
        // Modify existing item
        cart.items[itemIndex].quantity += quantity;
        if (cart.items[itemIndex].quantity <= 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].totalAmount = cart.items[itemIndex].quantity * food.price;
        }
    } else if (quantity > 0) {
        // Add new item
        cart.items.push({
            foodId,
            quantity,
            totalAmount: quantity * food.price,
        });
    }

    await cart.save();
    await cart.populate('items.foodId', 'name price image');

    res.status(200).json({
        status: 'success',
        data: {
            cart,
        },
    });
});

export const removeFromCart = catchAsync(async (req, res, next) => {
    const { foodId } = req.params;

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
        return next(new AppError('Cart not found', 404));
    }

    cart.items = cart.items.filter((item) => item.foodId.toString() !== foodId);
    await cart.save();

    res.status(200).json({
        status: 'success',
        data: {
            cart,
        },
    });
});
