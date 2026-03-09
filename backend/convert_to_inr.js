import mongoose from 'mongoose';
import dotenv from 'dotenv';
import FoodItem from './models/foodItemModel.js';

dotenv.config();

const convertToINR = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const items = await FoodItem.find({});

        console.log(`Found ${items.length} items. Converting prices...`);

        for (const item of items) {
            // Roughly 1 USD = 70 INR for "average" pricing feel
            const oldPrice = item.price;
            const newPrice = Math.round(oldPrice * 70);
            item.price = newPrice;
            await item.save();
            console.log(`Converted ${item.name}: $${oldPrice} -> ₹${newPrice}`);
        }

        console.log('Conversion complete!');
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

convertToINR();
