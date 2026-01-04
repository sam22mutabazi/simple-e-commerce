import path from 'path'; 
import 'dotenv/config'; 
import express from 'express';
import cookieParser from 'cookie-parser'; 
import connectDB from './src/config/db.js'; 

import productRoutes from './src/routes/productRoutes.js'; 
import userRoutes from './src/routes/userRoutes.js'; 
import orderRoutes from './src/routes/orderRoutes.js'; 
import uploadRoutes from './src/routes/uploadRoutes.js'; 

import { notFound, errorHandler } from './src/middleware/errorMiddleware.js'; 

// Connect to MongoDB
connectDB();    

const app = express();

// Body Parser Middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes); 

const __dirname = path.resolve(); 

// --- STATIC FILES CONFIG ---
// Note: Vercel is read-only. Uploaded files won't persist unless you use Cloudinary,
// but this allows you to serve existing files in your folder.
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Serving Frontend
if (process.env.NODE_ENV === 'production') {
  // Point to the built frontend files
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else {
  app.get("/", (req, res) => {
    res.send("E-Commerce API is running and ready ✅");
  });
}

// Error Middleware
app.use(notFound);
app.use(errorHandler);

// --- VERCEL SPECIFIC EXPORT ---
// This is the most important part for Vercel!
export default app;

// Only start the server listener if we are NOT on Vercel (Local Dev)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000; 
    app.listen(PORT, () => {
      console.log(`Server running in development mode on port ${PORT}`);
    });
}