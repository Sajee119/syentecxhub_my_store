import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, Package } from 'lucide-react';
import API from '../../api/axios';

const popularSearches = ['headphones', 'shoes', 'watch', 'drone', 'speaker', 'wallet'];

export default function SearchSuggestions({ query, onSelect }) {
  const [suggestions, setSuggestions] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/products?search=${query}&limit=5`);
        setSuggestions(data.products || []);
      } catch { setSuggestions([]); }
      finally { setLoading(false); }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    API.get('/products/featured').then(({ data }) => setPopular((data.products || []).slice(0, 4))).catch(() => {});
  }, []);

  const handleSelect = (slug) => {
    onSelect?.();
    navigate(`/shop/${slug}`);
  };

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden z-50 animate-scale-in">
      {query.length >= 2 ? (
        <>
          {loading && <div className="p-4 text-center text-sm text-gray-500">Searching...</div>}
          {!loading && suggestions.length === 0 && (
            <div className="p-6 text-center">
              <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No products found for "{query}"</p>
            </div>
          )}
          {suggestions.length > 0 && (
            <div className="p-2">
              <p className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Suggestions</p>
              {suggestions.map(product => (
                <button key={product._id} onClick={() => handleSelect(product.slug)}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left">
                  <img src={product.images?.[0]?.url || ''} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">${product.price.toFixed(2)}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="p-4">
          {popular.length > 0 && (
            <>
              <p className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                <TrendingUp className="w-3 h-3" /> Popular Products
              </p>
              <div className="grid grid-cols-2 gap-2">
                {popular.map(product => (
                  <button key={product._id} onClick={() => handleSelect(product.slug)}
                    className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0">
                      <img src={product.images?.[0]?.url || ''} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">${product.price.toFixed(2)}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
          <p className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider my-3">
            <Package className="w-3 h-3" /> Popular Searches
          </p>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map(term => (
              <button key={term} onClick={() => { onSelect?.(); navigate(`/shop?search=${term}`); }}
                className="px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 transition-colors">
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
