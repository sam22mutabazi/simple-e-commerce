import path from 'path'; 
import { fileURLToPath } from 'url'; 
import 'dotenv/config'; 
import express from 'express';
import cookieParser from 'cookie-parser'; 
import cors from 'cors'; 
import connectDB from './config/db.js'; 

import productRoutes from './routes/productRoutes.js'; 
import userRoutes from './routes/userRoutes.js'; 
import orderRoutes from './routes/orderRoutes.js'; 
import uploadRoutes from './routes/uploadRoutes.js'; 

import { notFound, errorHandler } from './middleware/errorMiddleware.js'; 

// ES Modules __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
connectDB();    

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes); 

// Health Check / Root Route
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