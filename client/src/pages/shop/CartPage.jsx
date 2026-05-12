import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, Percent } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import EmptyState from '../../components/common/EmptyState';
import Breadcrumb from '../../components/common/Breadcrumb';
import Seo from '../../components/common/Seo';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [guestProducts, setGuestProducts] = useState({});

  useEffect(() => {
    if (user) return;
    const ids = cart.items?.map(i => i.product).filter(Boolean) || [];
    if (!ids.length) return;
    Promise.all(ids.map(id => API.get(`/products/id/${id}`).then(r => r.data.product).catch(() => null)))
      .then(results => {
        const map = {};
        results.forEach(p => { if (p) map[p._id] = p; });
        setGuestProducts(map);
      });
  }, [cart.items, user]);

  const resolveItem = (item) => {
    if (typeof item.product === 'object' && item.product) {
      return item.product;
    }
    if (!user && guestProducts[item.product]) {
      return guestProducts[item.product];
    }
    return item;
  };

  const subtotal = cart.items?.reduce((sum, item) => {
    const product = resolveItem(item);
    return sum + (product?.price || item.price || 0) * item.quantity;
  }, 0) || 0;

  const shipping = subtotal >= 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax - (couponDiscount || 0);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return toast.error('Enter a coupon code');
    try {
      const { data } = await API.post('/coupons/validate', { code: couponCode, subtotal });
      setCouponDiscount(data.discount);
      toast.success(`Coupon applied! -$${data.discount.toFixed(2)}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon');
    }
  };

  if (!cart.items?.length) {
    return <div className="max-w-4xl mx-auto px-4 py-12"><Seo title="Shopping Cart" /><Breadcrumb items={[{ label: 'Cart' }]} /><EmptyState icon={ShoppingBag} title="Your cart is empty" message="Looks like you haven't added anything to your cart yet." actionLabel="Start Shopping" actionLink="/shop" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Seo title="Shopping Cart" description="Review your shopping cart items before checkout." />
      <Breadcrumb items={[{ label: 'Cart' }]} />
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Shopping Cart</h1>
        <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-600 font-medium">Clear Cart</button>
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => {
            const product = resolveItem(item);
            const img = product?.images?.[0]?.url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200';
            return (
              <div key={item._id} className="glass-card p-4 flex gap-4 items-center">
                <Link to={product?.slug ? `/shop/${product.slug}` : '#'} className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={product?.slug ? `/shop/${product.slug}` : '#'} className="font-medium text-gray-900 dark:text-gray-100 hover:text-primary-600 line-clamp-1">
                    {product?.name || 'Product'}
                  </Link>
                  <p className="text-sm text-gray-500">${(product?.price || item.price || 0).toFixed(2)} each</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg">
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"><Minus className="w-3 h-3" /></button>
                      <span className="px-4 text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"><Plus className="w-3 h-3" /></button>
                    </div>
                    <button onClick={() => removeFromCart(item._id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-900 dark:text-gray-100">${((product?.price || item.price || 0) * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="lg:col-span-1">
          <div className="glass-card p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="font-medium">{shipping === 0 ? <span className="text-green-600">Free</span> : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax (8%)</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Discount</span>
                  <span className="font-medium text-green-600">-${couponDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 dark:border-gray-800 pt-3 flex justify-between">
                <span className="font-bold">Total</span>
                <span className="font-bold text-xl text-primary-600">${Math.max(0, total).toFixed(2)}</span>
              </div>
            </div>
            <div className="flex gap-2 mb-6">
              <input type="text" placeholder="Coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)}
                className="input-field py-2 text-sm flex-1" />
              <button onClick={handleApplyCoupon} className="btn-secondary text-sm py-2 px-4"><Percent className="w-4 h-4" /></button>
            </div>
            <Link to={user ? '/checkout' : '/login'} className="btn-primary w-full flex items-center justify-center gap-2">
              Proceed to Checkout
            </Link>
            <Link to="/shop" className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 mt-4">
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
