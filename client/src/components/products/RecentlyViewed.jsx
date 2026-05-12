import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import StarRating from '../common/StarRating';

export default function RecentlyViewed() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      setProducts(stored.slice(0, 6));
    } catch { setProducts([]); }
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Recently Viewed</h2>
            <p className="text-sm text-gray-500">Products you've checked out</p>
          </div>
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {products.map(product => (
          <Link key={product._id} to={`/shop/${product.slug}`} className="min-w-[180px] md:min-w-[220px] glass-card overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shrink-0">
            <div className="aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
            </div>
            <div className="p-3">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{product.brand || 'Product'}</p>
              <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100 line-clamp-1">{product.name}</h3>
              <div className="flex items-center justify-between mt-2">
                <span className="font-bold text-gray-900 dark:text-gray-100">${product.price?.toFixed(2)}</span>
                {product.originalPrice && <span className="text-xs text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function addRecentlyViewed(product) {
  if (!product?._id) return;
  try {
    const stored = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    const filtered = stored.filter(p => p._id !== product._id);
    const entry = {
      _id: product._id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images?.[0]?.url || '',
      brand: product.brand,
    };
    filtered.unshift(entry);
    localStorage.setItem('recentlyViewed', JSON.stringify(filtered.slice(0, 12)));
  } catch {}
}
