import mongoose from 'mongoose';

const foodItemSchema = new mongoose.Schema(
    {
        restaurantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Restaurant',
            required: [true, 'Food item must belong to a restaurant'],
        },
        name: {
            type: String,
            required: [true, 'Food item must have a name'],
            trim: true,
        },
        image: {
            type: String,
            required: [true, 'Food item must have an image'],
        },
        price: {
            type: Number,
            required: [true, 'Food item must have a price'],
            min: [0, 'Price must be positive'],
        },
        category: {
            type: String,
            required: [true, 'Food item must have a category'],
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const FoodItem = mongoose.model('FoodItem', foodItemSchema);

export default FoodItem;
