import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCart, Heart, Minus, Plus, Star, Truck, Shield, RefreshCw, Bell } from 'lucide-react';
import API from '../../api/axios';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import StarRating from '../../components/common/StarRating';
import ProductCard from '../../components/products/ProductCard';
import ImageZoom from '../../components/products/ImageZoom';
import Seo from '../../components/common/Seo';
import ShareButtons from '../../components/common/ShareButtons';
import Breadcrumb from '../../components/common/Breadcrumb';
import { addRecentlyViewed } from '../../components/products/RecentlyViewed';
import toast from 'react-hot-toast';

export default function ProductDetails() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selectedImg, setSelectedImg] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [backInStockEmail, setBackInStockEmail] = useState('');
  const [subscribingStock, setSubscribingStock] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    API.get(`/products/${slug}`).then(({ data }) => {
      setProduct(data.product);
      if (data.product) addRecentlyViewed(data.product);
      setSelectedImg(0);
      API.get(`/products/${data.product._id}/related`).then(({ data: d }) => setRelated(d.products)).catch(() => {});
      API.get(`/reviews/product/${data.product._id}`).then(({ data: d }) => setReviews(d.reviews)).catch(() => {});
    }).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = async () => {
    try { await addToCart(product._id, qty); toast.success('Added to cart!'); }
    catch { toast.error('Failed to add'); }
  };

  const handleToggleWishlist = async () => {
    if (!user) return toast.error('Please login first');
    const res = await toggleWishlist(product._id);
    toast.success(res ? 'Added to wishlist' : 'Removed from wishlist');
  };

  const handleBackInStock = async (e) => {
    e.preventDefault();
    if (!backInStockEmail.trim()) return toast.error('Enter your email');
    setSubscribingStock(true);
    try {
      await API.post('/back-in-stock', { email: backInStockEmail, productId: product._id });
      toast.success('We will notify you when back in stock!');
      setBackInStockEmail('');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to subscribe'); }
    finally { setSubscribingStock(false); }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to review');
    setSubmittingReview(true);
    try {
      await API.post(`/reviews/product/${product._id}`, reviewForm);
      toast.success('Review submitted!');
      setReviewForm({ rating: 5, title: '', comment: '' });
      const { data } = await API.get(`/reviews/product/${product._id}`);
      setReviews(data.reviews);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSubmittingReview(false); }
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-12"><div className="grid md:grid-cols-2 gap-12 animate-pulse"><div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-2xl" /><div className="space-y-4"><div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4" /><div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4" /><div className="h-20 bg-gray-200 dark:bg-gray-800 rounded" /></div></div></div>;
  if (!product) return <div className="text-center py-20 text-gray-500">Product not found</div>;

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const images = product.images?.length ? product.images : [{ url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600', alt: product.name }];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Seo title={product?.name} description={product?.description?.slice(0, 160)} keywords={`${product?.name}, buy ${product?.name}, ${product?.category?.name}`} />
      <Breadcrumb items={[{ label: 'Shop', path: '/shop' }, { label: product.name }]} />
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-4">
            <ImageZoom src={images[selectedImg]?.url} alt={product.name} className="w-full h-full" />
          </div>
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImg(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${i === selectedImg ? 'border-primary-500' : 'border-transparent hover:border-gray-300'}`}>
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <p className="text-sm text-primary-600 font-medium mb-2">{product.category?.name}</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">{product.name}</h1>
          <StarRating rating={product.rating} size={18} />
          <div className="flex items-center gap-3 mt-4 mb-6">
            <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <>
                <span className="text-xl text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                <span className="badge bg-red-100 dark:bg-red-900/30 text-red-600 text-sm">-{discount}% OFF</span>
              </>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">{product.description}</p>
          <div className="flex items-center gap-2 mb-4">
            <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </span>
          </div>
          {product.stock === 0 && (
            <form onSubmit={handleBackInStock} className="flex gap-2 mb-6">
              <input type="email" placeholder="your@email.com" value={backInStockEmail} onChange={e => setBackInStockEmail(e.target.value)}
                className="input-field flex-1 text-sm" required />
              <button type="submit" disabled={subscribingStock} className="btn-primary text-sm flex items-center gap-1 shrink-0">
                <Bell className="w-4 h-4" /> {subscribingStock ? '...' : 'Notify Me'}
              </button>
            </form>
          )}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-xl">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800"><Minus className="w-4 h-4" /></button>
              <span className="px-6 font-medium">{qty}</span>
              <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800"><Plus className="w-4 h-4" /></button>
            </div>
            <button onClick={handleAddToCart} disabled={product.stock === 0} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
            <button onClick={handleToggleWishlist} className={`p-3 rounded-xl border transition-all ${isWishlisted(product._id) ? 'bg-red-50 dark:bg-red-900/20 border-red-200 text-red-500' : 'border-gray-300 dark:border-gray-700 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
              <Heart className={`w-5 h-5 ${isWishlisted(product._id) ? 'fill-red-500' : ''}`} />
            </button>
          </div>
          <ShareButtons className="mb-6" />
          <div className="grid grid-cols-3 gap-4 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
            {[
              { icon: Truck, label: 'Free Shipping', desc: 'On orders $100+' },
              { icon: Shield, label: 'Secure', desc: 'Protected payment' },
              { icon: RefreshCw, label: 'Easy Returns', desc: '30-day return' },
            ].map((f, i) => (
              <div key={i} className="text-center">
                <f.icon className="w-5 h-5 text-primary-600 mx-auto mb-1" />
                <p className="text-xs font-medium text-gray-900 dark:text-gray-100">{f.label}</p>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Customer Reviews</h2>
        {user && (
          <form onSubmit={handleReviewSubmit} className="glass-card p-6 mb-8">
            <h3 className="font-semibold mb-4">Write a Review</h3>
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map(i => (
                <button key={i} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: i })}>
                  <Star className={`w-6 h-6 ${i <= reviewForm.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                </button>
              ))}
            </div>
            <input type="text" placeholder="Review title (optional)" value={reviewForm.title} onChange={e => setReviewForm({ ...reviewForm, title: e.target.value })} className="input-field mb-3" />
            <textarea placeholder="Write your review..." value={reviewForm.comment} onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })} required className="input-field mb-3 min-h-[100px]" />
            <button type="submit" disabled={submittingReview} className="btn-primary">{submittingReview ? 'Submitting...' : 'Submit Review'}</button>
          </form>
        )}
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review._id} className="glass-card p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-medium">
                      {review.user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{review.user?.name || 'Anonymous'}</p>
                      <StarRating rating={review.rating} size={14} showValue={false} />
                    </div>
                  </div>
                </div>
                {review.title && <p className="font-medium mb-1">{review.title}</p>}
                <p className="text-gray-600 dark:text-gray-400 text-sm">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {related.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
