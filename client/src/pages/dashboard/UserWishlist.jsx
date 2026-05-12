import { useState, useEffect } from 'react';
import Seo from '../../components/common/Seo';
import { Heart } from 'lucide-react';
import API from '../../api/axios';
import ProductCard from '../../components/products/ProductCard';
import Breadcrumb from '../../components/common/Breadcrumb';
import EmptyState from '../../components/common/EmptyState';
import { ProductGridSkeleton } from '../../components/common/LoadingSkeleton';

export default function UserWishlist() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/wishlist').then(({ data }) => setProducts(data.wishlist?.products || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => { document.title = 'My Store | Wishlist'; }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <Seo title="My Wishlist" description="View and manage your wishlist items." />
      <Breadcrumb items={[{ label: 'My Account', path: '/account' }, { label: 'Wishlist' }]} />
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">My Wishlist</h1>
      {loading ? <ProductGridSkeleton count={4} /> : products.length === 0 ? (
        <EmptyState icon={Heart} title="Your wishlist is empty" message="Save your favorite items here." actionLabel="Browse Products" actionLink="/shop" />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => <ProductCard key={product._id} product={product} />)}
        </div>
      )}
    </div>
  );
}
