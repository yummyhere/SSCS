# E-Commerce Platform - Complete Setup Guide

## Overview
This is a complete full-stack e-commerce application demonstrating JavaScript OOP principles with a modern, professional UI/UX design.

## 🛠️ Prerequisites

### Required Software
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local or MongoDB Atlas) - [Setup Options](https://docs.mongodb.com/manual/installation/)
- **npm** or **yarn** package manager
- **Git** (optional, for version control)

### System Requirements
- **Disk Space**: At least 2GB free
- **RAM**: 4GB minimum, 8GB recommended
- **Internet**: Required for initial setup and MongoDB Atlas connection

## 📁 Project Structure

```
SSCS/
├── backend/                 # Node.js Express server
│   ├── oop/                # OOP classes (Product, DiscountedProduct, ShoppingCart)
│   ├── models/             # Mongoose database schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Authentication & error handling
│   ├── .env                # Environment variables (create this)
│   ├── .env.example        # Example environment file
│   ├── server.js           # Main server file
│   ├── package.json        # Dependencies
│   └── node_modules/       # Installed packages
│
├── frontend/               # React + Vite application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # Auth & Cart context
│   │   ├── styles/        # Global CSS
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # React entry point
│   ├── package.json       # Dependencies
│   ├── vite.config.js     # Vite configuration
│   └── node_modules/      # Installed packages
│
└── README.md              # Project documentation
```

## 🚀 Quick Start

### Step 1: Clone/Download the Project
```bash
# If you have the project files, navigate to the SSCS directory
cd path/to/SSCS
```

### Step 2: Set Up MongoDB

#### Option A: Local MongoDB (Windows)
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer and follow prompts
3. MongoDB will run on `localhost:27017` by default

#### Option B: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a cluster
4. Get your connection string (looks like: `mongodb+srv://user:pass@cluster.mongodb.net/database`)
5. Copy the connection string for later

### Step 3: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create .env file (copy from .env.example)
cp .env.example .env
# On Windows:
# copy .env.example .env

# Edit .env file with your MongoDB URI and settings
# Windows users: Use Notepad or VS Code to edit
# Mac/Linux users: Use nano or your preferred editor
# nano .env

# The .env file should look like:
# MONGODB_URI=mongodb://localhost:27017/ecommerce
# JWT_SECRET=your_secret_key_here_change_in_production
# PORT=5000
# NODE_ENV=development
# FRONTEND_URL=http://localhost:5173
```

#### Install Backend Dependencies
```bash
npm install
```

#### Start Backend Server
```bash
# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

**Expected Output:**
```
╔════════════════════════════════════════════════╗
║   E-Commerce Backend Server                    ║
║   Port: 5000                                   ║
║   Environment: development                     ║
╚════════════════════════════════════════════════╝
✓ MongoDB connected
```

**Backend is now running at:** `http://localhost:5000`

### Step 4: Frontend Setup

```bash
# Open a NEW terminal/command prompt
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Expected Output:**
```
  VITE v5.x.x ready in 500ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Frontend is now running at:** `http://localhost:5173`

### Step 5: Access the Application

1. Open your browser
2. Go to `http://localhost:5173`
3. You should see the Nexus e-commerce homepage

## ✅ Testing the OOP Implementation

### Run OOP Test Simulation

```bash
# In the backend directory
cd backend

# Run the test simulation
node oop/testSimulation.js
```

This will display:
- ✓ Product class with stock management
- ✓ DiscountedProduct class with inheritance
- ✓ ShoppingCart class with object interaction
- ✓ Test cases for all required functionality

**Expected Output:**
```
╔════════════════════════════════════════════════════════════════╗
║           OOP SHOPPING CART SYSTEM - TEST SIMULATION           ║
╚════════════════════════════════════════════════════════════════╝

📦 Creating Test Products...
✓ Product 1 Created: "Laptop" - Stock: 5
✓ Product 2 Created: "Mouse" - Stock: 10
✓ DiscountedProduct Created: "Headphones" - Stock: 8, Discount: 20%
  └─ Original Price: $150, Final Price: $120

🛒 Creating Shopping Cart...

╔════════════════════════════════════════════════════════════════╗
║ TEST 1: Add 3 Laptops (Stock: 5)                              ║
╚════════════════════════════════════════════════════════════════╝

Result: ✓ SUCCESS
Message: Product added to cart
Laptop Stock After: 2

✓ EXPECTED: Item added successfully
✓ EXPECTED: Stock decreased from 5 to 2
✓ ACTUAL: Stock is now 2

[... more tests ...]

╔════════════════════════════════════════════════════════════════╗
║                    ALL TESTS COMPLETED ✓                       ║
╚════════════════════════════════════════════════════════════════╝
```

## 🧪 Manual Testing

### Test User Registration & Login
1. Click "Sign Up" in the navbar
2. Enter test credentials:
   - Full Name: John Doe
   - Email: john@test.com
   - Password: Test123!
3. Click "Create Account"
4. You should be logged in automatically

### Test Product Browsing
1. Click "Products" in navbar or "Explore Products" button
2. View all products with filters by category
3. Hover over products to see hover effects
4. Stock information is displayed on each card

### Test Shopping Cart
1. Select a product
2. Choose quantity
3. Click "Add" button
4. Navigate to cart (/cart)
5. Modify quantities or remove items
6. See total calculation with discounts applied

### Test Checkout
1. From cart, click "Proceed to Checkout"
2. Fill in shipping information
3. Review order summary
4. Click "Place Order"
5. Order should be created in database
6. Redirect to orders page

### Test Admin Features
1. Sign up with admin role (set in database or through role management)
2. Navigate to /admin
3. View dashboard statistics (based on real database data)
4. Manage products and orders

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Products
- `GET /api/products` - Get all products (paginated)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Shopping Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:productId` - Update quantity
- `DELETE /api/cart/items/:productId` - Remove item

### Orders
- `POST /api/orders` - Create order (checkout)
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status

## 📊 Database Models

### User
```javascript
{
  fullName: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: String,
  city: String,
  postalCode: String,
  role: "user" | "admin",
  createdAt: Date,
  updatedAt: Date
}
```

### Product
```javascript
{
  name: String,
  description: String,
  price: Number,
  stockQuantity: Number,
  category: String,
  image: String,
  discountPercentage: Number (0-100),
  rating: Number,
  reviews: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Order
```javascript
{
  userId: ObjectId,
  items: [{
    productId: ObjectId,
    productName: String,
    quantity: Number,
    unitPrice: Number,
    finalPrice: Number (with discount),
    subtotal: Number
  }],
  totalAmount: Number,
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled",
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  shippingAddress: Object,
  paymentStatus: "Pending" | "Completed" | "Failed",
  createdAt: Date,
  updatedAt: Date
}
```

## 🐛 Troubleshooting

### Backend Issues

**Error: Cannot find module dependencies**
```bash
cd backend
rm -rf node_modules
npm install
```

**MongoDB Connection Failed**
- Check if MongoDB is running: `mongod` (local) or verify Atlas connection
- Verify MONGODB_URI in .env file
- Check firewall settings allowing port 27017 (local)

**Port 5000 already in use**
```bash
# Change PORT in .env to 5001 or kill the process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :5000
kill -9 <PID>
```

### Frontend Issues

**Page shows blank/white screen**
- Check browser console for errors (F12)
- Ensure backend is running on port 5000
- Clear browser cache and reload (Ctrl+Shift+R)

**Cannot add products to cart**
- Check if you're logged in (required)
- Verify backend is running
- Check network requests in DevTools (F12 > Network tab)

**Styling looks wrong**
- Hard refresh browser (Ctrl+Shift+R)
- Rebuild Vite: `npm run dev`

## 📈 Performance & Optimization

### Backend Optimization
- Database indexing on frequently queried fields
- Pagination for product listings (default: 12 per page)
- JWT token caching for reduced lookup overhead
- Request validation to prevent invalid data

### Frontend Optimization
- Component code splitting with React.lazy()
- Image lazy loading
- Vite's optimized build output
- Debounced search and filter operations

## 🔐 Security Considerations

### Implemented
- ✓ Password hashing with bcryptjs
- ✓ JWT token-based authentication
- ✓ Protected routes (authentication required)
- ✓ Admin authorization checks
- ✓ Backend stock validation (no frontend manipulation)
- ✓ CORS configuration

### Best Practices
- Never store tokens in localStorage for production (use httpOnly cookies)
- Implement rate limiting on API endpoints
- Use HTTPS in production
- Rotate JWT secrets regularly
- Keep dependencies updated

## 🚀 Deployment (Future Reference)

### Backend Deployment (Heroku, AWS, etc.)
1. Set production environment variables
2. Update FRONTEND_URL to production frontend URL
3. Ensure MongoDB Atlas is configured
4. Deploy with: `git push heroku main`

### Frontend Deployment (Vercel, Netlify, etc.)
1. Build production bundle: `npm run build`
2. Deploy `dist/` folder
3. Configure environment variables for production API URL

## 📝 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (vite.env or environment setup)
```
VITE_API_URL=http://localhost:5000
```

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

## 🤝 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review error messages in console carefully
3. Ensure all prerequisites are installed
4. Verify MongoDB is running and accessible
5. Check that ports 5000 and 5173 are available

## ✨ Key Features Implemented

### OOP Principles ✓
- Encapsulation: Stock controlled through methods
- Inheritance: DiscountedProduct extends Product
- Polymorphism: getFinalPrice() works for both types
- Composition: ShoppingCart contains Product objects
- Object Interaction: Cart communicates with Products

### Full-Stack Features ✓
- Complete authentication system with role-based access
- Real-time stock management with validation
- Professional e-commerce UI with responsive design
- Order management with status tracking
- Admin dashboard with real statistics
- No hardcoded or fake data

### Professional Design ✓
- Modern color system with CSS variables
- Distinctive typography and visual identity
- Responsive layouts for all screen sizes
- Smooth animations and transitions
- Empty states and loading indicators
- Comprehensive error handling

---

**Ready to start?** Follow the Quick Start section and run the application!
