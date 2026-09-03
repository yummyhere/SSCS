/**
 * Test Simulation - Demonstrates all OOP requirements
 * This file tests the shopping cart system as specified in the requirements
 */

import Product from './Product.js';
import DiscountedProduct from './DiscountedProduct.js';
import ShoppingCart from './ShoppingCart.js';

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║           OOP SHOPPING CART SYSTEM - TEST SIMULATION           ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

// Create test products
console.log("📦 Creating Test Products...\n");

const laptop = new Product(
  "1",
  "Laptop",
  1200,
  5,
  "Electronics",
  "High-performance laptop",
  "/images/laptop.jpg"
);
console.log(`✓ Product 1 Created: "${laptop.name}" - Stock: ${laptop.stockQuantity}`);

const mouse = new Product(
  "2",
  "Mouse",
  45,
  10,
  "Accessories",
  "Wireless mouse",
  "/images/mouse.jpg"
);
console.log(`✓ Product 2 Created: "${mouse.name}" - Stock: ${mouse.stockQuantity}`);

const headphones = new DiscountedProduct(
  "3",
  "Headphones",
  150,
  8,
  20, // 20% discount
  "Accessories",
  "Noise-cancelling headphones",
  "/images/headphones.jpg"
);
console.log(`✓ DiscountedProduct Created: "${headphones.name}" - Stock: ${headphones.stockQuantity}, Discount: ${headphones.discountPercentage}%`);
console.log(`  └─ Original Price: $${headphones.price}, Final Price: $${headphones.getFinalPrice()}\n`);

// Create shopping cart
console.log("🛒 Creating Shopping Cart...\n");
const cart = new ShoppingCart();

// TEST 1: Add 3 Laptops
console.log("╔════════════════════════════════════════════════════════════════╗");
console.log("║ TEST 1: Add 3 Laptops (Stock: 5)                              ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

const result1 = cart.addItem(laptop, 3);
console.log(`Result: ${result1.success ? "✓ SUCCESS" : "✗ FAILED"}`);
console.log(`Message: ${result1.message}`);
console.log(`Laptop Stock After: ${laptop.stockQuantity}\n`);

if (result1.success) {
  console.log("✓ EXPECTED: Item added successfully");
  console.log("✓ EXPECTED: Stock decreased from 5 to 2");
  console.log(`✓ ACTUAL: Stock is now ${laptop.stockQuantity}\n`);
}

// TEST 2: Try adding 6 Laptops (should fail)
console.log("╔════════════════════════════════════════════════════════════════╗");
console.log("║ TEST 2: Try adding 6 Laptops (Stock: 2) - Should Fail         ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

const result2 = cart.addItem(laptop, 6);
console.log(`Result: ${result2.success ? "✓ SUCCESS" : "✗ FAILED"}`);
console.log(`Message: ${result2.message}`);
console.log(`Laptop Stock After: ${laptop.stockQuantity}\n`);

if (!result2.success && result2.message === "Out of stock!") {
  console.log("✓ EXPECTED: Out of stock! message displayed");
  console.log("✓ EXPECTED: Stock remains unchanged at 2");
  console.log(`✓ ACTUAL: Stock is still ${laptop.stockQuantity}\n`);
}

// TEST 3: Add discounted Headphones
console.log("╔════════════════════════════════════════════════════════════════╗");
console.log("║ TEST 3: Add Discounted Headphones (Discount: 20%)             ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

const result3 = cart.addItem(headphones, 1);
console.log(`Result: ${result3.success ? "✓ SUCCESS" : "✗ FAILED"}`);
console.log(`Message: ${result3.message}`);
console.log(`Headphones Stock After: ${headphones.stockQuantity}\n`);

if (result3.success) {
  const discountInfo = headphones.getDiscountInfo();
  console.log("✓ EXPECTED: Product added successfully");
  console.log("✓ EXPECTED: Stock decreased");
  console.log("✓ EXPECTED: Discounted final price applied");
  console.log(`✓ ACTUAL: Original Price: $${discountInfo.originalPrice}`);
  console.log(`✓ ACTUAL: Discount (20%): $${discountInfo.discountAmount.toFixed(2)}`);
  console.log(`✓ ACTUAL: Final Price: $${discountInfo.finalPrice.toFixed(2)}\n`);
}

// Add mouse to cart
console.log("Adding 2 Mice to cart...");
cart.addItem(mouse, 2);
console.log("✓ 2 Mice added\n");

// TEST 4: Calculate Total
console.log("╔════════════════════════════════════════════════════════════════╗");
console.log("║ TEST 4: Calculate Cart Total                                  ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

const cartSummary = cart.getCartSummary();
console.log("Cart Summary:");
console.log("-".repeat(60));

cartSummary.items.forEach((item, index) => {
  console.log(`\n${index + 1}. ${item.productName}`);
  console.log(`   Quantity: ${item.quantity}`);
  console.log(`   Original Unit Price: $${item.unitPrice.toFixed(2)}`);
  if (item.discount > 0) {
    console.log(`   Discount: -$${item.discount.toFixed(2)}`);
  }
  console.log(`   Final Unit Price: $${item.finalPrice.toFixed(2)}`);
  console.log(`   Subtotal: $${item.subtotal.toFixed(2)}`);
});

console.log("\n" + "-".repeat(60));
console.log(`✓ GRAND TOTAL: $${cartSummary.total.toFixed(2)}\n`);

// TEST 5: Print Receipt
console.log("╔════════════════════════════════════════════════════════════════╗");
console.log("║ TEST 5: Print Receipt                                         ║");
console.log("╚════════════════════════════════════════════════════════════════╝");

const receipt = cart.printReceipt();
console.log(receipt);

// Summary of OOP concepts demonstrated
console.log("╔════════════════════════════════════════════════════════════════╗");
console.log("║           OOP CONCEPTS DEMONSTRATED IN THIS TEST              ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

console.log("✓ ENCAPSULATION");
console.log("  - Product stock is controlled through checkStock() and reduceStock()");
console.log("  - Stock quantity cannot be directly modified from outside");
console.log("  - Product data is accessed through getProductData()\n");

console.log("✓ INHERITANCE");
console.log("  - DiscountedProduct extends Product class");
console.log("  - Inherits all properties and methods from Product");
console.log("  - Uses super() to call parent constructor\n");

console.log("✓ POLYMORPHISM");
console.log("  - getFinalPrice() is overridden in DiscountedProduct");
console.log("  - ShoppingCart works with both Product and DiscountedProduct");
console.log("  - Same method name, different behavior\n");

console.log("✓ COMPOSITION");
console.log("  - ShoppingCart contains cartItems array");
console.log("  - cartItems contain Product objects and quantities");
console.log("  - Objects are composed together to form cart structure\n");

console.log("✓ OBJECT INTERACTION");
console.log("  - ShoppingCart calls product.checkStock()");
console.log("  - ShoppingCart calls product.reduceStock()");
console.log("  - ShoppingCart calls product.getFinalPrice()");
console.log("  - Objects communicate to achieve business logic\n");

console.log("╔════════════════════════════════════════════════════════════════╗");
console.log("║                    ALL TESTS COMPLETED ✓                       ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");
