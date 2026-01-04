import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configuration (Ensure these are in your Vercel Environment Variables)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'products',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

const upload = multer({ storage });

export const uploadImage = (req, res) => {
  if (req.file && req.file.path) {
    res.send(req.file.path); // This returns the Cloudinary URL
  } else {
    res.status(400).send('Error uploading image');
  }
};

export { upload };