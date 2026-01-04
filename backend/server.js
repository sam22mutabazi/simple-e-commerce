import path from 'path'; 
import 'dotenv/config'; 
import express from 'express';
import cookieParser from 'cookie-parser'; 
import cors from 'cors'; // Added CORS
import connectDB from './config/db.js'; // Removed 'src/'

import productRoutes from './routes/productRoutes.js'; // Removed 'src/'
import userRoutes from './routes/userRoutes.js'; // Removed 'src/'
import orderRoutes from './routes/orderRoutes.js'; // Removed 'src/'
import uploadRoutes from './routes/uploadRoutes.js'; // Removed 'src/'

import { notFound, errorHandler } from './middleware/errorMiddleware.js'; // Removed 'src/'

// Connect to MongoDB
connectDB();    

const app = express();

// Middleware
app.use(cors()); // Enable CORS so frontend can connect
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes); 

const __dirname = path.resolve(); 

// Serving Static Uploads
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Note: For Vercel Monorepo, Vercel handles serving the frontend 
// via the 'rewrites' in vercel.json. We only need a simple root route here.
app.get("/", (req, res) => {
  res.send("E-Commerce API is running and ready ✅");
});

// Error Middleware
app.use(notFound);
app.use(errorHandler);

// --- VERCEL SPECIFIC EXPORT ---
export default app;

// Local Development Server
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000; 
    app.listen(PORT, () => {
      console.log(`Server running in development mode on port ${PORT}`);
    });
}