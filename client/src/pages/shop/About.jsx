import { Link } from 'react-router-dom';
import { Award, Heart, Shield, TrendingUp, Users, Globe, ArrowRight } from 'lucide-react';
import Breadcrumb from '../../components/common/Breadcrumb';
import Seo from '../../components/common/Seo';

const stats = [
  { icon: Users, value: '50K+', label: 'Happy Customers' },
  { icon: Award, value: '10K+', label: 'Products' },
  { icon: Globe, value: '50+', label: 'Countries' },
  { icon: TrendingUp, value: '99%', label: 'Satisfaction' },
];

const values = [
  { icon: Heart, title: 'Customer First', desc: 'Every decision we make starts with our customers. Your satisfaction drives everything we do.' },
  { icon: Shield, title: 'Quality Guaranteed', desc: 'We stand behind every product we sell. If you are not happy, we make it right.' },
  { icon: TrendingUp, title: 'Innovation', desc: 'We constantly evolve to bring you the latest trends and best shopping experience.' },
  { icon: Globe, title: 'Sustainability', desc: 'Committed to eco-friendly practices and sustainable sourcing across our supply chain.' },
];

const team = [
  { name: 'Sarah Mitchell', role: 'CEO & Founder', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200' },
  { name: 'David Chen', role: 'CTO', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' },
  { name: 'Emily Rodriguez', role: 'Head of Design', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200' },
  { name: 'James Wilson', role: 'VP of Operations', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200' },
];

export default function About() {
  return (
    <div>
      <Seo title="About Us" description="Learn about MyStore - our mission, values, and team." />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Breadcrumb items={[{ label: 'About' }]} />
      </div>

      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-purple-700 py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">Our Story</h1>
          <p className="text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
            We started with a simple mission: make quality products accessible to everyone. 
            Today, we serve thousands of customers worldwide with the same passion and commitment.
          </p>
        </div>
      </section>

      <div className="relative -mt-12 max-w-6xl mx-auto px-4 sm:px-6 z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="glass rounded-2xl p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mx-auto mb-3">
                <s.icon className="w-6 h-6 text-primary-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-flex items-center gap-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
              Who We Are
            </span>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">More Than Just a Store</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              Founded in 2024, My Store has grown from a small startup to a leading e-commerce platform. 
              We believe in providing exceptional products at fair prices, backed by outstanding customer service.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              Our curated selection features thousands of products across multiple categories, 
              each chosen for quality, value, and customer appeal. We work directly with trusted 
              manufacturers and brands to bring you the best prices without compromising on quality.
            </p>
            <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
              Explore Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600" alt="Our team at work" className="rounded-3xl shadow-2xl" />
            <div className="absolute -bottom-6 -left-6 glass rounded-2xl p-5 shadow-xl">
              <p className="text-2xl font-bold text-primary-600">10K+</p>
              <p className="text-sm text-gray-500">Products Delivered</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 dark:bg-gray-900/50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Our Values</h2>
            <p className="text-gray-500">The principles that guide everything we do</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i} className="glass-card p-6 text-center hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Meet Our Team</h2>
          <p className="text-gray-500">The people behind My Store</p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {team.map((member, i) => (
            <div key={i} className="text-center group">
              <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden ring-4 ring-primary-100 dark:ring-primary-900/30 group-hover:ring-primary-300 transition-all">
                <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{member.name}</h3>
              <p className="text-sm text-gray-500">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
