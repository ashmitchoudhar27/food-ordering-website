import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A restaurant must have a name'],
            trim: true,
        },
        image: {
            type: String,
            required: [true, 'A restaurant must have an image'],
        },
        description: {
            type: String,
            required: [true, 'A restaurant must have a description'],
        },
        address: {
            type: String,
            required: [true, 'A restaurant must have an address'],
        },
        rating: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be at least 1'],
            max: [5, 'Rating must be at most 5']
        },
        ratingCount: {
            type: Number,
            default: 0
        },
        deliveryTime: {
            type: String,
            default: '20-30 min'
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;
