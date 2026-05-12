import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import Home from '../pages/shop/Home';
import Shop from '../pages/shop/Shop';
import ProductDetails from '../pages/shop/ProductDetails';
import CartPage from '../pages/shop/CartPage';
import Checkout from '../pages/shop/Checkout';
import OrderConfirmation from '../pages/shop/OrderConfirmation';
import OrderTracking from '../pages/shop/OrderTracking';
import InvoicePage from '../pages/shop/InvoicePage';
import ComparePage from '../pages/shop/ComparePage';
import Contact from '../pages/shop/Contact';
import About from '../pages/shop/About';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import UserDashboard from '../pages/dashboard/UserDashboard';
import UserOrders from '../pages/dashboard/UserOrders';
import UserAddresses from '../pages/dashboard/UserAddresses';
import UserWishlist from '../pages/dashboard/UserWishlist';
import UserProfile from '../pages/dashboard/UserProfile';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminProductForm from '../pages/admin/AdminProductForm';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminCategories from '../pages/admin/AdminCategories';
import AdminCoupons from '../pages/admin/AdminCoupons';
import AdminFAQ from '../pages/admin/AdminFAQ';
import AdminNewsletter from '../pages/admin/AdminNewsletter';
import AdminReviews from '../pages/admin/AdminReviews';
import AdminBackInStock from '../pages/admin/AdminBackInStock';
import FAQ from '../pages/shop/FAQ';
import NotFound from '../pages/NotFound';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" /></div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;
  return children;
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="shop/:slug" element={<ProductDetails />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="track-order" element={<OrderTracking />} />
        <Route path="compare" element={<ComparePage />} />
        <Route path="invoice/:id" element={<ProtectedRoute><InvoicePage /></ProtectedRoute>} />
        <Route path="contact" element={<Contact />} />
        <Route path="about" element={<About />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />
        <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="order-confirmation/:id" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
        <Route path="account" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="account/orders" element={<ProtectedRoute><UserOrders /></ProtectedRoute>} />
        <Route path="account/addresses" element={<ProtectedRoute><UserAddresses /></ProtectedRoute>} />
        <Route path="account/wishlist" element={<ProtectedRoute><UserWishlist /></ProtectedRoute>} />
        <Route path="account/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
      </Route>
      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<AdminProductForm />} />
        <Route path="products/edit/:id" element={<AdminProductForm />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="coupons" element={<AdminCoupons />} />
        <Route path="faq" element={<AdminFAQ />} />
        <Route path="newsletter" element={<AdminNewsletter />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="back-in-stock" element={<AdminBackInStock />} />
      </Route>
      <Route path="*" element={<MainLayout />}>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
