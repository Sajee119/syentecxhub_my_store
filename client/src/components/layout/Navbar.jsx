import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, Search, Menu, X, Sun, Moon, LogOut, Package, ChevronDown, BarChart3 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import SearchSuggestions from '../common/SearchSuggestions';
import CartDrawer from '../cart/CartDrawer';

export default function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenu, setUserMenu] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const searchRef = useRef(null);
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${searchQuery.trim()}`);
      setSearchQuery('');
      setSearchOpen(false);
      setShowSuggestions(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUserMenu(false);
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold text-primary-600">
            <Package className="w-7 h-7" />
            <span className="hidden sm:inline">My Store</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Home</Link>
            <Link to="/shop" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Shop</Link>
            <Link to="/about" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">About</Link>
            <Link to="/contact" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Contact</Link>
            <Link to="/faq" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">FAQ</Link>
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              <Search className="w-5 h-5" />
            </button>

            <button onClick={toggleDarkMode} className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button onClick={() => setCartOpen(true)} className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-primary-600 text-white text-xs font-bold rounded-full">
                  {getCartCount()}
                </span>
              )}
            </button>

            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenu(!userMenu)} className="flex items-center gap-2 p-1.5 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-medium">
                    {user.name?.charAt(0)}
                  </div>
                  <ChevronDown className="w-3 h-3 hidden sm:block" />
                </button>
                {userMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenu(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 py-2 z-20 animate-scale-in">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <Link to="/account" onClick={() => setUserMenu(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <User className="w-4 h-4" /> My Account
                      </Link>
                      <Link to="/account/orders" onClick={() => setUserMenu(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <Package className="w-4 h-4" /> My Orders
                      </Link>
                      <Link to="/account/wishlist" onClick={() => setUserMenu(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <Heart className="w-4 h-4" /> Wishlist
                      </Link>
                      <Link to="/compare" onClick={() => setUserMenu(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <BarChart3 className="w-4 h-4" /> Compare
                      </Link>
                      <Link to="/track-order" onClick={() => setUserMenu(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-gray-800 pb-3 mb-1">
                        <Package className="w-4 h-4" /> Track Order
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" onClick={() => setUserMenu(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-primary-600 dark:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800">
                          <Package className="w-4 h-4" /> Admin Panel
                        </Link>
                      )}
                      <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-gray-50 dark:hover:bg-gray-800 w-full border-t border-gray-200 dark:border-gray-800">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/compare" className="hidden md:flex p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors" title="Compare">
                  <BarChart3 className="w-5 h-5" />
                </Link>
                <Link to="/login" className="btn-primary text-sm py-2 px-4">
                  Sign In
                </Link>
              </div>
            )}

            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2 text-gray-600 dark:text-gray-400">
              {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 animate-slide-down" ref={searchRef}>
          <div className="max-w-3xl mx-auto px-4 py-3 relative">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search products..." autoFocus
                className="input-field flex-1" />
              <button type="submit" className="btn-primary"><Search className="w-4 h-4" /></button>
            </form>
            {showSuggestions && searchQuery.length >= 0 && (
              <SearchSuggestions query={searchQuery} onSelect={() => { setSearchOpen(false); setShowSuggestions(false); setSearchQuery(''); }} />
            )}
          </div>
        </div>
      )}
      {searchOpen && <div className="fixed inset-0 z-[-1]" onClick={() => { setSearchOpen(false); setShowSuggestions(false); }} />}

      {mobileMenu && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 animate-slide-down">
          <div className="px-4 py-4 space-y-2">
            <Link to="/" onClick={() => setMobileMenu(false)} className="block px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">Home</Link>
            <Link to="/shop" onClick={() => setMobileMenu(false)} className="block px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">Shop</Link>
            <Link to="/about" onClick={() => setMobileMenu(false)} className="block px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">About</Link>
            <Link to="/contact" onClick={() => setMobileMenu(false)} className="block px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">Contact</Link>
            <Link to="/faq" onClick={() => setMobileMenu(false)} className="block px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">FAQ</Link>
            <Link to="/compare" onClick={() => setMobileMenu(false)} className="block px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">Compare</Link>
            <Link to="/track-order" onClick={() => setMobileMenu(false)} className="block px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">Track Order</Link>
            <button onClick={() => { setCartOpen(true); setMobileMenu(false); }} className="block w-full text-left px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              Cart ({getCartCount()})
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
