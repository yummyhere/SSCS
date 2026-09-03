import express from 'express';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * Create order (Checkout)
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, shippingAddress, city, postalCode, paymentMethod } = req.body;

    // Validate input
    if (!customerName || !customerEmail || !shippingAddress || !city || !postalCode) {
      return res.status(400).json({ message: 'All shipping information is required' });
    }

    // Get user's cart
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Prepare order items and validate stock
    const orderItems = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      const product = item.productId;

      // Verify stock is still available (backend validation)
      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}, Requested: ${item.quantity}` 
        });
      }

      const finalPrice = product.discountPercentage 
        ? product.price * (1 - product.discountPercentage / 100)
        : product.price;

      const subtotal = finalPrice * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        productId: product._id,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
        finalPrice: finalPrice,
        subtotal: subtotal
      });

      // Reduce product stock
      product.stockQuantity -= item.quantity;
      await product.save();
    }

    // Create order
    const order = new Order({
      userId: req.user.id,
      items: orderItems,
      totalAmount,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress: {
        street: shippingAddress,
        city,
        postalCode
      },
      paymentMethod: paymentMethod || 'Credit Card',
      status: 'Pending',
      paymentStatus: 'Completed'
    });

    await order.save();

    // Clear user's cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: 'Order created successfully',
      order: {
        orderId: order._id,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
});

/**
 * Get user's orders
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.json({
      orders: orders.length > 0 ? orders : [],
      message: orders.length === 0 ? 'You haven\'t placed any orders yet' : undefined
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

/**
 * Get single order
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order', error: error.message });
  }
});

export default router;
