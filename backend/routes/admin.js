import express from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * Get admin dashboard statistics
 */
router.get('/dashboard', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    // Calculate revenue from completed orders
    const orderStats = await Order.aggregate([
      { $match: { paymentStatus: 'Completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    
    const totalRevenue = orderStats.length > 0 ? orderStats[0].totalRevenue : 0;

    // Get pending orders count
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });

    // Get low-stock products
    const lowStockProducts = await Product.find({ stockQuantity: { $lte: 5 } }).limit(10);

    res.json({
      statistics: {
        totalProducts,
        totalUsers,
        totalOrders,
        totalRevenue: totalRevenue.toFixed(2),
        pendingOrders,
        lowStockProducts: lowStockProducts.map(p => ({
          id: p._id,
          name: p.name,
          stock: p.stockQuantity
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard statistics', error: error.message });
  }
});

/**
 * Get all users (Admin only)
 */
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    
    // Add order count for each user
    const usersWithOrders = await Promise.all(
      users.map(async (user) => {
        const orderCount = await Order.countDocuments({ userId: user._id });
        return {
          ...user.toObject(),
          orderCount
        };
      })
    );

    res.json({
      users: usersWithOrders.length > 0 ? usersWithOrders : [],
      message: usersWithOrders.length === 0 ? 'No users found' : undefined
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

/**
 * Get all orders (Admin only)
 */
router.get('/orders', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    let filter = {};
    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      orders: orders.length > 0 ? orders : [],
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      message: orders.length === 0 ? 'No orders found' : undefined
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

/**
 * Update order status (Admin only)
 */
router.put('/orders/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      message: 'Order status updated',
      order
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order status', error: error.message });
  }
});

/**
 * Get order details (Admin only)
 */
router.get('/orders/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order', error: error.message });
  }
});

export default router;
