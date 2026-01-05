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
    getCategories,
    getAdminProducts 
} from '../controllers/productController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

// 1. Static/Specific Routes (Must come first!)
router.route('/').get(getProducts).post(protect, admin, createProduct); 
router.route('/admin').get(protect, admin, getAdminProducts);
router.route('/categories').get(getCategories);
router.route('/lowstock').get(protect, admin, getLowStockProducts);

// 2. Dynamic Routes (Must come last)
router.route('/:id/reviews').post(protect, createProductReview);

router.route('/:id')
    .get(getProductById)
    .put(protect, admin, updateProduct)
    .delete(protect, admin, deleteProduct);

export default router;