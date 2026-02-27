import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FoodItem',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
});

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        items: [orderItemSchema],
        deliveryAddress: {
            type: String,
            required: [true, 'Order must have a delivery address'],
        },
        paymentMethod: {
            type: String,
            enum: ['COD', 'Online'],
            required: [true, 'Order must have a payment method'],
        },
        status: {
            type: String,
            enum: ['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
            default: 'Pending',
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
