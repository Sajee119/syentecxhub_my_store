import { useState, useEffect } from 'react';
import Seo from '../../components/common/Seo';
import { Search } from 'lucide-react';
import API from '../../api/axios';
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

const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { document.title = 'My Store | Admin - Orders'; }, []);

  const fetchOrders = () => {
    setLoading(true);
    const params = search ? `?search=${search}&limit=50` : '?limit=50';
    API.get(`/orders${params}`).then(({ data }) => setOrders(data.orders)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}/status`, { status });
      toast.success(`Order status updated to ${status}`);
      fetchOrders();
    } catch { toast.error('Failed to update'); }
  };

  return (
    <div>
      <Seo title="Manage Orders" description="View and manage all customer orders." />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Orders</h1>
      <div className="glass-card p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchOrders()}
            placeholder="Search by invoice #..." className="input-field pl-10" />
        </div>
      </div>
      {loading ? <TableSkeleton rows={8} cols={5} /> : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-500">Invoice</th>
                  <th className="text-left p-4 font-medium text-gray-500">Customer</th>
                  <th className="text-left p-4 font-medium text-gray-500">Items</th>
                  <th className="text-left p-4 font-medium text-gray-500">Total</th>
                  <th className="text-left p-4 font-medium text-gray-500">Date</th>
                  <th className="text-left p-4 font-medium text-gray-500">Status</th>
                  <th className="text-left p-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {orders.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                    <td className="p-4 font-medium">#{order.invoiceNumber}</td>
                    <td className="p-4">
                      <div>
                        <p className="text-gray-900 dark:text-gray-100">{order.user?.name || 'Guest'}</p>
                        <p className="text-xs text-gray-500">{order.user?.email}</p>
                      </div>
                    </td>
                    <td className="p-4 text-gray-500">{order.items?.length}</td>
                    <td className="p-4 font-bold">${order.total?.toFixed(2)}</td>
                    <td className="p-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`badge ${statusColors[order.status]}`}>{order.status}</span>
                    </td>
                    <td className="p-4">
                      <select value={order.status} onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="border border-gray-300 dark:border-gray-700 rounded-lg px-2 py-1.5 text-xs bg-transparent">
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
