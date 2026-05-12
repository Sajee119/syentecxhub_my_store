import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

export default function EmptyState({ icon: Icon = ShoppingBag, title = 'Nothing here', message = 'There are no items to display.', actionLabel, actionLink }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
      <p className="text-gray-500 mb-8 max-w-sm">{message}</p>
      {actionLabel && actionLink && (
        <Link to={actionLink} className="btn-primary">{actionLabel}</Link>
      )}
    </div>
  );
}
