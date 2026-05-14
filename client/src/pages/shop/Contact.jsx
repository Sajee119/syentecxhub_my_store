import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, ChevronRight } from 'lucide-react';
import Breadcrumb from '../../components/common/Breadcrumb';
import Seo from '../../components/common/Seo';

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'support@mystore.com', href: 'mailto:sajeepan634@gmail.com' },
  { icon: Phone, label: 'Phone', value: '+94 (783) 566-823', href: 'tel:+94783566823' },
  { icon: MapPin, label: 'Address', value: 'Jaffna, Sri Lanka' },
  { icon: Clock, label: 'Hours', value: 'Mon-Fri: 9AM-6PM EST' },
];

const faqs = [
  { q: 'How long does shipping take?', a: 'Standard shipping takes 5-7 business days. Express shipping is 2-3 business days.' },
  { q: 'What is your return policy?', a: 'We offer a 30-day hassle-free return policy for all unused items in original packaging.' },
  { q: 'Do you ship internationally?', a: 'Yes, we ship to over 50 countries worldwide. International shipping takes 7-14 business days.' },
  { q: 'How can I track my order?', a: 'Once shipped, you\'ll receive a tracking number via email. You can also track on our Order Tracking page.' },
];

export default function Contact() {
  const [faqOpen, setFaqOpen] = useState(null);

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
          <form action={import.meta.env.VITE_WEB3FORMS_URL || 'https://api.web3forms.com/submit'} method="POST" className="space-y-4">
            <input type="hidden" name="access_key" value={import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || 'de24f8a7-3d99-44dd-9678-918f32dd6467'} />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input type="text" name="name" required className="input-field" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input type="email" name="email" required className="input-field" placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Subject</label>
              <input type="text" name="subject" required className="input-field" placeholder="How can we help?" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea name="message" required rows={5} className="input-field resize-none" placeholder="Tell us more about your inquiry..." />
            </div>
            <button type="submit" className="btn-primary flex items-center gap-2">
              <Send className="w-4 h-4" />
              Send Message
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
