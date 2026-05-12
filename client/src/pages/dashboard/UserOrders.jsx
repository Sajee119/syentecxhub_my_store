import { useState, useEffect } from 'react';
import Seo from '../../components/common/Seo';
import { Link } from 'react-router-dom';
import { Package, Eye, XCircle, FileText } from 'lucide-react';
import API from '../../api/axios';
import Breadcrumb from '../../components/common/Breadcrumb';
import EmptyState from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  processing: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  shipped: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  refunded: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
};

const cancellable = ['pending', 'confirmed'];

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    API.get('/orders/my-orders').then(({ data }) => setOrders(data.orders)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      await API.put(`/orders/${id}/status`, { status: 'cancelled' });
      toast.success('Order cancelled');
      fetchOrders();
    } catch { toast.error('Failed to cancel'); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Seo title="My Orders" description="View and manage your order history." />
      <Breadcrumb items={[{ label: 'My Account', path: '/account' }, { label: 'My Orders' }]} />
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">My Orders</h1>
      {loading ? <TableSkeleton rows={4} cols={5} /> : orders.length === 0 ? (
        <EmptyState icon={Package} title="No orders yet" message="You haven't placed any orders yet." actionLabel="Start Shopping" actionLink="/shop" />
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="glass-card-hover p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">#{order.invoiceNumber}</p>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`badge text-xs capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>{order.status}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{order.items?.length} item(s) — ${order.total?.toFixed(2)}</span>
                <div className="flex items-center gap-2">
                  <Link to={`/order-confirmation/${order._id}`} className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors" title="View Order">
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link to={`/invoice/${order._id}`} className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors" title="Invoice">
                    <FileText className="w-4 h-4" />
                  </Link>
                  {cancellable.includes(order.status) && (
                    <button onClick={() => handleCancel(order._id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Cancel Order">
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
