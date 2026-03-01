import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configuration occurs in server startup but can be re-assured here
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Uploads a local file stream to Cloudinary uniquely
 * @param {string} localFilePath - The temporary multer file path
 * @returns {Promise<Object>} The Cloudinary uploaded entity parameters
 */
export const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // Upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "antigravity"
        });

        // File has been uploaded successfull
        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        // Remove the locally saved temporary file as the upload operation failed
        fs.unlinkSync(localFilePath);
        return null;
    }
};

/**
 * Destroys an existing asset on Cloudinary to manage space
 * @param {string} publicId - Cloudinary Asset Reference Id
 */
export const deleteFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error("Cloudinary Deletion Error", error);
    }
};
