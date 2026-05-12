import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Eye, BarChart3 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import StarRating from '../common/StarRating';
import CompareButton from './CompareButton';
import QuickViewModal from './QuickViewModal';
import toast from 'react-hot-toast';

export default function ProductCard({ product, compareList, onCompareToggle }) {
  const [imgError, setImgError] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { user } = useAuth();
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const imageUrl = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400';

  const handleAddToCart = async (e) => {
    e.preventDefault(); e.stopPropagation();
    try { await addToCart(product._id); toast.success('Added to cart!'); }
    catch { toast.error('Failed to add'); }
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!user) return toast.error('Please login first');
    await toggleWishlist(product._id);
  };

  return (
    <>
      <Link to={`/shop/${product.slug}`} className="group glass-card overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img src={imageUrl} alt={product.name} loading="lazy"
            onError={() => setImgError(true)}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${imgError ? 'opacity-0' : ''}`} />
          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">-{discount}%</span>
          )}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <button onClick={handleToggleWishlist}
              className={`p-2 rounded-full backdrop-blur-md transition-all duration-200 opacity-0 group-hover:opacity-100 ${isWishlisted(product._id) ? 'bg-red-500 text-white opacity-100' : 'bg-white/80 dark:bg-gray-900/80 text-gray-600 dark:text-gray-300 hover:bg-red-500 hover:text-white'}`}>
              <Heart className={`w-4 h-4 ${isWishlisted(product._id) ? 'fill-white' : ''}`} />
            </button>
            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowQuickView(true); }}
              className="p-2 rounded-full bg-white/80 dark:bg-gray-900/80 text-gray-600 dark:text-gray-300 hover:bg-primary-600 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-200">
              <Eye className="w-4 h-4" />
            </button>
          </div>
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">Out of Stock</span>
            </div>
          )}
          <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <CompareButton product={product} compareList={compareList || []} onToggle={onCompareToggle || (() => {})} />
          </div>
        </div>
        <div className="p-4">
          <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">{product.brand || product.category?.name || 'General'}</p>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{product.name}</h3>
          <StarRating rating={product.rating} size={14} showValue />
          <div className="flex items-center gap-2 mt-2">
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">${product.price.toFixed(2)}</span>
            {product.originalPrice && <span className="text-sm text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>}
          </div>
        </div>
      </Link>
      {showQuickView && <QuickViewModal product={product} onClose={() => setShowQuickView(false)} />}
    </>
  );
}
