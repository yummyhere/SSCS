import mongoose from 'mongoose';

/**
 * Order Schema - Stores order information
 */
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product'
        },
        productName: String,
        quantity: {
          type: Number,
          required: true
        },
        unitPrice: {
          type: Number,
          required: true
        },
        finalPrice: {
          type: Number,
          required: true
        },
        subtotal: {
          type: Number,
          required: true
        }
      }
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending'
    },
    customerName: String,
    customerEmail: String,
    customerPhone: String,
    shippingAddress: {
      street: String,
      city: String,
      postalCode: String
    },
    paymentMethod: {
      type: String,
      default: "Credit Card"
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed'],
      default: 'Completed'
    }
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
