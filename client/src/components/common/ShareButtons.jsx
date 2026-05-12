import { Link, Share2, Twitter, Facebook, Linkedin, Mail, Check } from 'lucide-react';
import { useState } from 'react';

export default function ShareButtons({ url, title, className = '' }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || window.location.href;
  const shareTitle = title || document.title;

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(shareTitle);

  const shareLinks = [
    { icon: Twitter, href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, label: 'Twitter', color: 'hover:bg-sky-100 dark:hover:bg-sky-900/20 hover:text-sky-600' },
    { icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, label: 'Facebook', color: 'hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:text-blue-600' },
    { icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, label: 'LinkedIn', color: 'hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:text-blue-700' },
    { icon: Mail, href: `mailto:?subject=${encodedTitle}&body=Check this out: ${encodedUrl}`, label: 'Email', color: 'hover:bg-amber-100 dark:hover:bg-amber-900/20 hover:text-amber-600' },
  ];

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-gray-500 mr-1">Share:</span>
      {shareLinks.map(s => (
        <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" title={s.label}
          className={`w-9 h-9 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 transition-all ${s.color}`}>
          <s.icon className="w-4 h-4" />
        </a>
      ))}
      <button onClick={copyLink} title="Copy link"
        className={`w-9 h-9 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center transition-all ${copied ? 'bg-green-50 dark:bg-green-900/20 text-green-600 border-green-300' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
        {copied ? <Check className="w-4 h-4" /> : <Link className="w-4 h-4" />}
      </button>
    </div>
  );
}
