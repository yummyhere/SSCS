/**
 * Product Class - Core e-commerce product with stock management
 * Demonstrates encapsulation and controlled modification of product properties
 */
class Product {
  constructor(id, name, price, stockQuantity, category = "", description = "", image = "") {
    this.id = id;
    this.name = name;
    this.price = price;
    this.stockQuantity = stockQuantity;
    this.category = category;
    this.description = description;
    this.image = image;
  }

  /**
   * Check if requested quantity is available in stock
   * @param {number} amount - The quantity to check
   * @returns {boolean} - True if stock is available, false otherwise
   */
  checkStock(amount) {
    if (amount < 1) {
      return false;
    }
    return this.stockQuantity >= amount;
  }

  /**
   * Reduce stock quantity after purchase
   * Ensures stock never goes negative through encapsulation
   * @param {number} amount - The quantity to reduce
   * @returns {boolean} - True if reduction was successful
   */
  reduceStock(amount) {
    if (!this.checkStock(amount)) {
      return false;
    }
    this.stockQuantity -= amount;
    return true;
  }

  /**
   * Get the final price (base price for regular products)
   * This method is overridden in DiscountedProduct to demonstrate polymorphism
   * @returns {number} - The final price
   */
  getFinalPrice() {
    return this.price;
  }

  /**
   * Get product details as object
   * @returns {object} - Product data
   */
  getProductData() {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
      stockQuantity: this.stockQuantity,
      category: this.category,
      description: this.description,
      image: this.image
    };
  }
}

export default Product;
