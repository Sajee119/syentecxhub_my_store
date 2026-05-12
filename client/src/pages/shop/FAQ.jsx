import { useState, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import API from '../../api/axios';
import Breadcrumb from '../../components/common/Breadcrumb';
import Seo from '../../components/common/Seo';

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'orders', label: 'Orders' },
  { value: 'shipping', label: 'Shipping' },
  { value: 'returns', label: 'Returns' },
  { value: 'payment', label: 'Payment' },
  { value: 'account', label: 'Account' },
  { value: 'general', label: 'General' },
];

export default function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    API.get(`/faqs${category ? `?category=${category}` : ''}`).then(({ data }) => setFaqs(data.faqs)).catch(() => {});
  }, [category]);

  const filtered = faqs.filter(f =>
    !search || f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Seo title="FAQ" description="Frequently asked questions about orders, shipping, returns, and more." />
      <Breadcrumb items={[{ label: 'FAQ' }]} />
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">Frequently Asked Questions</h1>
        <p className="text-gray-500 max-w-xl mx-auto">Find answers to common questions about our products, shipping, returns, and more.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Search questions..." value={search} onChange={e => setSearch(e.target.value)}
            className="input-field pl-12 w-full" />
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)} className="input-field sm:w-48">
          {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map(faq => (
          <div key={faq._id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-200">
            <button onClick={() => setOpenId(openId === faq._id ? null : faq._id)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <span className="font-medium text-gray-900 dark:text-gray-100 pr-4">{faq.question}</span>
              <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${openId === faq._id ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${openId === faq._id ? 'max-h-96' : 'max-h-0'}`}>
              <p className="px-5 pb-5 text-gray-600 dark:text-gray-400 leading-relaxed">{faq.answer}</p>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-gray-400 py-12">No matching questions found. Try a different search or category.</p>
        )}
      </div>
    </div>
  );
}
