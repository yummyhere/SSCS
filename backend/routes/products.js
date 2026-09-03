import express from 'express';
import Product from '../models/Product.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * Get all products
 * Public endpoint with filtering and pagination
 */
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12, sort = 'createdAt' } = req.query;

    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .sort({ [sort]: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
});

/**
 * Get categories (for filter options)
 */
router.get('/categories/all', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
  }
});

/**
 * Get single product
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ message: 'Invalid product ID' });
  }
});

/**
 * Create product (Admin only)
 */
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, description, price, stockQuantity, category, image, discountPercentage } = req.body;

    // Validate required fields
    if (!name || price === undefined || stockQuantity === undefined) {
      return res.status(400).json({ message: 'Name, price, and stock quantity are required' });
    }

    const product = new Product({
      name,
      description,
      price,
      stockQuantity,
      category,
      image,
      discountPercentage: discountPercentage || 0
    });

    await product.save();

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
});

/**
 * Update product (Admin only)
 */
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, description, price, stockQuantity, category, image, discountPercentage } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = price;
    if (stockQuantity !== undefined) product.stockQuantity = stockQuantity;
    if (category) product.category = category;
    if (image) product.image = image;
    if (discountPercentage !== undefined) product.discountPercentage = discountPercentage;

    await product.save();

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
});

/**
 * Delete product (Admin only)
 */
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      message: 'Product deleted successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
});

export default router;
