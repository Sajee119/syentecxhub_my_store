import { Link } from 'react-router-dom';
import Seo from '../components/common/Seo';
import { useEffect } from 'react';
import { Home } from 'lucide-react';

export default function NotFound() {
  useEffect(() => { document.title = 'My Store | Page Not Found'; }, []);
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <Seo title="Page Not Found" description="The page you're looking for doesn't exist." />
      <div className="text-center">
        <h1 className="text-8xl font-extrabold text-primary-600 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Page Not Found</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2"><Home className="w-4 h-4" /> Go Home</Link>
      </div>
    </div>
  );
}
