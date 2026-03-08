import mongoose from 'mongoose';
import dotenv from 'dotenv';
import FoodItem from './models/foodItemModel.js';

dotenv.config();

const checkCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const categories = await FoodItem.distinct('category');
        console.log('--- UNIQUE FOOD CATEGORIES ---');
        console.log(categories);

        const items = await FoodItem.find({});
        console.log('\n--- FOOD ITEMS (NAME - CATEGORY) ---');
        items.forEach(item => {
            console.log(`${item.name} - ${item.category}`);
        });

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkCategories();
