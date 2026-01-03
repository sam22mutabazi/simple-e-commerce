import mongoose from 'mongoose';
import dotenv from 'dotenv';         
import users from './src/data/users.js';         // Matches your new users path
import products from './src/data/products.js';   // Matches your products path
import User from './src/models/UserModel.js';
import Product from './src/models/productModel.js'; 
import connectDB from './src/config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    // 1. Clear existing data to prevent duplicates and errors
    await Product.deleteMany();
    await User.deleteMany();

    // 2. Insert the users first
    const createdUsers = await User.insertMany(users);

    // 3. Identify the Admin User (the first one in your users.js array)
    const adminUser = createdUsers[0]._id;

    // 4. Link every product to the Admin User (Required by your model)
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    // 5. Save the 8 products to the database
    await Product.insertMany(sampleProducts);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}