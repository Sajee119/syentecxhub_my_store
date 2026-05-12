import { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 z-50 max-w-md animate-slide-up">
      <div className="glass rounded-2xl p-5 shadow-2xl border border-gray-200 dark:border-gray-800 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center shrink-0">
          <Cookie className="w-5 h-5 text-primary-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
            We use cookies to enhance your experience. By continuing, you agree to our use of cookies.
          </p>
          <div className="flex gap-2">
            <button onClick={accept} className="btn-primary text-xs py-2 px-4">Accept</button>
            <button onClick={accept} className="btn-secondary text-xs py-2 px-4">Decline</button>
          </div>
        </div>
        <button onClick={accept} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
