import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function FloatingCart({ onClick }) {
  const { getCartCount } = useCart();
  const count = getCartCount();

  return (
    <button onClick={onClick} aria-label="Open cart"
      className="fixed bottom-20 right-6 z-50 md:hidden w-14 h-14 rounded-full bg-primary-600 text-white shadow-xl 
        flex items-center justify-center hover:bg-primary-700 active:scale-90 transition-all
        hover:shadow-primary-500/30 animate-fade-in">
      <ShoppingBag className="w-6 h-6" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full ring-2 ring-white dark:ring-gray-900">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
}
