import express from 'express';
import multer from 'multer';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { catchAsync } from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Ensure temp directory exists
const tempDir = './temp';
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './temp')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })

router.post(
    '/',
    protect,
    restrictTo('admin'),
    upload.single('image'),
    catchAsync(async (req, res, next) => {

        if (!req.file) {
            return next(new AppError('Please upload an image file', 400));
        }

        const result = await uploadOnCloudinary(req.file.path);

        if (!result) {
            return next(new AppError('Error uploading image to Cloudinary', 500));
        }

        res.status(200).json({
            status: 'success',
            data: {
                url: result.secure_url,
                publicId: result.public_id
            }
        });
    }));

export default router;
