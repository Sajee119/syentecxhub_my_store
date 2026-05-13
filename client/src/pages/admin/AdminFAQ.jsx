import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const categoryOptions = [
  { value: 'orders', label: 'Orders' },
  { value: 'shipping', label: 'Shipping' },
  { value: 'returns', label: 'Returns' },
  { value: 'payment', label: 'Payment' },
  { value: 'account', label: 'Account' },
  { value: 'general', label: 'General' },
];

export default function AdminFAQ() {
  const [faqs, setFaqs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ question: '', answer: '', category: 'general', order: 0 });
  const [deleteFaq, setDeleteFaq] = useState(null);

  useEffect(() => { fetchFAQs(); }, []);

  const fetchFAQs = async () => {
    const { data } = await API.get('/faqs/all');
    setFaqs(data.faqs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await API.put(`/faqs/${editing}`, form);
      toast.success('FAQ updated');
    } else {
      await API.post('/faqs', form);
      toast.success('FAQ created');
    }
    setShowForm(false);
    setEditing(null);
    setForm({ question: '', answer: '', category: 'general', order: 0 });
    fetchFAQs();
  };

  const handleEdit = (faq) => {
    setForm({ question: faq.question, answer: faq.answer, category: faq.category, order: faq.order });
    setEditing(faq._id);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteFaq) return;
    await API.delete(`/faqs/${deleteFaq._id}`);
    toast.success('FAQ deleted');
    setDeleteFaq(null);
    fetchFAQs();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">FAQ Management</h1>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ question: '', answer: '', category: 'general', order: 0 }); }}
          className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Add FAQ</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{editing ? 'Edit FAQ' : 'New FAQ'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Question</label>
                <input value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} required className="input-field w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Answer</label>
                <textarea value={form.answer} onChange={e => setForm({ ...form, answer: e.target.value })} required rows={4} className="input-field w-full" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-field w-full">
                    {categoryOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Order</label>
                  <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} className="input-field w-full" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">{editing ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="text-left p-4 font-medium text-gray-500">Order</th>
                <th className="text-left p-4 font-medium text-gray-500">Question</th>
                <th className="text-left p-4 font-medium text-gray-500">Category</th>
                <th className="text-right p-4 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {faqs.map(faq => (
                <tr key={faq._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="p-4 text-gray-400">{faq.order}</td>
                  <td className="p-4 font-medium text-gray-900 dark:text-gray-100 max-w-md truncate">{faq.question}</td>
                  <td className="p-4"><span className="px-2 py-1 text-xs rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 capitalize">{faq.category}</span></td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleEdit(faq)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteFaq(faq)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {faqs.length === 0 && <p className="text-center text-gray-400 py-12">No FAQs yet.</p>}
      </div>

      <ConfirmationModal
        open={!!deleteFaq}
        title="Delete this FAQ?"
        description={deleteFaq ? `This will permanently remove \"${deleteFaq.question}\".` : 'This will permanently remove the selected FAQ.'}
        confirmLabel="Delete FAQ"
        onCancel={() => setDeleteFaq(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
