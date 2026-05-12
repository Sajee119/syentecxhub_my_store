import { Link } from 'react-router-dom';
import Seo from '../../components/common/Seo';
import { X, Star, BarChart3, Trash2, ShoppingCart, Minus, Plus } from 'lucide-react';
import { useCompare } from '../../components/products/CompareButton';
import { useCart } from '../../context/CartContext';
import Breadcrumb from '../../components/common/Breadcrumb';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

const specLabels = { brand: 'Brand', category: 'Category', stock: 'Availability', rating: 'Rating' };

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();

  const handleAddAll = async () => {
    for (const p of compareList) {
      try { await addToCart(p._id); } catch {}
    }
    toast.success('Added all to cart!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Seo title="Compare Products" description="Compare products side by side to find the best choice for you." />
      <Breadcrumb items={[{ label: 'Compare Products' }]} />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Compare Products</h1>
          <p className="text-gray-500 text-sm mt-1">{compareList.length} of 4 products selected</p>
        </div>
        <div className="flex gap-2">
          {compareList.length > 1 && (
            <button onClick={handleAddAll} className="btn-primary text-sm flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" /> Add All to Cart
            </button>
          )}
          {compareList.length > 0 && (
            <button onClick={clearCompare} className="btn-secondary text-sm flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> Clear All
            </button>
          )}
        </div>
      </div>

      {compareList.length === 0 ? (
        <EmptyState icon={BarChart3} title="No products to compare" message="Add products to compare by clicking the Compare button on any product." actionLabel="Browse Products" actionLink="/shop" />
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[640px]">
            <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${compareList.length}, 1fr)` }}>
              <div className="sticky left-0" />
              {compareList.map(product => (
                <div key={product._id} className="relative">
                  <button onClick={() => removeFromCompare(product._id)} className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors z-10 shadow-lg">
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <Link to={`/shop/${product.slug}`} className="block glass-card overflow-hidden group">
                    <div className="aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{product.category || product.brand || 'Product'}</p>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 mb-2 min-h-[3rem]">{product.name}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl font-bold text-gray-900 dark:text-gray-100">${product.price?.toFixed(2)}</span>
                        {product.originalPrice && <span className="text-sm text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}

              {compareList.length < 4 && (
                <div className="flex items-center justify-center min-h-[200px]">
                  <Link to="/shop" className="text-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl hover:border-primary-400 dark:hover:border-primary-600 transition-colors group">
                    <BarChart3 className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2 group-hover:text-primary-500 transition-colors" />
                    <p className="text-sm text-gray-500 group-hover:text-primary-600 transition-colors">Add product</p>
                  </Link>
                </div>
              )}

              {['brand', 'category', 'stock', 'rating'].map(key => (
                <div key={key} className="contents">
                  <div className="py-4 px-4 font-medium text-gray-500 text-sm bg-gray-50 dark:bg-gray-800/50 rounded-lg">{specLabels[key]}</div>
                  {compareList.map(product => (
                    <div key={`${product._id}-${key}`} className="py-4 px-4 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 rounded-lg">
                      {key === 'rating' ? (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{product.rating || 0}</span>
                        </div>
                      ) : key === 'stock' ? (
                        <span className={product.stock > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                          {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      ) : (
                        product[key] || '-'
                      )}
                    </div>
                  ))}
                </div>
              ))}

              <div className="contents">
                <div className="py-4 px-4 font-medium text-gray-500 text-sm bg-gray-50 dark:bg-gray-800/50 rounded-lg">Description</div>
                {compareList.map(product => (
                  <div key={`${product._id}-desc`} className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 rounded-lg leading-relaxed">
                    {product.description || 'No description available'}
                  </div>
                ))}
              </div>

              <div className="contents">
                <div className="py-4 px-4 font-medium text-gray-500 text-sm bg-gray-50 dark:bg-gray-800/50 rounded-lg">Action</div>
                {compareList.map(product => (
                  <div key={`${product._id}-action`} className="py-4 px-4 bg-white dark:bg-gray-900 rounded-lg">
                    <button onClick={() => { addToCart(product._id); toast.success('Added to cart!'); }}
                      className="btn-primary text-sm w-full flex items-center justify-center gap-2">
                      <ShoppingCart className="w-4 h-4" /> Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
