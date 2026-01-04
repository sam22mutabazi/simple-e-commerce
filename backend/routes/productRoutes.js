import express from 'express';
const router = express.Router();
import { 
    getProducts, 
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    getLowStockProducts,
    getCategories // 1. IMPORTED
} from '../controllers/productController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

// Base route
router.route('/')
    .get(getProducts)
    .post(protect, admin, createProduct); 

// 2. CATEGORIES ROUTE (MUST BE ABOVE /:id)
router.route('/categories').get(getCategories);

// Low stock route
router.route('/lowstock').get(protect, admin, getLowStockProducts);

// Review route
router.route('/:id/reviews').post(protect, createProductReview);

// ID-based routes
router.route('/:id')
    .get(getProductById)
    .put(protect, admin, updateProduct)
    .delete(protect, admin, deleteProduct);

export default router;