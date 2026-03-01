import Order from '../models/orderModel.js';
import Cart from '../models/cartModel.js';
import { catchAsync } from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { getIO } from '../utils/socket.js';

export const createOrder = catchAsync(async (req, res, next) => {
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.foodId', 'name price');

    if (!cart || cart.items.length === 0) {
        return next(new AppError('Your cart is empty', 400));
    }

    const { deliveryAddress, paymentMethod } = req.body;

    if (!deliveryAddress || !paymentMethod) {
        return next(new AppError('Please provide delivery address and payment method', 400));
    }

    // Create snapshot array for order safety (price shouldn't change historically)
    const orderItems = cart.items.map(item => ({
        foodId: item.foodId._id,
        name: item.foodId.name,
        price: item.foodId.price,
        quantity: item.quantity,
        totalAmount: item.totalAmount
    }));

    const newOrder = await Order.create({
        userId: req.user.id,
        items: orderItems,
        deliveryAddress,
        paymentMethod,
        status: 'Pending',
    });

    // Empty the cart after successful order placement
    cart.items = [];
    await cart.save();

    // Broadcast new order to admins
    getIO().emit('newOrder', newOrder);

    res.status(201).json({
        status: 'success',
        data: {
            order: newOrder,
        },
    });
});

export const getUserOrders = catchAsync(async (req, res, next) => {
    const orders = await Order.find({ userId: req.user.id }).sort('-createdAt');

    res.status(200).json({
        status: 'success',
        results: orders.length,
        data: {
            orders,
        },
    });
});

export const getAdminOrders = catchAsync(async (req, res, next) => {
    const orders = await Order.find().populate('userId', 'name email').sort('-createdAt');

    res.status(200).json({
        status: 'success',
        results: orders.length,
        data: {
            orders,
        },
    });
});

export const updateOrderStatus = catchAsync(async (req, res, next) => {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
        return next(new AppError('Invalid status value', 400));
    }

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, {
        new: true,
        runValidators: true,
    });

    if (!order) {
        return next(new AppError('No order found with that ID', 404));
    }

    // Broadcast updated order status to user and admins
    getIO().emit('orderStatusUpdated', order);

    res.status(200).json({
        status: 'success',
        data: {
            order,
        },
    });
});
