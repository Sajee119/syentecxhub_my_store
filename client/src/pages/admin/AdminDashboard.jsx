import { useState, useEffect } from 'react';
import Seo from '../../components/common/Seo';
import { DollarSign, ShoppingCart, Users, Package, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import API from '../../api/axios';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { document.title = 'My Store | Admin Dashboard'; }, []);

  useEffect(() => {
    Promise.all([
      API.get('/admin/stats'),
      API.get('/admin/revenue?months=6'),
    ]).then(([statsRes, revenueRes]) => {
      setStats(statsRes.data.stats);
      setRecentOrders(statsRes.data.recentOrders || []);
      setLowStock(statsRes.data.lowStockProducts || []);
      setRevenueData(revenueRes.data.revenueData || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="space-y-6"><div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" /><TableSkeleton /></div>;

  const statCards = [
    { label: 'Total Revenue', value: `$${stats?.totalRevenue?.toLocaleString() || '0'}`, icon: DollarSign, change: `${stats?.revenueChange?.toFixed(1) || 0}%`, color: 'from-emerald-500 to-teal-600', trend: stats?.revenueChange > 0 ? 'up' : 'down' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingCart, color: 'from-blue-500 to-indigo-600' },
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'from-purple-500 to-pink-600' },
    { label: 'Products', value: stats?.totalProducts || 0, icon: Package, color: 'from-orange-500 to-red-600' },
  ];

  return (
    <div>
      <Seo title="Admin Dashboard" description="Overview of your store's performance and metrics." />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, i) => (
          <div key={i} className={`rounded-2xl bg-gradient-to-br ${card.color} p-6 text-white`}>
            <div className="flex items-center justify-between mb-4">
              <card.icon className="w-6 h-6 opacity-80" />
              {card.trend && (card.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />)}
            </div>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-sm opacity-80">{card.label}</p>
            {card.change && <p className="text-xs mt-1 opacity-70">{card.trend === 'up' ? '+' : ''}{card.change} vs last month</p>}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="glass-card p-6">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="_id" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '12px', color: '#fff' }} />
              <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-card p-6">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Orders Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="_id" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '12px', color: '#fff' }} />
              <Bar dataKey="orders" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent Orders</h3>
          {recentOrders.length === 0 ? <p className="text-gray-500 text-sm">No orders yet</p> : (
            <div className="space-y-3">
              {recentOrders.slice(0, 5).map(order => (
                <div key={order._id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">#{order.invoiceNumber}</p>
                    <p className="text-gray-500 text-xs">{order.user?.name || 'Guest'}</p>
                  </div>
                  <span className="font-medium">${order.total?.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="glass-card p-6">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" /> Low Stock Alert
          </h3>
          {lowStock.length === 0 ? <p className="text-gray-500 text-sm">No low stock items</p> : (
            <div className="space-y-3">
              {lowStock.slice(0, 5).map(product => (
                <div key={product._id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-900 dark:text-gray-100">{product.name}</span>
                  <span className={`font-medium ${product.stock === 0 ? 'text-red-500' : 'text-amber-500'}`}>{product.stock} left</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
