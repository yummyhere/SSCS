import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * Get user's cart
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id }).populate({
      path: 'items.productId',
      model: 'Product'
    });

    if (!cart) {
      // Create empty cart if doesn't exist
      cart = new Cart({ userId: req.user.id, items: [] });
      await cart.save();
    }

    // Calculate totals
    let total = 0;
    const items = cart.items.map(item => {
      const finalPrice = item.productId.discountPercentage 
        ? item.productId.price * (1 - item.productId.discountPercentage / 100)
        : item.productId.price;
      
      const subtotal = finalPrice * item.quantity;
      total += subtotal;

      return {
        productId: item.productId._id,
        productName: item.productId.name,
        quantity: item.quantity,
        unitPrice: item.productId.price,
        finalPrice,
        discount: item.productId.discountPercentage || 0,
        subtotal
      };
    });

    res.json({
      cart: {
        userId: cart.userId,
        items,
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch cart', error: error.message });
  }
});

/**
 * Add item to cart
 */
router.post('/items', authMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ message: 'Invalid product or quantity' });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check stock availability
    if (product.stockQuantity < quantity) {
      return res.status(400).json({ message: 'Out of stock!' });
    }

    // Get or create cart
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    // Check if product is already in cart
    const existingItem = cart.items.find(item => item.productId.toString() === productId);

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (product.stockQuantity < newQuantity) {
        return res.status(400).json({ message: 'Not enough stock for this quantity' });
      }
      existingItem.quantity = newQuantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();

    res.status(201).json({
      message: 'Product added to cart',
      cart
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add item to cart', error: error.message });
  }
});

/**
 * Update cart item quantity
 */
router.put('/items/:productId', authMiddleware, async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    if (quantity < 0) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find(item => item.productId.toString() === productId);
    if (!item) {
      return res.status(404).json({ message: 'Item not in cart' });
    }

    if (quantity === 0) {
      cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    } else {
      if (product.stockQuantity < quantity) {
        return res.status(400).json({ message: 'Not enough stock' });
      }
      item.quantity = quantity;
    }

    await cart.save();

    res.json({
      message: 'Cart updated',
      cart
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update cart', error: error.message });
  }
});

/**
 * Remove item from cart
 */
router.delete('/items/:productId', authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();

    res.json({
      message: 'Item removed from cart',
      cart
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove item', error: error.message });
  }
});

/**
 * Clear cart
 */
router.delete('/', authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();

    res.json({
      message: 'Cart cleared',
      cart
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to clear cart', error: error.message });
  }
});

export default router;
