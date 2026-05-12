import { Link } from 'react-router-dom';
import Seo from '../../components/common/Seo';
import { useEffect } from 'react';
import { User, Package, Heart, MapPin, Settings, ChevronRight, ShoppingBag, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Breadcrumb from '../../components/common/Breadcrumb';

const links = [
  { icon: User, label: 'My Profile', desc: 'Manage your personal information', path: '/account/profile' },
  { icon: Package, label: 'Order History', desc: 'View and track your orders', path: '/account/orders' },
  { icon: Heart, label: 'Wishlist', desc: 'Products you love', path: '/account/wishlist' },
  { icon: MapPin, label: 'Addresses', desc: 'Manage your shipping addresses', path: '/account/addresses' },
];

export default function UserDashboard() {
  const { user } = useAuth();

  useEffect(() => { document.title = 'My Store | Account'; }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Seo title="My Dashboard" description="Manage your account, orders, and preferences." />
      <Breadcrumb items={[{ label: 'My Account' }]} />
      <div className="glass-card p-8 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center text-white text-2xl font-bold">
            {user?.name?.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Welcome, {user?.name}!</h1>
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {links.map(link => (
          <Link key={link.path} to={link.path} className="glass-card-hover p-6 flex items-center gap-4 group">
            <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center shrink-0">
              <link.icon className="w-6 h-6 text-primary-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{link.label}</h3>
              <p className="text-sm text-gray-500">{link.desc}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}
