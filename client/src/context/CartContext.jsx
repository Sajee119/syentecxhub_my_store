import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], subtotal: 0, couponCode: '', discount: 0 });
  const [loading, setLoading] = useState(false);
  const [localCart, setLocalCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')) || { items: [] }; } catch { return { items: [] }; }
  });

  const fetchCart = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await API.get('/cart');
      setCart(data.cart);
    } catch { 
      setCart({ items: [] }); 
    }
    finally { 
      setLoading(false); 
    }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (user) {
      const { data } = await API.post('/cart/add', { productId, quantity });
      setCart(data.cart);
    } else {
      const newLocalCart = { ...localCart };
      const existingIdx = newLocalCart.items.findIndex(i => i.product === productId || i._id === productId);
      if (existingIdx > -1) {
        newLocalCart.items[existingIdx].quantity += quantity;
      } else {
        newLocalCart.items.push({ product: productId, quantity, _id: Date.now().toString() });
      }
      setLocalCart(newLocalCart);
      localStorage.setItem('cart', JSON.stringify(newLocalCart));
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (user) {
      const { data } = await API.put(`/cart/items/${itemId}`, { quantity });
      setCart(data.cart);
    } else {
      const newLocalCart = { ...localCart };
      const item = newLocalCart.items.find(i => i._id === itemId);
      if (item) {
        if (quantity < 1) {
          newLocalCart.items = newLocalCart.items.filter(i => i._id !== itemId);
        } else {
          item.quantity = quantity;
        }
        setLocalCart(newLocalCart);
        localStorage.setItem('cart', JSON.stringify(newLocalCart));
      }
    }
  };

  const removeFromCart = async (itemId) => {
    if (user) {
      const { data } = await API.delete(`/cart/items/${itemId}`);
      setCart(data.cart);
    } else {
      const newLocalCart = { ...localCart, items: localCart.items.filter(i => i._id !== itemId) };
      setLocalCart(newLocalCart);
      localStorage.setItem('cart', JSON.stringify(newLocalCart));
    }
  };

  const clearCart = async () => {
    if (user) {
      await API.delete('/cart');
      setCart({ items: [] });
    } else {
      setLocalCart({ items: [] });
      localStorage.setItem('cart', JSON.stringify({ items: [] }));
    }
  };

  const applyCoupon = async (code) => {
    const { data } = await API.post('/cart/coupon', { code });
    setCart(data.cart);
    return data;
  };

  const removeCoupon = async () => {
    const { data } = await API.delete('/cart/coupon');
    setCart(data.cart);
  };

  const getCartCount = () => {
    if (user) return cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
    return localCart.items.reduce((sum, i) => sum + (i.quantity || 0), 0);
  };

  const getSubtotal = () => {
    if (user) return cart.subtotal || cart.items?.reduce((s, i) => s + (i.price || 0) * i.quantity, 0) || 0;
    return 0;
  };

  return (
    <CartContext.Provider value={{
      cart: user ? cart : localCart,
      loading,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      applyCoupon,
      removeCoupon,
      getCartCount,
      getSubtotal,
      fetchCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};
