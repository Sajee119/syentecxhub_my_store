import { useState, useEffect } from 'react';
import Seo from '../../components/common/Seo';
import { Plus, Trash2 } from 'lucide-react';
import API from '../../api/axios';
import toast from 'react-hot-toast';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: '', type: 'percentage', value: '', minOrderValue: '0', usageLimit: '1', expiresAt: '' });

  useEffect(() => { document.title = 'My Store | Admin - Coupons'; }, []);

  const fetchCoupons = () => {
    API.get('/coupons').then(({ data }) => setCoupons(data.coupons)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/coupons', {
        ...form,
        value: parseFloat(form.value),
        minOrderValue: parseFloat(form.minOrderValue),
        usageLimit: parseInt(form.usageLimit),
      });
      toast.success('Coupon created');
      setShowForm(false);
      setForm({ code: '', type: 'percentage', value: '', minOrderValue: '0', usageLimit: '1', expiresAt: '' });
      fetchCoupons();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this coupon?')) return;
    try {
      await API.delete(`/coupons/${id}`);
      toast.success('Coupon deleted');
      fetchCoupons();
    } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <Seo title="Manage Coupons" description="Create and manage discount coupons." />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Coupons</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Add Coupon</button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card p-6 mb-6 max-w-lg">
          <h3 className="font-semibold mb-4">New Coupon</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Code (e.g. SAVE20)" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} required className="input-field uppercase" />
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="input-field">
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input type="number" step="0.01" placeholder="Value" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} required className="input-field" />
              <input type="number" step="0.01" placeholder="Min Order Value" value={form.minOrderValue} onChange={e => setForm({ ...form, minOrderValue: e.target.value })} className="input-field" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input type="number" placeholder="Usage Limit" value={form.usageLimit} onChange={e => setForm({ ...form, usageLimit: e.target.value })} className="input-field" />
              <input type="date" placeholder="Expires" value={form.expiresAt} onChange={e => setForm({ ...form, expiresAt: e.target.value })} required className="input-field" />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary text-sm">Create</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm">Cancel</button>
            </div>
          </div>
        </form>
      )}
      {loading ? <div className="animate-pulse h-40 bg-gray-200 dark:bg-gray-800 rounded-2xl" /> : (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="text-left p-4 font-medium text-gray-500">Code</th>
                <th className="text-left p-4 font-medium text-gray-500">Type</th>
                <th className="text-left p-4 font-medium text-gray-500">Value</th>
                <th className="text-left p-4 font-medium text-gray-500">Used</th>
                <th className="text-left p-4 font-medium text-gray-500">Expires</th>
                <th className="text-left p-4 font-medium text-gray-500">Status</th>
                <th className="text-right p-4 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {coupons.map(coupon => (
                <tr key={coupon._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                  <td className="p-4 font-medium">{coupon.code}</td>
                  <td className="p-4 text-gray-500 capitalize">{coupon.type}</td>
                  <td className="p-4">{coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`}</td>
                  <td className="p-4 text-gray-500">{coupon.usedCount}/{coupon.usageLimit}</td>
                  <td className="p-4 text-gray-500">{new Date(coupon.expiresAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`badge ${coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(coupon._id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
