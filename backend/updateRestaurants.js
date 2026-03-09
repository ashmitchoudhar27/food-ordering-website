import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Restaurant from './models/restaurantModel.js';
import fs from 'fs';

dotenv.config();

const updateRestaurants = async () => {
    try {
        await connectDB();
        console.log('MongoDB Connected');

        const restaurants = await Restaurant.find();

        const deliveryTimes = ['15-25 min', '20-30 min', '30-45 min', '40-55 min', '10-20 min'];

        for (const restaurant of restaurants) {
            const randomRating = (Math.random() * (5.0 - 3.8) + 3.8).toFixed(1);
            const randomCount = Math.floor(Math.random() * 450) + 50;
            const randomDeliveryTime = deliveryTimes[Math.floor(Math.random() * deliveryTimes.length)];

            restaurant.rating = parseFloat(randomRating);
            restaurant.ratingCount = randomCount;
            restaurant.deliveryTime = randomDeliveryTime;

            await restaurant.save();
        }

        console.log('All restaurants updated successfully!');
        fs.writeFileSync('success.txt', 'Done');
        process.exit();
    } catch (error) {
        fs.writeFileSync('error.txt', error.toString() + error.stack);
        process.exit(1);
    }
};

updateRestaurants();
