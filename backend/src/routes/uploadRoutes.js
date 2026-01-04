import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

const router = express.Router();

// 1. Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Use Memory Storage (Keeps file in RAM as a buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 3. The Upload Route
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: 'No file uploaded' });
    }

    // Stream the buffer to Cloudinary
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'ecommerce_products',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );

        // Send the file buffer to the stream
        stream.end(req.file.buffer);
      });
    };

    const result = await streamUpload(req);

    res.send({
      message: 'Image Uploaded to Cloudinary ✅',
      image: result.secure_url, // This is the full HTTPS URL
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Server Error during upload' });
  }
});

export default router;