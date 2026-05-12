import { useState } from 'react';
import Seo from '../../components/common/Seo';
import { Search, Package, CheckCircle, Clock, Truck, XCircle, ChevronRight } from 'lucide-react';
import API from '../../api/axios';
import Breadcrumb from '../../components/common/Breadcrumb';
import toast from 'react-hot-toast';

const statusFlow = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

const statusConfig = {
  pending: { icon: Clock, label: 'Order Placed', color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30', desc: 'Your order has been placed and is awaiting confirmation.' },
  confirmed: { icon: CheckCircle, label: 'Confirmed', color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30', desc: 'Your order has been confirmed and is being prepared.' },
  processing: { icon: Package, label: 'Processing', color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-900/30', desc: 'Your items are being picked and packed.' },
  shipped: { icon: Truck, label: 'Shipped', color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30', desc: 'Your order is on its way!', extra: 'tracking' },
  delivered: { icon: CheckCircle, label: 'Delivered', color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30', desc: 'Your order has been delivered successfully.' },
  cancelled: { icon: XCircle, label: 'Cancelled', color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30', desc: 'This order has been cancelled.' },
  refunded: { icon: XCircle, label: 'Refunded', color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-900/30', desc: 'This order has been refunded.' },
};

export default function OrderTracking() {
  const [invoice, setInvoice] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!invoice.trim()) return toast.error('Enter an invoice number');
    setLoading(true);
    try {
      const { data } = await API.get(`/orders/invoice/${invoice.trim()}`);
      setOrder(data.order);
    } catch {
      toast.error('Order not found');
      setOrder(null);
    } finally { setLoading(false); }
  };

  const currentIdx = statusFlow.indexOf(order?.status);
  const isCancelled = order?.status === 'cancelled' || order?.status === 'refunded';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Seo title="Track Order" description="Track your order status in real time." />
      <Breadcrumb items={[{ label: 'Order Tracking' }]} />
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Track Your Order</h1>
      <p className="text-gray-500 mb-8">Enter your invoice number to track your order status</p>

      <form onSubmit={handleTrack} className="glass-card p-6 mb-8">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input value={invoice} onChange={e => setInvoice(e.target.value)} placeholder="Invoice number (e.g. INV-202605-000001)" className="input-field pl-10" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            <Search className="w-4 h-4" /> {loading ? 'Searching...' : 'Track'}
          </button>
        </div>
      </form>

      {order && (
        <div className="glass-card p-8 animate-fade-in">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
            <div>
              <p className="text-sm text-gray-500">Invoice</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">#{order.invoiceNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-xl font-bold text-primary-600">${order.total?.toFixed(2)}</p>
            </div>
          </div>

          {isCancelled ? (
            <div className={`p-6 rounded-2xl ${statusConfig[order.status]?.bg} text-center`}>
              {order.status === 'cancelled' ? <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" /> : <XCircle className="w-12 h-12 text-gray-500 mx-auto mb-3" />}
              <h3 className="text-lg font-semibold capitalize mb-1">{order.status}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{statusConfig[order.status]?.desc}</p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-[23px] top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800 hidden md:block" />
              <div className="space-y-0">
                {statusFlow.map((status, i) => {
                  const cfg = statusConfig[status];
                  const isActive = currentIdx >= i;
                  const isLast = currentIdx === i;
                  return (
                    <div key={status} className="relative flex items-start gap-5 pb-8 last:pb-0">
                      <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isActive ? cfg.bg + ' ' + cfg.color : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                        <cfg.icon className="w-5 h-5" />
                      </div>
                      <div className="pt-2">
                        <p className={`font-semibold ${isActive ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400'}`}>
                          {cfg.label}
                          {isLast && <span className="ml-2 badge bg-primary-50 dark:bg-primary-900/20 text-primary-600 text-xs">Current</span>}
                        </p>
                        <p className={`text-sm mt-1 ${isActive ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400'}`}>{cfg.desc}</p>
                        {isLast && status === 'shipped' && order.trackingNumber && (
                          <p className="text-sm text-primary-600 mt-1">Tracking: <span className="font-medium">{order.trackingNumber}</span></p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
            <h3 className="font-semibold mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <img src={item.image || ''} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-200" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                  </div>
                  <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
