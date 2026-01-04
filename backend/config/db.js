import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // This connects using the MONGO_URI from your .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Exit process on failure
    process.exit(1); 
  }
};

// This matches the "import connectDB" in your server.js
export default connectDB;