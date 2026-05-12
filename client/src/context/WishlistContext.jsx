import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../api/axios';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState({ products: [] });
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await API.get('/wishlist');
      setWishlist(data.wishlist);
    } catch { setWishlist({ products: [] }); }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const toggleWishlist = async (productId) => {
    if (!user) return;
    const { data } = await API.post('/wishlist/toggle', { productId });
    setWishlist(data.wishlist);
    return data.isWishlisted;
  };

  const isWishlisted = (productId) => {
    return wishlist.products?.some(p => (p._id || p) === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, loading, toggleWishlist, isWishlisted, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
