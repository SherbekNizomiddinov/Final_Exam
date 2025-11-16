# Cyber E-commerce Application - Complete Setup Guide

A full-stack Apple Store e-commerce application built with **NestJS backend** and **HTML/CSS/JavaScript frontend**.

## Project Overview

This is a complete e-commerce platform featuring:
- User authentication with 2FA (One-Time Password)
- JWT tokens with refresh mechanism (15-min access, 7-day refresh)
- Product browsing and search
- Shopping cart management
- Multi-step checkout process
- Admin product management
- User profiles
- Swagger API documentation

## Quick Start

### Backend Setup (NestJS)

1. **Navigate to backend directory:**
   \`\`\`bash
   cd backend
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Create `.env` file:**
   \`\`\`bash
   cat > .env << EOF
   JWT_SECRET=your-secret-key-for-jwt
   REFRESH_SECRET=your-secret-key-for-refresh
   PORT=5000
   EOF
   \`\`\`

4. **Start development server:**
   \`\`\`bash
   npm run start:dev
   \`\`\`

5. **Access API Documentation:**
   - Open browser: `http://localhost:5000/api-docs`
   - Swagger UI will display all available endpoints

### Frontend Setup (HTML/CSS/JS)

1. **Navigate to frontend directory:**
   \`\`\`bash
   cd frontend
   \`\`\`

2. **Start a local server:**
   \`\`\`bash
   # Option 1: Python 3
   python -m http.server 8000

   # Option 2: Node.js
   npx http-server

   # Option 3: Just open index.html in browser
   open index.html
   \`\`\`

3. **Access the application:**
   - Browser: `http://localhost:8000`

## Authentication & Testing

### Test Account
\`\`\`
Email: admin@cyber.com
Password: admin123
\`\`\`

### Login Flow
1. Enter email and password
2. Submit login form
3. Check console or notification for OTP (for testing, OTP is logged)
4. Enter the 6-digit OTP in the verification form
5. Successfully logged in!

### Available Test OTPs (Development)
- Any 6-digit number works in development
- In the notification, you'll see the test OTP to use
- Example: `123456`

## API Endpoints Summary

### Auth (No Token Required)
\`\`\`
POST   /api/auth/register         - Register new user
POST   /api/auth/login            - Login and get OTP
POST   /api/auth/verify-otp       - Verify 2FA, get tokens
POST   /api/auth/refresh          - Refresh access token
\`\`\`

### Products (Public Read)
\`\`\`
GET    /api/products              - List all products
GET    /api/products?search=iphone - Search products
GET    /api/products/:id          - Get product details
POST   /api/products              - Create product (admin)
PUT    /api/products/:id          - Update product (admin)
DELETE /api/products/:id          - Delete product (admin)
\`\`\`

### Cart (Token Required)
\`\`\`
GET    /api/cart                  - Get user cart
POST   /api/cart                  - Add to cart
PUT    /api/cart/:productId/quantity - Update quantity
DELETE /api/cart/:productId       - Remove from cart
\`\`\`

### Orders (Token Required)
\`\`\`
POST   /api/orders                - Create order from cart
GET    /api/orders                - Get user orders
\`\`\`

### Users (Token Required)
\`\`\`
GET    /api/users/profile         - Get user profile
\`\`\`

## Frontend Features

### Customer Features
- Browse and search products
- View product details and specifications
- Add/remove items from cart
- Manage cart quantities
- Multi-step checkout:
  1. Enter shipping address
  2. Select shipping method (Free/Express/Overnight)
  3. Enter payment details
- User profile viewing

### Admin Features
- Add new products (via profile modal)
- View admin panel
- Manage user profile

### UI/UX Features
- Modern, responsive design
- Smooth animations and transitions
- Real-time cart count updates
- Toast notifications for feedback
- Modal dialogs for forms and details
- Dark/Light theme ready

## Project Structure

\`\`\`
cyber-ecommerce/
├── backend/                          # NestJS Backend
│   ├── src/
│   │   ├── main.ts                  # Entry point
│   │   ├── app.module.ts            # Root module
│   │   ├── modules/
│   │   │   ├── auth/                # Authentication
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.module.ts
│   │   │   │   └── jwt.strategy.ts
│   │   │   ├── products/            # Products management
│   │   │   ├── cart/                # Shopping cart
│   │   │   ├── orders/              # Orders
│   │   │   ├── users/               # User profiles
│   │   │   └── admin/               # Admin functions
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── frontend/                         # HTML/CSS/JS Frontend
│   ├── index.html                   # Main page
│   ├── app.js                       # JavaScript logic
│   ├── styles.css                   # Styling
│   └── README.md
│
├── SETUP_GUIDE.md                   # This file
└── README.md                         # Project overview
\`\`\`

## Troubleshooting

### Backend Issues

**Port 5000 already in use:**
\`\`\`bash
# Find and kill process
lsof -ti:5000 | xargs kill -9

# Or change port in .env
PORT=5001
\`\`\`

**Dependencies not installing:**
\`\`\`bash
rm -rf node_modules package-lock.json
npm install
\`\`\`

**JWT Authentication failing:**
- Verify token is in localStorage
- Check token hasn't expired (access token: 15 min)
- Use refresh endpoint to get new token

### Frontend Issues

**API connection errors:**
- Check backend is running on port 5000
- Verify `API_BASE_URL` in app.js is `http://localhost:5000/api`
- Check CORS is enabled on backend

**Login not working:**
- Verify backend auth endpoint is accessible
- Check email/password are correct
- Look at browser console for errors

**Cart not updating:**
- Clear localStorage and refresh
- Check if token is still valid
- Verify cart endpoint is working in Swagger

## Development Tips

### Testing with Swagger

1. Open `http://localhost:5000/api-docs`
2. Try the "Try it out" feature for each endpoint
3. Use test account credentials
4. Copy token and use with protected endpoints

### Adding New Products

1. Login as admin (admin@cyber.com / admin123)
2. Open Profile modal
3. Click "Add Product"
4. Enter product details
5. Product appears in catalog

### Monitoring API Calls

Open browser DevTools (F12) → Network tab to see all API requests and responses.

## Performance Optimization

- Frontend uses LocalStorage for tokens (no cookies needed)
- Cart items cached in memory
- Products cached after first load
- Token refresh happens automatically before expiry

## Security Considerations

- JWT tokens use HMAC-SHA256
- Passwords hashed with bcryptjs
- 2FA adds extra security layer
- Refresh tokens stored separately from access tokens
- CORS enabled for local development only

## Production Deployment

### Backend Deployment
\`\`\`bash
npm run build
npm run start:prod
\`\`\`

### Frontend Deployment
- Upload files to static hosting (Vercel, Netlify, etc.)
- Update `API_BASE_URL` to production backend URL
- Ensure backend is deployed and accessible

### Environment Variables for Production
\`\`\`
JWT_SECRET=<strong-random-key>
REFRESH_SECRET=<strong-random-key>
PORT=5000
NODE_ENV=production
\`\`\`

## Support & Documentation

- Backend API Docs: `http://localhost:5000/api-docs` (Swagger)
- Read backend/README.md for API details
- Read frontend/README.md for frontend setup

---

**Happy coding! Happy shopping with Cyber E-commerce!**
