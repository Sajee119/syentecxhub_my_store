# 🛍️ My Store - Full-Stack E-Commerce Application

A modern, production-ready e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js) featuring a professional UI/UX with dark mode, admin dashboard, and complete shopping functionality.

## 📝 GitHub Description

**A full-featured MERN e-commerce platform with admin dashboard, JWT auth, Stripe/PayPal integration, product management, order tracking, dark mode, and responsive design.**

**Keywords:** e-commerce, MERN, React, Node.js, MongoDB, Express, Tailwind CSS, JWT, Payment Gateway, Admin Dashboard, Full-Stack

## 🚀 Tech Stack

### Frontend
- **React 18** + **Vite** - Fast development & build
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **React Router DOM** - Client-side routing
- **React Hook Form** + **Zod** - Form validation
- **Axios** - HTTP client
- **Recharts** - Dashboard charts
- **React Hot Toast** - Notifications

### Backend
- **Node.js** + **Express.js** - REST API
- **MongoDB** + **Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **Joi** - API validation
- **Nodemailer** - Email service

## ✨ Features

### User Features
- User registration & login with JWT
- Password reset via email
- Product browsing with search, filter, sort
- Product details with image gallery
- Shopping cart (persistent + database)
- Checkout with address & payment
- Order confirmation & tracking
- User dashboard (profile, orders, addresses, wishlist)
- Dark/Light mode toggle

### Admin Features
- Dashboard with revenue charts & stats
- Product management (CRUD)
- Order management & status updates
- User management (ban, role change)
- Category management
- Coupon management
- Contact form with Web3Forms integration

### General
- Responsive mobile-first design
- Glassmorphism UI
- Smooth animations
- Loading skeletons
- Toast notifications
- Role-based access control
- 404 page
- Environment-based API configuration

## 📁 Project Structure

```
my-store/
├── server/                 # Backend
│   ├── config/            # DB & Cloudinary config
│   ├── controllers/       # Route handlers
│   ├── middleware/        # Auth, admin, error handling
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Express routes
│   ├── services/          # Business logic
│   ├── utils/             # Helpers, email
│   ├── validations/       # Joi schemas
│   ├── seed/              # Database seeder
│   ├── uploads/           # Uploaded files
│   ├── app.js             # Express app
│   └── server.js          # Entry point
├── client/                # Frontend
│   ├── src/
│   │   ├── api/           # Axios config
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   ├── layouts/       # Page layouts
│   │   ├── pages/         # Route pages
│   │   └── routes/        # App routing
│   ├── index.html
│   └── vite.config.js
└── README.md
```

## 🛠️ Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone & Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Variables

**server/.env**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/my-store
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
JWT_REMEMBER_EXPIRE=30d
CLIENT_URL=http://localhost:5173

# Optional: Cloudinary for image uploads
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional: Email (Gmail app password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FROM_EMAIL=noreply@mystore.com
FROM_NAME=My Store
```

**client/.env**
```env
VITE_API_URL=http://localhost:5000
VITE_WEB3FORMS_URL=https://api.web3forms.com/submit
VITE_WEB3FORMS_ACCESS_KEY=your_web3forms_access_key
```

> **Note:** In production, update `VITE_API_URL` to your deployed backend URL (e.g., https://your-api.onrender.com)

### 3. Seed the Database

```bash
cd server
npm run seed
```

This creates:
- **Admin**: admin@mystore.com / admin123
- **Users**: john@example.com / password123, jane@example.com / password123
- **Categories**: 8 categories
- **Products**: 14 products
- **Reviews**: Sample reviews

### 4. API Configuration

The frontend uses a centralized API request utility (`src/api/axios.js`) that:
- Automatically adds JWT token to all requests from `localStorage`
- Uses `VITE_API_URL` from `.env` for the backend URL
- Handles error messages and response parsing
- Throws descriptive errors

**Usage in components:**
```javascript
import API from '@/api/axios';

// GET request
const data = await API.get('/api/products');

// POST request
const result = await API.post('/api/cart/add', { productId, quantity });

// PUT/PATCH request
const updated = await API.put('/api/orders/123', { status: 'shipped' });

// DELETE request
await API.delete('/api/cart/items/123');
```

### 5. Contact Form Setup (Web3Forms)

The contact form at `/contact` uses **Web3Forms** for email delivery:
- No backend email server needed
- Configuration via environment variables
- Emails sent to: sajeepan634@gmail.com
- To change the email, update `VITE_WEB3FORMS_ACCESS_KEY`

Get your access key: https://web3forms.com

### 6. Start Development

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

Visit **http://localhost:5173** for the store
Admin panel at **http://localhost:5173/admin**

## 🌐 Deployment

### Frontend (Vercel)

1. **Build the project:**
```bash
cd client
npm run build
```

2. **Deploy to Vercel:**
   - Push to GitHub
   - Connect repo to Vercel dashboard
   - Add environment variables in Vercel Settings:
     ```
     VITE_API_URL=https://your-api.onrender.com
     VITE_WEB3FORMS_URL=https://api.web3forms.com/submit
     VITE_WEB3FORMS_ACCESS_KEY=your_web3forms_key
     ```
   - Deploy automatically on push

### Backend (Render)

1. **Push server code to GitHub**

2. **Create a new Web Service on Render:**
   - Connect GitHub repo
   - Set build command: `npm install`
   - Set start command: `npm start`
   - Add environment variables:
     ```
     NODE_ENV=production
     MONGODB_URI=mongodb+srv://...
     JWT_SECRET=your_production_secret
     CLIENT_URL=https://your-vercel-domain.com
     CLOUDINARY_*=your_cloudinary_keys
     SMTP_*=your_email_settings
     ```
   - Deploy

3. **Update CLIENT_URL in server .env** to your Vercel frontend URL for CORS

### Database

Use **MongoDB Atlas** for production:
1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Get connection string: `mongodb+srv://user:password@cluster.mongodb.net/dbname`
3. Add IP address to Atlas network access
4. Set as `MONGODB_URI` on Render

## 🔒 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register user | No |
| POST | /api/auth/login | Login | No |
| GET | /api/auth/me | Get current user | Yes |
| POST | /api/auth/forgot-password | Forgot password | No |
| POST | /api/auth/reset-password | Reset password | No |
| GET | /api/products | Get products | No |
| GET | /api/products/:slug | Get product | No |
| GET | /api/products/featured | Featured products | No |
| GET | /api/categories | Active categories | No |
| GET | /api/cart | Get cart | Yes |
| POST | /api/cart/add | Add to cart | Yes |
| POST | /api/orders | Create order | Yes |
| GET | /api/orders | Get orders | Yes |
| GET | /api/admin/stats | Dashboard stats | Admin |
| GET | /api/admin/revenue | Revenue data | Admin |

## � Troubleshooting

### Blank White Screen
- Ensure `VITE_API_URL` is set correctly in `.env`
- Check browser console for errors (DevTools → Console)
- Verify backend is running and accessible
- Clear browser cache and restart dev server

### API Connection Errors
- Check that backend is running on the correct port
- Verify `VITE_API_URL` matches backend URL
- Check CORS settings in `server/app.js` for `CLIENT_URL`
- Look at Network tab in DevTools to see failed requests

### Contact Form Not Working
- Verify `VITE_WEB3FORMS_ACCESS_KEY` is valid
- Check browser console for Web3Forms errors
- Test Web3Forms directly: https://web3forms.com/test

### Database Connection Issues
- Verify `MONGODB_URI` is correct
- Check MongoDB is running (local) or Atlas network access (cloud)
- Add your IP to MongoDB Atlas whitelist (production)

## �📄 License

MIT
