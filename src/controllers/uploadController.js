import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// This controller now handles the upload logic
const uploadImage = (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('No file uploaded.');
    }

    // Use a stream to upload the file buffer to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'BloggIt_Uploads', // Optional: specify a folder
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary Upload Error:', error);
          // Manually pass the error to the error handling middleware
          return next(new Error('Failed to upload image to cloud service.'));
        }
        
        // If upload is successful, send back the URL
        res.status(200).json({
          message: 'Image uploaded successfully',
          url: result.secure_url,
        });
      }
    );

    // Pipe the file buffer from multer into the upload stream
    uploadStream.end(req.file.buffer);

  } catch (error) {
    next(error); // Pass other errors (like 'No file uploaded') to the handler
  }
};

export { uploadImage };