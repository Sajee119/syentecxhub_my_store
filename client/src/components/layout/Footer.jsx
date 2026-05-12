import { Link } from 'react-router-dom';
import { Package, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold text-white mb-4">
              <Package className="w-7 h-7 text-primary-400" /> My Store
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">Your premium destination for quality products. Shop with confidence and enjoy fast, free shipping.</p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary-600 flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: 'Home', path: '/' },
                { label: 'Shop All', path: '/shop' },
                { label: 'About Us', path: '/about' },
                { label: 'Contact', path: '/contact' },
                { label: 'Track Order', path: '/track-order' },
              ].map(link => (
                <li key={link.label}>
                  <Link to={link.path} className="text-gray-400 hover:text-primary-400 transition-colors text-sm">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-6">Customer Service</h3>
            <ul className="space-y-3">
              {[
                { label: 'My Account', path: '/account' },
                { label: 'Order Tracker', path: '/account/orders' },
                { label: 'FAQ', path: '#' },
                { label: 'Shipping Info', path: '#' },
                { label: 'Returns', path: '#' },
              ].map(link => (
                <li key={link.label}>
                  <Link to={link.path} className="text-gray-400 hover:text-primary-400 transition-colors text-sm">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-400 mt-0.5 shrink-0" />
                <span className="text-sm text-gray-400">123 Commerce St, Suite 100, San Francisco, CA 94102</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-400 shrink-0" />
                <a href="mailto:support@mystore.com" className="text-sm text-gray-400 hover:text-primary-400">support@mystore.com</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-400 shrink-0" />
                <a href="tel:+18001234567" className="text-sm text-gray-400 hover:text-primary-400">+1 (800) 123-4567</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">&copy; 2026 My Store. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link to="#" className="hover:text-primary-400">Privacy Policy</Link>
            <Link to="#" className="hover:text-primary-400">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
