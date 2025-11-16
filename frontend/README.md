# Cyber E-commerce Frontend

## Setup Instructions

### 1. Update API URL (if needed)
Edit `app.js` and update `API_BASE_URL` to match your backend URL

### 2. Open in Browser
Simply open `index.html` in a web browser

For better experience, use a local server:
\`\`\`bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx http-server
\`\`\`

Then visit: `http://localhost:8000`

## Features

### For Customers
✓ Browse products
✓ Search products
✓ View product details
✓ Add/remove items from cart
✓ Update quantities
✓ Checkout with address entry
✓ Choose shipping methods
✓ Payment processing
✓ User profile

### For Admins
✓ Add new products
✓ Delete products
✓ View own profile
✓ Access admin functions

### Authentication
✓ Registration
✓ Login with 2FA
✓ OTP verification
✓ Token refresh
✓ Logout

## Browser Compatibility
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Notes
- Frontend communicates with backend via REST API
- Tokens stored in localStorage
- Real-time cart updates
- Responsive design for mobile and desktop
