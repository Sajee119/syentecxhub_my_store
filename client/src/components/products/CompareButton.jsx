import { useState, useEffect } from 'react';
import { BarChart3, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export function useCompare() {
  const [compareList, setCompareList] = useState(() => {
    try { return JSON.parse(localStorage.getItem('compareList') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('compareList', JSON.stringify(compareList));
  }, [compareList]);

  const addToCompare = (product) => {
    if (compareList.length >= 4) return toast.error('Maximum 4 products to compare');
    if (compareList.some(p => p._id === product._id)) return toast('Already in compare list');
    const entry = {
      _id: product._id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images?.[0]?.url || '',
      rating: product.rating,
      description: product.description?.slice(0, 150),
      brand: product.brand,
      stock: product.stock,
      category: product.category?.name || '',
    };
    setCompareList(prev => [...prev, entry]);
    toast.success('Added to compare');
  };

  const removeFromCompare = (id) => {
    setCompareList(prev => prev.filter(p => p._id !== id));
  };

  const clearCompare = () => setCompareList([]);

  const isInCompare = (id) => compareList.some(p => p._id === id);

  return { compareList, addToCompare, removeFromCompare, clearCompare, isInCompare };
}

export default function CompareButton({ product, compareList, onToggle, className = '' }) {
  const isActive = compareList.some(p => p._id === product._id);

  return (
    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggle(product); }}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${isActive ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 border border-primary-200 dark:border-primary-800' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 border border-transparent'} ${className}`}>
      {isActive ? <Check className="w-3.5 h-3.5" /> : <BarChart3 className="w-3.5 h-3.5" />}
      {isActive ? 'Added' : 'Compare'}
    </button>
  );
}
