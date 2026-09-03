/**
 * ShoppingCart Class - Manages cart items and checkout calculations
 * Demonstrates composition and object interaction with Product classes
 */
class ShoppingCart {
  constructor() {
    this.cartItems = [];
  }

  /**
   * Add an item to the cart - Main object-interaction logic
   * This demonstrates how ShoppingCart interacts with Product objects
   * @param {Product} product - Product object (can be Product or DiscountedProduct)
   * @param {number} quantity - Quantity to add
   * @returns {object} - Status object with success flag and message
   */
  addItem(product, quantity) {
    // Validate inputs
    if (!product || quantity < 1) {
      return {
        success: false,
        message: "Invalid product or quantity"
      };
    }

    // Check stock using product's checkStock method (object interaction)
    if (!product.checkStock(quantity)) {
      return {
        success: false,
        message: "Out of stock!"
      };
    }

    // Check if product is already in cart
    const existingItem = this.cartItems.find(item => item.product.id === product.id);

    if (existingItem) {
      // Product exists in cart, check if we can add more
      const newQuantity = existingItem.quantity + quantity;
      if (!product.checkStock(newQuantity - existingItem.quantity)) {
        return {
          success: false,
          message: "Not enough stock for this quantity"
        };
      }
      existingItem.quantity = newQuantity;
    } else {
      // Add new product to cart
      this.cartItems.push({
        product: product,
        quantity: quantity
      });
    }

    // Reduce stock (object interaction)
    product.reduceStock(quantity);

    return {
      success: true,
      message: "Product added to cart",
      cartItem: {
        productId: product.id,
        productName: product.name,
        quantity: quantity
      }
    };
  }

  /**
   * Remove an item from the cart
   * @param {string} productId - Product ID to remove
   * @returns {object} - Status object
   */
  removeItem(productId) {
    const itemIndex = this.cartItems.findIndex(item => item.product.id === productId);
    
    if (itemIndex === -1) {
      return {
        success: false,
        message: "Product not found in cart"
      };
    }

    this.cartItems.splice(itemIndex, 1);
    return {
      success: true,
      message: "Product removed from cart"
    };
  }

  /**
   * Update quantity of item in cart
   * @param {string} productId - Product ID to update
   * @param {number} newQuantity - New quantity
   * @returns {object} - Status object
   */
  updateQuantity(productId, newQuantity) {
    const item = this.cartItems.find(item => item.product.id === productId);
    
    if (!item) {
      return {
        success: false,
        message: "Product not found in cart"
      };
    }

    if (newQuantity < 1) {
      return this.removeItem(productId);
    }

    item.quantity = newQuantity;
    return {
      success: true,
      message: "Quantity updated"
    };
  }

  /**
   * Calculate total price of cart using polymorphism
   * Uses product.getFinalPrice() which works for both Product and DiscountedProduct
   * @returns {number} - Total price
   */
  calculateTotal() {
    return this.cartItems.reduce((total, item) => {
      // Polymorphic behavior: works with both Product and DiscountedProduct
      const itemTotal = item.product.getFinalPrice() * item.quantity;
      return total + itemTotal;
    }, 0);
  }

  /**
   * Get cart summary
   * @returns {object} - Cart data
   */
  getCartSummary() {
    return {
      items: this.cartItems.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: item.product.price,
        finalPrice: item.product.getFinalPrice(),
        subtotal: item.product.getFinalPrice() * item.quantity,
        discount: item.product.price - item.product.getFinalPrice()
      })),
      total: this.calculateTotal(),
      itemCount: this.cartItems.length
    };
  }

  /**
   * Print formatted receipt
   * @returns {string} - Formatted receipt
   */
  printReceipt() {
    if (this.cartItems.length === 0) {
      return "Cart is empty";
    }

    let receipt = "\n========== RECEIPT ==========\n";
    receipt += "Order Details:\n";
    receipt += "-".repeat(50) + "\n";
    receipt += "Product Name          | Qty | Unit Price | Discount | Subtotal\n";
    receipt += "-".repeat(50) + "\n";

    this.cartItems.forEach(item => {
      const product = item.product;
      const quantity = item.quantity;
      const originalPrice = product.price;
      const finalPrice = product.getFinalPrice();
      const discount = originalPrice - finalPrice;
      const subtotal = finalPrice * quantity;

      const name = product.name.padEnd(20);
      const qty = String(quantity).padEnd(4);
      const unitPrice = `$${originalPrice.toFixed(2)}`.padEnd(10);
      const discountStr = `$${discount.toFixed(2)}`.padEnd(8);
      const subtotalStr = `$${subtotal.toFixed(2)}`;

      receipt += `${name}| ${qty}| ${unitPrice}| ${discountStr}| ${subtotalStr}\n`;
    });

    receipt += "-".repeat(50) + "\n";
    const total = this.calculateTotal();
    receipt += `GRAND TOTAL: $${total.toFixed(2)}\n`;
    receipt += "==============================\n";

    return receipt;
  }

  /**
   * Clear the cart
   */
  clear() {
    this.cartItems = [];
  }

  /**
   * Get all items in cart
   * @returns {array} - Cart items
   */
  getItems() {
    return this.cartItems;
  }

  /**
   * Check if cart is empty
   * @returns {boolean}
   */
  isEmpty() {
    return this.cartItems.length === 0;
  }
}

export default ShoppingCart;
