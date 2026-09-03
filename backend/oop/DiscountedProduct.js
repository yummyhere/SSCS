import Product from './Product.js';

/**
 * DiscountedProduct Class - Extends Product with discount functionality
 * Demonstrates inheritance and method extension
 */
class DiscountedProduct extends Product {
  constructor(id, name, price, stockQuantity, discountPercentage, category = "", description = "", image = "") {
    super(id, name, price, stockQuantity, category, description, image);
    this.discountPercentage = discountPercentage;
  }

  /**
   * Calculate and return the final price after discount
   * Demonstrates polymorphic behavior - same method name as parent, different behavior
   * @returns {number} - The discounted price
   */
  getFinalPrice() {
    const discountAmount = this.price * (this.discountPercentage / 100);
    return this.price - discountAmount;
  }

  /**
   * Get discount information
   * @returns {object} - Discount details
   */
  getDiscountInfo() {
    return {
      originalPrice: this.price,
      discountPercentage: this.discountPercentage,
      discountAmount: this.price * (this.discountPercentage / 100),
      finalPrice: this.getFinalPrice()
    };
  }

  /**
   * Override parent getProductData to include discount info
   * @returns {object} - Product data with discount
   */
  getProductData() {
    const parentData = super.getProductData();
    return {
      ...parentData,
      discountPercentage: this.discountPercentage,
      finalPrice: this.getFinalPrice()
    };
  }
}

export default DiscountedProduct;
