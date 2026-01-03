// src/models/CartModel.js
const mongoose = require('mongoose');

// --- 1. Define the Cart Item Schema ---
// This schema defines what a single product entry inside the cart will look like.
const cartItemSchema = mongoose.Schema({
    // Reference to the Product model (we will create this model later)
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product', 
    },
    // The name of the product (for quick display)
    name: {
        type: String,
        required: true,
    },
    // The image of the product (for quick display)
    image: {
        type: String,
        required: true,
    },
    // The current price of the item
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    // The quantity the user wants to buy
    qty: {
        type: Number,
        required: true,
        default: 1,
    },
});


// --- 2. Define the Main Cart Schema ---
const cartSchema = mongoose.Schema({
    // Reference to the User model (who owns this cart)
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    // The array containing all the items in the cart
    cartItems: [cartItemSchema],
    
    // Total price accumulator (optional, but useful for calculating subtotals)
    itemsPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
});


// --- 3. Export the Model ---
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;