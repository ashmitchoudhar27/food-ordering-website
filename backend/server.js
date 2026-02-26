import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import http from 'http';
import { initSocket } from './utils/socket.js';

import connectDB from './config/db.js';
import { globalErrorHandler } from './middleware/errorHandler.js';
import AppError from './utils/appError.js';
import authRouter from './routes/authRoutes.js';
import restaurantRouter from './routes/restaurantRoutes.js';
import foodRouter from './routes/foodRoutes.js';
import cartRouter from './routes/cartRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import uploadRouter from './routes/uploadRoutes.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json()); // Body parser
app.use(cors()); // Enable CORS
app.use(helmet()); // Set security headers
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev')); // HTTP request logger
}

// Routes hookup
app.use('/api/auth', authRouter);
app.use('/api/restaurants', restaurantRouter);
app.use('/api/foods', foodRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);
app.use('/api/upload', uploadRouter);

app.get('/', (req, res) => {
    res.send('Antigravity API is running...');
});

// Handle undefined Routes
app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler Middleware
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
