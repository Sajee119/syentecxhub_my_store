import { Link } from 'react-router-dom';
import { Award, Heart, Shield, TrendingUp, Users, Globe, ArrowRight } from 'lucide-react';
import { FaBriefcase, FaCode, FaEnvelope, FaGithub, FaLinkedin, FaPhone, FaTwitter } from 'react-icons/fa';
import Breadcrumb from '../../components/common/Breadcrumb';
import Seo from '../../components/common/Seo';
import developerProfile from '../../assets/developer-profile.png';

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
        {/* Developer Section */}
        <section data-tour="developer" className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold flex items-center gap-3 mb-6">
              <span className="text-indigo-500"><FaCode className="w-6 h-6" /></span>
              Developer
            </h2>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0">
                <div className="w-48 h-48 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  {developerProfile ? (
                    <img
                      src={developerProfile}
                      alt="Sivanadarajah Sajeepan - Developer Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-white text-6xl font-bold">SS</div>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">Sivanadarajah Sajeepan</h3>
                <p className="text-indigo-600 dark:text-indigo-400 font-semibold mb-1">Software Engineer</p>
                <p className="text-slate-500 dark:text-slate-400 mb-4">Full Stack Developer</p>
                <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                  Sajeepan is a passionate full stack developer with expertise in building modern web applications.
                  With a strong background in JavaScript, React, and Node.js, Sajeepan is dedicated to creating seamless
                  user experiences and efficient code. When not coding, Sajeepan enjoys hiking and exploring new technologies.
                </p>
                <div className="space-y-2 mb-6">
                  <p className="flex items-center gap-3 text-sm">
                    <span className="text-indigo-500 w-5"><FaEnvelope className="w-4 h-4" /></span>
                    <span className="text-slate-600 dark:text-slate-300">Sajeepan634@gmail.com</span>
                  </p>
                  <p className="flex items-center gap-3 text-sm">
                    <span className="text-indigo-500 w-5"><FaPhone className="w-4 h-4" /></span>
                    <span className="text-slate-600 dark:text-slate-300">+94783566823</span>
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://www.linkedin.com/in/sivanadaraja-sajeepan/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm font-medium"
                  >
                    <FaLinkedin className="w-4 h-4" /> LinkedIn
                  </a>
                  <a
                    href="https://github.com/Sajee119"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition text-sm font-medium"
                  >
                    <FaGithub className="w-4 h-4" /> GitHub
                  </a>
                  <a
                    href="https://x.com/SSajeepan3492"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition text-sm font-medium"
                  >
                    <FaTwitter className="w-4 h-4" /> X
                  </a>
                  <a
                    href="mailto:Sajeepan634@gmail.com"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition text-sm font-medium"
                  >
                    <FaEnvelope className="w-4 h-4" /> Email
                  </a>
                  <a
                    href="https://sajeepan-portfolio.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition text-sm font-medium"
                  >
                    <FaBriefcase className="w-4 h-4" /> Portfolio
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}
