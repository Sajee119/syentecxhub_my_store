import { useState } from 'react';
import { X, ShoppingCart, Heart, Star, Minus, Plus, ChevronLeft, ChevronRight, Truck, Shield, RefreshCw } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function QuickViewModal({ product, onClose }) {
  const [qty, setQty] = useState(1);
  const [imgIndex, setImgIndex] = useState(0);
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { user } = useAuth();
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const images = product.images?.length ? product.images : [{ url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600' }];

  const handleAdd = async () => {
    try {
      await addToCart(product._id, qty);
      toast.success('Added to cart!');
      onClose();
    } catch { toast.error('Failed to add'); }
  };

  const handleWishlist = async () => {
    if (!user) return toast.error('Please login first');
    await toggleWishlist(product._id);
    toast.success(isWishlisted(product._id) ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-white dark:bg-gray-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <X className="w-5 h-5" />
        </button>
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative bg-gray-100 dark:bg-gray-800 rounded-3xl md:rounded-r-none overflow-hidden">
            <img src={images[imgIndex]?.url} alt={product.name} className="w-full aspect-square object-cover" />
            {discount > 0 && <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg">-{discount}%</span>}
            {images.length > 1 && (
              <>
                <button onClick={() => setImgIndex(i => (i - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 dark:bg-gray-800/80 flex items-center justify-center hover:bg-white transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                <button onClick={() => setImgIndex(i => (i + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 dark:bg-gray-800/80 flex items-center justify-center hover:bg-white transition-colors"><ChevronRight className="w-4 h-4" /></button>
              </>
            )}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <button key={i} onClick={() => setImgIndex(i)} className={`w-2 h-2 rounded-full transition-all ${i === imgIndex ? 'bg-white w-6' : 'bg-white/50'}`} />
                ))}
              </div>
            )}
          </div>
          <div className="p-8 flex flex-col">
            <p className="text-sm text-primary-600 font-medium mb-1">{product.category?.name || 'Product'}</p>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">{product.name}</h2>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} className={i <= Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'} />)}
              </div>
              <span className="text-sm text-gray-500">({product.numReviews} reviews)</span>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">${product.price.toFixed(2)}</span>
              {product.originalPrice && <span className="text-lg text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>}
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 line-clamp-3">{product.description}</p>
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>
            {product.stock > 0 && (
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-xl">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800"><Minus className="w-4 h-4" /></button>
                  <span className="px-5 font-medium">{qty}</span>
                  <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800"><Plus className="w-4 h-4" /></button>
                </div>
                <button onClick={handleAdd} className="btn-primary flex-1 flex items-center justify-center gap-2"><ShoppingCart className="w-5 h-5" /> Add to Cart</button>
                <button onClick={handleWishlist} className={`p-3 rounded-xl border transition-all ${isWishlisted(product._id) ? 'bg-red-50 dark:bg-red-900/20 border-red-200 text-red-500' : 'border-gray-300 dark:border-gray-700 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                  <Heart className={`w-5 h-5 ${isWishlisted(product._id) ? 'fill-red-500' : ''}`} />
                </button>
              </div>
            )}
            <div className="mt-auto grid grid-cols-3 gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
              {[
                { icon: Truck, label: 'Free Shipping', desc: 'Orders $100+' },
                { icon: Shield, label: 'Secure', desc: 'Protected payment' },
                { icon: RefreshCw, label: 'Returns', desc: '30-day return' },
              ].map((f, i) => (
                <div key={i} className="text-center">
                  <f.icon className="w-4 h-4 text-primary-600 mx-auto mb-1" />
                  <p className="text-xs font-medium text-gray-900 dark:text-gray-100">{f.label}</p>
                  <p className="text-xs text-gray-500">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
