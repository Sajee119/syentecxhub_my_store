import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, Truck, Check, ChevronRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import Seo from '../../components/common/Seo';
import toast from 'react-hot-toast';

export default function Checkout() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cartInfo, setCartInfo] = useState({ items: [], subtotal: 0 });
  useEffect(() => { document.title = 'My Store | Checkout'; }, []);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shipping, setShipping] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    API.get('/cart').then(({ data }) => {
      const cart = data.cart;
      if (!cart.items?.length) return navigate('/cart');
      const subtotal = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
      setCartInfo({ items: cart.items, subtotal });
    }).catch(() => navigate('/cart'));
  }, [navigate]);

  const validateShipping = () => {
    const errs = {};
    if (!shipping.fullName.trim()) errs.fullName = 'Required';
    if (!shipping.phone.trim()) errs.phone = 'Required';
    if (!shipping.street.trim()) errs.street = 'Required';
    if (!shipping.city.trim()) errs.city = 'Required';
    if (!shipping.state.trim()) errs.state = 'Required';
    if (!shipping.zip.trim()) errs.zip = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateShipping()) return;
    setLoading(true);
    try {
      const { data } = await API.post('/orders', {
        items: cartInfo.items.map(i => ({ product: i.product._id || i.product, quantity: i.quantity })),
        shippingAddress: shipping,
      });
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const shippingFee = cartInfo.subtotal >= 100 ? 0 : 9.99;
  const tax = cartInfo.subtotal * 0.08;
  const total = cartInfo.subtotal + shippingFee + tax;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <Seo title="Checkout" description="Complete your purchase with our secure checkout process." />
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Checkout</h1>
        <div className="flex items-center gap-2 text-sm">
          {[1, 2].map(s => (
            <span key={s} className={`flex items-center gap-1 ${step >= s ? 'text-primary-600' : 'text-gray-400'}`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= s ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-800'}`}>{s}</span>
              {s === 1 ? 'Shipping' : 'Payment'}
              {s < 2 && <ChevronRight className="w-4 h-4" />}
            </span>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          {step === 1 && (
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6"><Truck className="w-5 h-5 text-primary-600" /> Shipping Address</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input value={shipping.fullName} onChange={e => setShipping({ ...shipping, fullName: e.target.value })} className="input-field" />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <input value={shipping.phone} onChange={e => setShipping({ ...shipping, phone: e.target.value })} className="input-field" />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Street Address</label>
                  <input value={shipping.street} onChange={e => setShipping({ ...shipping, street: e.target.value })} className="input-field" />
                  {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <input value={shipping.city} onChange={e => setShipping({ ...shipping, city: e.target.value })} className="input-field" />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">State</label>
                    <input value={shipping.state} onChange={e => setShipping({ ...shipping, state: e.target.value })} className="input-field" />
                    {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">ZIP Code</label>
                    <input value={shipping.zip} onChange={e => setShipping({ ...shipping, zip: e.target.value })} className="input-field" />
                    {errors.zip && <p className="text-red-500 text-xs mt-1">{errors.zip}</p>}
                  </div>
                </div>
                <button onClick={() => { if (validateShipping()) setStep(2); }} className="btn-primary w-full mt-4">
                  Continue to Payment
                </button>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6"><CreditCard className="w-5 h-5 text-primary-600" /> Payment</h2>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <input type="radio" checked readOnly className="w-4 h-4 text-primary-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Credit/Debit Card</p>
                    <p className="text-sm text-gray-500">Pay securely with your card</p>
                  </div>
                </div>
                <div className="space-y-3 ml-7">
                  <input type="text" placeholder="Card Number" className="input-field" value="4242 4242 4242 4242" readOnly />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="MM/YY" className="input-field" value="12/28" readOnly />
                    <input type="text" placeholder="CVC" className="input-field" value="123" readOnly />
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-3 ml-7">This is a demo — no real payment will be processed.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-secondary flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Back</button>
                <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {loading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : <><Check className="w-5 h-5" /> Place Order</>}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="glass-card p-6 sticky top-24">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              {cartInfo.items.map(item => (
                <div key={item._id} className="flex gap-3">
                  <div className="w-14 h-14 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0">
                    <img src={item.product?.images?.[0]?.url || ''} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{item.product?.name || item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>${cartInfo.subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>{shippingFee === 0 ? <span className="text-green-600">Free</span> : `$${shippingFee.toFixed(2)}`}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Tax</span><span>${tax.toFixed(2)}</span></div>
              <div className="border-t border-gray-200 dark:border-gray-800 pt-2 flex justify-between font-bold text-lg">
                <span>Total</span><span className="text-primary-600">$${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
