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

// --- CRITICAL ADDITION FOR IMAGE UPLOADS ---
// This makes the 'uploads' folder accessible to the browser
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Serving Frontend in Production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else {
  app.get("/", (req, res) => {
    res.send("E-Commerce API is running and ready ✅");
  });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});