import { useState, useEffect } from 'react';
import Seo from '../../components/common/Seo';
import { MapPin, Plus, Trash2 } from 'lucide-react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Breadcrumb from '../../components/common/Breadcrumb';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

export default function UserAddresses() {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ fullName: '', phone: '', street: '', city: '', state: '', zip: '', isDefault: false });
  const { updateUser } = useAuth();

  useEffect(() => {
    API.get('/auth/me').then(({ data }) => {
      setAddresses(data.user.addresses || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => { document.title = 'My Store | Addresses'; }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/users/addresses', form);
      setAddresses(data.addresses);
      setShowForm(false);
      setForm({ fullName: '', phone: '', street: '', city: '', state: '', zip: '', isDefault: false });
      toast.success('Address added!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this address?')) return;
    try {
      const { data } = await API.delete(`/users/addresses/${id}`);
      setAddresses(data.addresses);
      toast.success('Address deleted');
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Seo title="My Addresses" description="Manage your saved shipping addresses." />
      <Breadcrumb items={[{ label: 'My Account', path: '/account' }, { label: 'Addresses' }]} />
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Addresses</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Add Address</button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card p-6 mb-8">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div><input placeholder="Full Name" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} required className="input-field" /></div>
            <div><input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required className="input-field" /></div>
          </div>
          <input placeholder="Street Address" value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} required className="input-field mb-4" />
          <div className="grid grid-cols-3 gap-4 mb-4">
            <input placeholder="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} required className="input-field" />
            <input placeholder="State" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} required className="input-field" />
            <input placeholder="ZIP" value={form.zip} onChange={e => setForm({ ...form, zip: e.target.value })} required className="input-field" />
          </div>
          <label className="flex items-center gap-2 mb-4 cursor-pointer">
            <input type="checkbox" checked={form.isDefault} onChange={e => setForm({ ...form, isDefault: e.target.checked })} className="w-4 h-4" />
            <span className="text-sm">Set as default address</span>
          </label>
          <button type="submit" className="btn-primary">Save Address</button>
        </form>
      )}
      {addresses.length === 0 ? (
        <EmptyState icon={MapPin} title="No addresses saved" message="Add an address for faster checkout." />
      ) : (
        <div className="space-y-4">
          {addresses.map((addr, i) => (
            <div key={addr._id || i} className="glass-card p-6 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100">{addr.fullName}</p>
                  {addr.isDefault && <span className="badge bg-primary-50 dark:bg-primary-900/20 text-primary-600 text-xs">Default</span>}
                </div>
                <p className="text-sm text-gray-500">{addr.street}</p>
                <p className="text-sm text-gray-500">{addr.city}, {addr.state} {addr.zip}</p>
                <p className="text-sm text-gray-500">{addr.phone}</p>
              </div>
              <button onClick={() => handleDelete(addr._id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
