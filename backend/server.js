const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh-secret-key';

// Mock Database
let users = [
  {
    id: 1,
    email: 'admin@cyber.com',
    password: bcrypt.hashSync('admin123', 10),
    name: 'Admin User',
    role: 'admin',
    twoFactorSecret: 'JBSWY3DPEBLW64TMMQ======',
    twoFactorEnabled: false,
  },
];

let products = [
  {
    id: 1,
    name: 'Apple iPhone 14 Pro Max',
    price: 1399,
    description: 'Latest Apple iPhone with advanced features',
    image: '/iphone-14-pro-max.png',
    category: 'Phones',
    stock: 50,
  },
  {
    id: 2,
    name: 'AirPods Max Silver',
    price: 549,
    description: 'Premium wireless headphones',
    image: '/premium-over-ear-headphones.png',
    category: 'Audio',
    stock: 30,
  },
  {
    id: 3,
    name: 'Apple Watch Series 9',
    price: 399,
    description: 'Advanced fitness tracking smartwatch',
    image: '/apple-watch-series-9.jpg',
    category: 'Wearables',
    stock: 45,
  },
];

let orders = [];
let carts = {};

// Helper function to generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Email configuration (using ethereal for testing)
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: process.env.EMAIL_USER || 'your-email@ethereal.email',
    pass: process.env.EMAIL_PASS || 'your-password',
  },
});

// AUTH ENDPOINTS

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists
 */
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;

  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = {
    id: users.length + 1,
    email,
    password: hashedPassword,
    name,
    role: 'user',
    twoFactorEnabled: false,
    twoFactorSecret: '',
  };

  users.push(newUser);
  res.status(201).json({ message: 'User registered successfully', user: { id: newUser.id, email, name } });
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns tokens
 *       401:
 *         description: Invalid credentials
 */
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const otp = generateOTP();
  user.otp = otp;
  user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

  // Send OTP (in production, send via email)
  console.log(`OTP for ${email}: ${otp}`);

  res.json({
    message: 'OTP sent to email',
    userId: user.id,
    requiresTwoFactor: true,
    testOTP: otp, // Only for testing
  });
});

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify OTP for 2FA
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: number
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified, returns access and refresh tokens
 *       401:
 *         description: Invalid OTP
 */
app.post('/api/auth/verify-otp', (req, res) => {
  const { userId, otp } = req.body;
  const user = users.find((u) => u.id === userId);

  if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
    return res.status(401).json({ message: 'Invalid or expired OTP' });
  }

  const accessToken = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET, { expiresIn: '7d' });

  delete user.otp;
  delete user.otpExpiry;

  res.json({ accessToken, refreshToken, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New access token generated
 *       401:
 *         description: Invalid refresh token
 */
app.post('/api/auth/refresh', (req, res) => {
  const { refreshToken } = req.body;

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    const user = users.find((u) => u.id === decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const newAccessToken = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: '15m',
    });

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// PRODUCT ENDPOINTS

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of all products
 */
app.get('/api/products', (req, res) => {
  const { search } = req.query;
  let filteredProducts = products;

  if (search) {
    filteredProducts = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()));
  }

  res.json(filteredProducts);
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Product details
 */
app.get('/api/products/:id', (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create new product (Admin only)
 *     tags: [Products]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               stock:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product created
 */
app.post('/api/products', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can create products' });
  }

  const { name, price, description, category, stock } = req.body;
  const newProduct = {
    id: products.length + 1,
    name,
    price,
    description,
    category,
    stock,
    image: '/placeholder.svg?height=300&width=300&query=' + encodeURIComponent(name),
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete product (Admin only)
 *     tags: [Products]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Product deleted
 */
app.delete('/api/products/:id', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can delete products' });
  }

  products = products.filter((p) => p.id !== parseInt(req.params.id));
  res.json({ message: 'Product deleted' });
});

// CART ENDPOINTS

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get user's cart
 *     tags: [Cart]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Cart items
 */
app.get('/api/cart', verifyToken, (req, res) => {
  const cart = carts[req.user.userId] || [];
  res.json(cart);
});

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: number
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Item added to cart
 */
app.post('/api/cart', verifyToken, (req, res) => {
  const { productId, quantity } = req.body;
  if (!carts[req.user.userId]) {
    carts[req.user.userId] = [];
  }

  const existingItem = carts[req.user.userId].find((item) => item.productId === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    carts[req.user.userId].push({ productId, quantity });
  }

  res.json(carts[req.user.userId]);
});

/**
 * @swagger
 * /api/cart/{productId}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Item removed from cart
 */
app.delete('/api/cart/:productId', verifyToken, (req, res) => {
  if (carts[req.user.userId]) {
    carts[req.user.userId] = carts[req.user.userId].filter((item) => item.productId !== parseInt(req.params.productId));
  }
  res.json(carts[req.user.userId] || []);
});

/**
 * @swagger
 * /api/cart/{productId}/quantity:
 *   put:
 *     summary: Update item quantity in cart
 *     tags: [Cart]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Quantity updated
 */
app.put('/api/cart/:productId/quantity', verifyToken, (req, res) => {
  const { quantity } = req.body;
  const cart = carts[req.user.userId];

  if (cart) {
    const item = cart.find((item) => item.productId === parseInt(req.params.productId));
    if (item) {
      item.quantity = quantity;
    }
  }

  res.json(cart || []);
});

// ORDER ENDPOINTS

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create order
 *     tags: [Orders]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *               shippingMethod:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order created
 */
app.post('/api/orders', verifyToken, (req, res) => {
  const { address, shippingMethod, paymentMethod } = req.body;
  const cart = carts[req.user.userId] || [];

  if (cart.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  const order = {
    id: orders.length + 1,
    userId: req.user.userId,
    items: cart,
    address,
    shippingMethod,
    paymentMethod,
    status: 'pending',
    createdAt: new Date(),
  };

  orders.push(order);
  carts[req.user.userId] = [];

  res.status(201).json(order);
});

// USER ENDPOINTS

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: User profile
 */
app.get('/api/users/profile', verifyToken, (req, res) => {
  const user = users.find((u) => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Docs available at http://localhost:${PORT}/api-docs`);
});
