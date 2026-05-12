import { Star } from 'lucide-react';

export default function StarRating({ rating = 0, size = 16, showValue = true }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={size} className={`${i <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
      ))}
      {showValue && <span className="text-xs text-gray-500 ml-1">({rating})</span>}
    </div>
  );
}
