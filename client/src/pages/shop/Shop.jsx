import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import API from '../../api/axios';
import ProductCard from '../../components/products/ProductCard';
import Pagination from '../../components/common/Pagination';
import Seo from '../../components/common/Seo';
import { ProductGridSkeleton } from '../../components/common/LoadingSkeleton';
import Breadcrumb from '../../components/common/Breadcrumb';

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Best Rated' },
  { value: 'name', label: 'Name' },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  useEffect(() => { document.title = 'My Store | Shop'; }, []);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const page = parseInt(searchParams.get('page')) || 1;
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sortBy = searchParams.get('sortBy') || 'newest';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  useEffect(() => {
    API.get('/categories').then(({ data }) => setCategories(data.categories)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 12, sortBy });
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    API.get(`/products?${params}`).then(({ data }) => {
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [page, category, search, sortBy, minPrice, maxPrice]);

  const updateParams = (updates) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasFilters = category || search || minPrice || maxPrice;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Seo title="Shop" description="Browse our complete collection of products. Find exactly what you need." keywords="shop, products, buy online, shopping" />
      <Breadcrumb items={[{ label: 'Shop' }]} />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Shop</h1>
          <p className="text-gray-500 text-sm mt-1">{total} products found</p>
        </div>
        <div className="flex items-center gap-4">
          <select value={sortBy} onChange={(e) => updateParams({ sortBy: e.target.value, page: '' })}
            className="input-field py-2 pr-8 text-sm">
            {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden p-2 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        <aside className={`${showFilters ? 'fixed inset-0 z-50 flex' : 'hidden'} lg:block lg:w-64 shrink-0`}>
          <div className={`${showFilters ? 'w-80 bg-white dark:bg-gray-900 h-full overflow-y-auto p-6' : ''} lg:w-auto lg:p-0 lg:bg-transparent`}>
            {showFilters && (
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <h3 className="font-semibold text-lg">Filters</h3>
                <button onClick={() => setShowFilters(false)}><X className="w-5 h-5" /></button>
              </div>
            )}
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Categories</h3>
                <div className="space-y-2">
                  <button onClick={() => updateParams({ category: '', page: '' })}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!category ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                    All Categories
                  </button>
                  {categories.map(cat => (
                    <button key={cat._id} onClick={() => updateParams({ category: cat._id, page: '' })}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${category === cat._id ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Price Range</h3>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min" value={minPrice} onChange={(e) => updateParams({ minPrice: e.target.value, page: '' })}
                    className="input-field py-2 text-sm w-1/2" />
                  <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => updateParams({ maxPrice: e.target.value, page: '' })}
                    className="input-field py-2 text-sm w-1/2" />
                </div>
              </div>
              {hasFilters && (
                <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-600 font-medium">
                  Clear all filters
                </button>
              )}
            </div>
          </div>
          {showFilters && <div className="flex-1 bg-black/50 lg:hidden" onClick={() => setShowFilters(false)} />}
        </aside>

        <div className="flex-1">
          {hasFilters && (
            <div className="flex flex-wrap gap-2 mb-6">
              {category && <span className="badge bg-primary-50 dark:bg-primary-900/20 text-primary-600 gap-1">Category <button onClick={() => updateParams({ category: '' })}><X className="w-3 h-3" /></button></span>}
              {search && <span className="badge bg-primary-50 dark:bg-primary-900/20 text-primary-600 gap-1">Search: {search} <button onClick={() => updateParams({ search: '' })}><X className="w-3 h-3" /></button></span>}
            </div>
          )}
          {loading ? (
            <ProductGridSkeleton />
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No products found</p>
              <button onClick={clearFilters} className="btn-primary mt-4">Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {products.map(product => <ProductCard key={product._id} product={product} />)}
              </div>
              <Pagination page={page} pages={pages} onPageChange={(p) => updateParams({ page: p.toString() })} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
