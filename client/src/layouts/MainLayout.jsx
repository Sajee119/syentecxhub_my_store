import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CartDrawer from '../components/cart/CartDrawer';
import BackToTop from '../components/common/BackToTop';
import CookieConsent from '../components/common/CookieConsent';
import FloatingCart from '../components/common/FloatingCart';

export default function MainLayout() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
      <FloatingCart onClick={() => setCartOpen(true)} />
      <CookieConsent />
    </div>
  );
}
