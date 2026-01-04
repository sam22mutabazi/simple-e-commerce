import asyncHandler from 'express-async-handler';
import Order from '../models/OrderModel.js';
import Product from '../models/ProductModel.js';
import User from '../models/UserModel.js';
import Flutterwave from 'flutterwave-node-v3';

const getFlwInstance = () => {
    const publicKey = process.env.FLW_PUBLIC_KEY;
    const secretKey = process.env.FLW_SECRET_KEY;
    if (!publicKey || !secretKey) throw new Error('Flutterwave API keys are missing in .env');
    return new Flutterwave(publicKey, secretKey);
};

// @desc    Admin manually marks order as paid (Manual Momo/Cash)
// @route   PUT /api/orders/:id/pay-manual
export const updateOrderToPaidManual = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        if (order.isPaid) {
            res.status(400);
            throw new Error('Order is already marked as paid');
        }
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: 'MANUAL-' + Date.now(),
            status: 'ADMIN_APPROVED',
            update_time: new Date().toISOString(),
            email_address: req.user.email,
        };
        const updatedOrder = await order.save();
        
        // Stock Reduction
        for (const item of order.orderItems) {
            await Product.findByIdAndUpdate(item.product, { $inc: { countInStock: -item.qty } });
        }
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Verify Flutterwave Payment
export const verifyMomoToken = asyncHandler(async (req, res) => {
    const { flw_ref } = req.body;
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    
    if (!order) { res.status(404); throw new Error('Order not found'); }
    if (order.isPaid) return res.json(order);

    const flw = getFlwInstance();
    try {
        const response = await flw.Transaction.verify({ id: String(flw_ref) });
        if (response.data?.status === 'successful' && response.data?.amount >= order.totalPrice) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = { 
                id: response.data.id, 
                status: response.data.status, 
                update_time: response.data.created_at, 
                email_address: order.user.email 
            };
            const updatedOrder = await order.save();
            for (const item of order.orderItems) {
                await Product.findByIdAndUpdate(item.product, { $inc: { countInStock: -item.qty } });
            }
            res.json(updatedOrder);
        } else { 
            res.status(400); 
            throw new Error('Payment verification failed.'); 
        }
    } catch (error) { 
        res.status(500); 
        throw new Error(error.message); 
    }
});

export const addOrderItems = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;
    if (orderItems?.length === 0) { res.status(400); throw new Error('No items in order'); }
    const order = new Order({
        orderItems: orderItems.map((x) => ({ ...x, product: x.product || x._id, _id: undefined })),
        user: req.user._id, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice,
    });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
});

export const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (order) res.json(order);
    else { res.status(404); throw new Error('Order not found'); }
});

export const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        res.json(await order.save());
    } else { res.status(404); throw new Error('Order not found'); }
});

export const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
});

export const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
});

// --- UPDATED Dashboard Summary ---
export const getOrderSummary = asyncHandler(async (req, res) => {
    const orders = await Order.find({});
    const numUsers = await User.countDocuments();
    const numProducts = await Product.countDocuments(); // Count unique products
    const totalSales = orders.reduce((acc, order) => acc + (order.isPaid ? order.totalPrice : 0), 0);
    
    // Calculate total units across all products
    const products = await Product.find({});
    const totalStockUnits = products.reduce((acc, product) => acc + (product.countInStock || 0), 0);
    
    res.json({ 
        numOrders: orders.length, 
        totalSales, 
        numUsers, 
        numProducts, 
        totalStockUnits 
    });
});

export const getCustomerInsights = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');
    const orders = await Order.find({ isPaid: true });
    const userSpending = users.map(user => ({
        _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin,
        totalSpent: orders.filter(o => o.user?.toString() === user._id.toString()).reduce((a, b) => a + b.totalPrice, 0)
    }));
    res.json(userSpending);
});

export const getMonthlySales = asyncHandler(async (req, res) => {
    const salesData = await Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: { $month: "$paidAt" }, totalSales: { $sum: "$totalPrice" } } },
        { $sort: { "_id": 1 } },
    ]);
    const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    res.json(salesData.map(i => ({ name: monthNames[i._id], sales: i.totalSales })));
});

export const getTopProducts = asyncHandler(async (req, res) => {
    const products = await Order.aggregate([
        { $match: { isPaid: true } },
        { $unwind: "$orderItems" },
        { $group: { _id: "$orderItems.name", qty: { $sum: "$orderItems.qty" } } },
        { $sort: { qty: -1 } }, { $limit: 5 }
    ]);
    res.json(products.map(p => ({ name: p._id, quantity: p.qty })));
});