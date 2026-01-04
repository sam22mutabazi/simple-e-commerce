import express from 'express';
const router = express.Router();
import { 
    addOrderItems, 
    getMyOrders, 
    getOrderById, 
    updateOrderToDelivered, 
    getOrders, 
    getOrderSummary, 
    getMonthlySales, 
    getTopProducts, 
    verifyMomoToken,
    updateOrderToPaidManual // Added this
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// --- Base Routes ---
router.route('/')
    .post(protect, addOrderItems)
    .get(protect, admin, getOrders);

router.route('/mine').get(protect, getMyOrders);

// --- Statistics & Admin Analytics ---
// (MUST stay above /:id routes to prevent routing conflicts)
router.route('/summary').get(protect, admin, getOrderSummary);
router.route('/sales-data').get(protect, admin, getMonthlySales);
router.route('/top-products').get(protect, admin, getTopProducts);

// --- Payment & Verification Routes ---
router.route('/:id/verify-momo').post(protect, verifyMomoToken);

// New route for Admin to manually approve Momo/Cash payments
router.route('/:id/pay-manual').put(protect, admin, updateOrderToPaidManual);

// --- Individual Order Management ---
router.route('/:id').get(protect, getOrderById);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

export default router;