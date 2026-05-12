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

### General
- Responsive mobile-first design
- Glassmorphism UI
- Smooth animations
- Loading skeletons
- Toast notifications
- Role-based access control
- 404 page

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

### 4. Start Development

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

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
```
Deploy the `dist/` folder to Vercel or Netlify.
Update the Vite proxy in production by setting the API URL in environment.

### Backend (Render/Railway)
```bash
cd server
npm start
```
Set the environment variables in your hosting dashboard.

### Database
Use **MongoDB Atlas** for production.

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

## 📄 License

MIT
