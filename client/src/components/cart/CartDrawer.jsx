import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';

export default function CartDrawer({ open, onClose }) {
  const { cart, updateQuantity, removeFromCart, getSubtotal, fetchCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    if (open && user) fetchCart();
  }, [open, user, fetchCart]);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const subtotal = getSubtotal();
  const itemCount = cart.items?.reduce((s, i) => s + i.quantity, 0) || 0;

  return (
    <>
      <div className={`fixed inset-0 z-[70] transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className={`fixed top-0 right-0 h-screen w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 z-[80] ${open ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-primary-600" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Cart ({itemCount})</h2>
              </div>
              <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {!cart.items?.length ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4" />
                  <p className="text-gray-500 font-medium">Your cart is empty</p>
                  <button onClick={onClose} className="btn-primary mt-4 text-sm">Continue Shopping</button>
                </div>
              ) : (
                cart.items.map(item => {
                  const prod = item.product;
                  const name = prod?.name || item.name || 'Product';
                  const price = prod?.price || item.price || 0;
                  const img = prod?.images?.[0]?.url || item.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200';
                  const slug = prod?.slug || '#';
                  return (
                    <div key={item._id} className="flex gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 group">
                      <Link to={`/shop/${slug}`} onClick={onClose} className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0">
                        <img src={img} alt={name} className="w-full h-full object-cover" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link to={`/shop/${slug}`} onClick={onClose} className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-1 hover:text-primary-600">{name}</Link>
                        <p className="text-xs text-gray-500 mt-0.5">${price.toFixed(2)}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg">
                            <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg"><Minus className="w-3 h-3" /></button>
                            <span className="px-2.5 text-xs font-medium">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg"><Plus className="w-3 h-3" /></button>
                          </div>
                          <button onClick={() => removeFromCart(item._id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">${(price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {cart.items?.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-800 p-5 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-bold text-lg text-gray-900 dark:text-gray-100">${subtotal.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-400">Shipping & taxes calculated at checkout</p>
                <Link to="/checkout" onClick={onClose} className="btn-primary w-full flex items-center justify-center gap-2 text-sm">
                  Checkout
                </Link>
                <button onClick={onClose} className="btn-secondary w-full text-sm">
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
