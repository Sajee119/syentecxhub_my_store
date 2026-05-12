import { useState, useEffect } from 'react';
import Seo from '../../components/common/Seo';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import API from '../../api/axios';

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { document.title = 'My Store | Order Confirmation'; }, []);

  useEffect(() => {
    API.get(`/orders/${id}`).then(({ data }) => setOrder(data.order)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" /></div>;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <Seo title="Order Confirmed" description="Your order has been placed successfully." />
      <div className="max-w-lg w-full text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Order Confirmed!</h1>
        <p className="text-gray-500 mb-2">Thank you for your purchase.</p>
        {order && (
          <p className="text-gray-500 mb-8">
            Order #{order.invoiceNumber} — <span className="font-medium text-gray-700 dark:text-gray-300">${order.total.toFixed(2)}</span>
          </p>
        )}
        <div className="glass-card p-6 mb-8 text-left">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Package className="w-4 h-4 text-primary-600" /> Order Details</h3>
          {order?.items?.map((item, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
              <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0">
                <img src={item.image || ''} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-800 flex justify-between font-bold">
            <span>Total</span>
            <span className="text-primary-600">${order?.total?.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/account/orders" className="btn-primary flex items-center justify-center gap-2">
            View Orders <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/shop" className="btn-secondary flex items-center justify-center gap-2">
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
