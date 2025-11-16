# Cyber E-commerce Backend - NestJS

A production-ready e-commerce API built with NestJS, featuring JWT authentication with 2FA, product management, shopping cart, and order processing.

## Prerequisites

- Node.js 18+ 
- npm or yarn

## Installation

### 1. Install Dependencies

\`\`\`bash
cd backend
npm install
\`\`\`

### 2. Configure Environment Variables

Create a `.env` file in the backend directory:

\`\`\`env
JWT_SECRET=your-super-secret-jwt-key-change-this
REFRESH_SECRET=your-super-secret-refresh-key-change-this
PORT=5000
\`\`\`

### 3. Start the Server

**Development Mode:**
\`\`\`bash
npm run start:dev
\`\`\`

**Production Mode:**
\`\`\`bash
npm run build
npm run start:prod
\`\`\`

### 4. Access API Documentation

Open your browser and navigate to:
\`\`\`
http://localhost:5000/api-docs
\`\`\`

## API Endpoints

### Authentication (No Token Required)
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Login and receive OTP
- `POST /api/auth/verify-otp` - Verify 2FA OTP, get access & refresh tokens
- `POST /api/auth/refresh` - Get new access token using refresh token

### Products (Public Read, Admin Write)
- `GET /api/products` - List all products (supports `?search=` query)
- `GET /api/products/{id}` - Get specific product details
- `POST /api/products` - Create new product (admin only, requires token)
- `PUT /api/products/{id}` - Update product (admin only, requires token)
- `DELETE /api/products/{id}` - Delete product (admin only, requires token)

### Shopping Cart (Requires Token)
- `GET /api/cart` - Get user's cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/{productId}/quantity` - Update item quantity
- `DELETE /api/cart/{productId}` - Remove item from cart

### Orders (Requires Token)
- `POST /api/orders` - Create new order from cart
- `GET /api/orders` - Get user's orders

### Users (Requires Token)
- `GET /api/users/profile` - Get current user profile

## Authentication Flow

### 2-Factor Authentication (2FA) Process

1. **Login Request**
   \`\`\`bash
   POST /api/auth/login
   {
     "email": "user@example.com",
     "password": "password123"
   }
   \`\`\`
   Response includes `userId` and `testOTP` (for testing)

2. **Verify OTP**
   \`\`\`bash
   POST /api/auth/verify-otp
   {
     "userId": 1,
     "otp": "123456"
   }
   \`\`\`
   Response includes `accessToken` (15 min) and `refreshToken` (7 days)

3. **Token Usage**
   \`\`\`bash
   GET /api/cart
   Headers: {
     "Authorization": "Bearer <accessToken>"
   }
   \`\`\`

4. **Refresh Token**
   \`\`\`bash
   POST /api/auth/refresh
   {
     "refreshToken": "<refreshToken>"
   }
   \`\`\`

## Test Account

\`\`\`
Email: admin@cyber.com
Password: admin123
Role: admin
\`\`\`

## Features

✅ User registration and login  
✅ 2-Factor Authentication (OTP via email simulation)  
✅ JWT Access Tokens (15 minutes expiry)  
✅ Refresh Tokens (7 days expiry)  
✅ Product management (CRUD - admin only)  
✅ Shopping cart operations  
✅ Order creation and tracking  
✅ User profile management  
✅ Swagger API documentation  
✅ CORS enabled for frontend integration  
✅ Error handling and validation  

## Project Structure

\`\`\`
backend/
├── src/
│   ├── main.ts                 # Application entry point
│   ├── app.module.ts           # Main module
│   ├── modules/
│   │   ├── auth/               # Authentication module
│   │   ├── products/           # Products module
│   │   ├── cart/               # Shopping cart module
│   │   ├── orders/             # Orders module
│   │   ├── users/              # Users module
│   │   └── admin/              # Admin module
│   └── ...
├── package.json
├── tsconfig.json
└── README.md
\`\`\`

## Troubleshooting

**Port 5000 already in use:**
\`\`\`bash
# Change PORT in .env file or kill the process
lsof -ti:5000 | xargs kill -9
\`\`\`

**CORS errors from frontend:**
- Ensure `http://localhost:3000` is allowed (already configured)
- Check that frontend is making requests to `http://localhost:5000`

**Authentication issues:**
- Verify JWT_SECRET in .env file
- Check token expiry (access tokens expire after 15 minutes)
- Use refresh endpoint to get new access token

## License

ISC
