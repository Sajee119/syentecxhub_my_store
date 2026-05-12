import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, Shield, RefreshCw, Headphones, ShoppingBag, Sparkles } from 'lucide-react';
import API from '../../api/axios';
import ProductCard from '../../components/products/ProductCard';
import RecentlyViewed from '../../components/products/RecentlyViewed';
import ScrollReveal from '../../components/common/ScrollReveal';
import CountdownTimer from '../../components/common/CountdownTimer';
import Seo from '../../components/common/Seo';
import { ProductCardSkeleton } from '../../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';

const heroSlides = [
  { title: 'Summer Sale', subtitle: 'Up to 50% off', description: 'Discover amazing deals on top brands', bg: 'from-indigo-600 to-purple-700', img: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200' },
  { title: 'New Arrivals', subtitle: '2026 Collection', description: 'Be the first to explore our newest products', bg: 'from-emerald-600 to-teal-700', img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200' },
  { title: 'Free Shipping', subtitle: 'On orders $100+', description: 'Shop now and enjoy free delivery worldwide', bg: 'from-orange-600 to-red-700', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200' },
];

const categories = [
  { name: 'Electronics', icon: '🖥️', slug: 'electronics', color: 'from-blue-500 to-blue-600' },
  { name: 'Clothing', icon: '👕', slug: 'clothing', color: 'from-pink-500 to-pink-600' },
  { name: 'Home & Garden', icon: '🏡', slug: 'home-garden', color: 'from-green-500 to-green-600' },
  { name: 'Sports', icon: '⚽', slug: 'sports-outdoors', color: 'from-orange-500 to-orange-600' },
  { name: 'Books', icon: '📚', slug: 'books', color: 'from-purple-500 to-purple-600' },
  { name: 'Beauty', icon: '💄', slug: 'beauty', color: 'from-rose-500 to-rose-600' },
  { name: 'Toys', icon: '🎮', slug: 'toys-games', color: 'from-yellow-500 to-yellow-600' },
  { name: 'Automotive', icon: '🚗', slug: 'automotive', color: 'from-red-500 to-red-600' },
];

const testimonials = [
  { name: 'Sarah Johnson', text: 'Amazing quality products and fast shipping! Highly recommend My Store for all your shopping needs.', rating: 5, role: 'Verified Buyer' },
  { name: 'Michael Chen', text: 'The customer service is outstanding. They went above and beyond to help me with my order.', rating: 5, role: 'Verified Buyer' },
  { name: 'Emily Davis', text: 'Best online shopping experience. Great prices, easy returns, and the quality exceeded my expectations.', rating: 5, role: 'Verified Buyer' },
];

const features = [
  { icon: Truck, title: 'Free Shipping', desc: 'Free shipping on orders over $100' },
  { icon: Shield, title: 'Secure Payment', desc: '100% secure payment processing' },
  { icon: RefreshCw, title: 'Easy Returns', desc: '30-day hassle-free return policy' },
  { icon: Headphones, title: '24/7 Support', desc: 'Round-the-clock customer support' },
];

export default function Home() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const emailRef = useRef();

  const saleEndDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  useEffect(() => {
    const timer = setInterval(() => setHeroIndex(i => (i + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    API.get('/products/featured').then(({ data }) => setFeaturedProducts(data.products)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleNewsletter = async (e) => {
    e.preventDefault();
    const email = emailRef.current?.value;
    if (!email) return;
    try {
      await API.post('/auth/newsletter', { email });
      toast.success('Subscribed to newsletter!');
      emailRef.current.value = '';
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to subscribe');
    }
  };

  return (
    <div>
      <Seo title="Home" description="Discover amazing products at great prices. Shop the latest trends at MyStore." keywords="ecommerce, online store, shopping, products" />
      <section className="relative overflow-hidden">
        {heroSlides.map((slide, i) => (
          <div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i === heroIndex ? 'opacity-100' : 'opacity-0'}`}>
            <img src={slide.img} alt="" className="w-full h-full object-cover" />
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.bg} opacity-90`} />
          </div>
        ))}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-36">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 animate-fade-in">{heroSlides[heroIndex].title}</h1>
            <p className="text-2xl md:text-4xl font-bold text-white/90 mb-2">{heroSlides[heroIndex].subtitle}</p>
            <p className="text-lg text-white/80 mb-8">{heroSlides[heroIndex].description}</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop" className="bg-white text-gray-900 font-semibold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all active:scale-95 inline-flex items-center gap-2">
                Shop Now <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/shop?sortBy=newest" className="border-2 border-white text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all active:scale-95">
                New Arrivals
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, i) => (
            <button key={i} onClick={() => setHeroIndex(i)} className={`w-2.5 h-2.5 rounded-full transition-all ${i === heroIndex ? 'bg-white w-8' : 'bg-white/50'}`} />
          ))}
        </div>
      </section>

      <ScrollReveal>
        <section className="relative -mt-12 max-w-7xl mx-auto px-4 sm:px-6 z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <div key={i} className="glass rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-3">
                  <f.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Featured Products</h2>
              <p className="text-gray-500 mt-1">Hand-picked just for you</p>
            </div>
            <Link to="/shop?featured=true" className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />) :
              featuredProducts.map(product => <ProductCard key={product._id} product={product} />)}
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={50}>
        <RecentlyViewed />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <section className="bg-gradient-to-r from-primary-600 to-purple-700 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-flex items-center gap-1 bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-4">
                  <Sparkles className="w-4 h-4" /> Limited Time Offer
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Summer Sale is Here!</h2>
                <p className="text-white/80 mb-4 text-lg">Get up to 50% off on selected items. Don't miss out!</p>
                <CountdownTimer targetDate={saleEndDate} className="mb-6" />
                <Link to="/shop" className="inline-flex items-center gap-2 bg-white text-gray-900 font-semibold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all active:scale-95">
                  Shop the Sale <ShoppingBag className="w-5 h-5" />
                </Link>
              </div>
              <div className="relative">
                <div className="text-8xl font-extrabold text-white/10 text-center">50% OFF</div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-white">50%</div>
                    <p className="text-white/80 text-lg">OFF SELECT ITEMS</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Shop by Category</h2>
            <p className="text-gray-500">Find exactly what you're looking for</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-stretch">
            {categories.map((cat, i) => (
              <ScrollReveal key={cat.slug} delay={i * 80}>
                <Link
                  to={`/shop?category=${cat.slug}`}
                  className={`group relative flex h-full overflow-hidden rounded-2xl bg-gradient-to-br ${cat.color} p-6 text-white shadow-lg ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:ring-white/10`}
                >
                  <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10 dark:group-hover:bg-black/20" />
                  <div className="relative flex w-full min-h-[150px] flex-col justify-between">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-4xl backdrop-blur-sm ring-1 ring-white/20">
                      {cat.icon}
                    </span>
                    <div>
                      <h3 className="font-semibold text-lg leading-tight text-white drop-shadow-sm">{cat.name}</h3>
                      <p className="mt-2 text-sm text-white/85 transition-transform duration-300 group-hover:translate-x-1">
                        Shop now →
                      </p>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={50}>
        <section className="bg-gray-900 dark:bg-gray-950 py-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Stay in the Loop</h2>
            <p className="text-gray-400 mb-8">Subscribe to our newsletter and get exclusive deals, new arrivals, and more!</p>
            <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input ref={emailRef} type="email" placeholder="Enter your email" required className="flex-1 px-5 py-3.5 rounded-xl bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-primary-500 outline-none" />
              <button type="submit" className="btn-primary whitespace-nowrap">Subscribe</button>
            </form>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
