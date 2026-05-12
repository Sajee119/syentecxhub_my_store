import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, ChevronRight } from 'lucide-react';
import Breadcrumb from '../../components/common/Breadcrumb';
import Seo from '../../components/common/Seo';
import toast from 'react-hot-toast';

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'support@mystore.com', href: 'mailto:support@mystore.com' },
  { icon: Phone, label: 'Phone', value: '+1 (800) 123-4567', href: 'tel:+18001234567' },
  { icon: MapPin, label: 'Address', value: '123 Commerce St, Suite 100, San Francisco, CA 94102' },
  { icon: Clock, label: 'Hours', value: 'Mon-Fri: 9AM-6PM EST' },
];

const faqs = [
  { q: 'How long does shipping take?', a: 'Standard shipping takes 5-7 business days. Express shipping is 2-3 business days.' },
  { q: 'What is your return policy?', a: 'We offer a 30-day hassle-free return policy for all unused items in original packaging.' },
  { q: 'Do you ship internationally?', a: 'Yes, we ship to over 50 countries worldwide. International shipping takes 7-14 business days.' },
  { q: 'How can I track my order?', a: 'Once shipped, you\'ll receive a tracking number via email. You can also track on our Order Tracking page.' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      toast.success('Message sent! We\'ll get back to you soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
      setSending(false);
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <Seo title="Contact Us" description="Get in touch with our team. We're here to help with any questions or concerns." />
      <Breadcrumb items={[{ label: 'Contact' }]} />
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">Get in Touch</h1>
        <p className="text-gray-500 max-w-xl mx-auto">Have a question, concern, or feedback? We'd love to hear from you. Our team is here to help.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        <div className="glass-card p-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary-600" /> Send us a Message
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="input-field" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className="input-field" placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Subject</label>
              <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required className="input-field" placeholder="How can we help?" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required rows={5} className="input-field resize-none" placeholder="Tell us more about your inquiry..." />
            </div>
            <button type="submit" disabled={sending} className="btn-primary flex items-center gap-2">
              {sending ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> : <Send className="w-4 h-4" />}
              {sending ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        <div>
          <div className="space-y-4 mb-8">
            {contactInfo.map((item, i) => (
              <div key={i} className="glass-card p-5 flex items-center gap-4 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="font-medium text-gray-900 dark:text-gray-100 hover:text-primary-600 transition-colors">{item.value}</a>
                  ) : (
                    <p className="font-medium text-gray-900 dark:text-gray-100">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="glass-card p-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Frequently Asked</h3>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                  <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{faq.q}</span>
                    <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${faqOpen === i ? 'rotate-90' : ''}`} />
                  </button>
                  {faqOpen === i && (
                    <div className="px-4 pb-4 animate-slide-down">
                      <p className="text-sm text-gray-500">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
