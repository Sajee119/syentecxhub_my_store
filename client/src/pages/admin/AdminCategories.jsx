import { useState, useEffect } from 'react';
import Seo from '../../components/common/Seo';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/common/ConfirmationModal';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [deleteCategory, setDeleteCategory] = useState(null);

  useEffect(() => { document.title = 'My Store | Admin - Categories'; }, []);

  const fetchCategories = () => {
    API.get('/categories/all').then(({ data }) => setCategories(data.categories)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await API.put(`/categories/${editing}`, form);
        toast.success('Category updated');
      } else {
        await API.post('/categories', form);
        toast.success('Category created');
      }
      setShowForm(false);
      setEditing(null);
      setForm({ name: '', description: '' });
      fetchCategories();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleEdit = (cat) => {
    setEditing(cat._id);
    setForm({ name: cat.name, description: cat.description || '' });
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteCategory) return;
    try {
      await API.delete(`/categories/${deleteCategory._id}`);
      toast.success('Category deleted');
      setDeleteCategory(null);
      fetchCategories();
    } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <Seo title="Manage Categories" description="Organize products with categories." />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Categories</h1>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ name: '', description: '' }); }}
          className="btn-primary text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Add Category</button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card p-6 mb-6 max-w-lg">
          <h3 className="font-semibold mb-4">{editing ? 'Edit Category' : 'New Category'}</h3>
          <div className="space-y-3">
            <input placeholder="Category name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="input-field" />
            <input placeholder="Description (optional)" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field" />
            <div className="flex gap-2">
              <button type="submit" className="btn-primary text-sm">{editing ? 'Update' : 'Create'}</button>
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
                <th className="text-left p-4 font-medium text-gray-500">Name</th>
                <th className="text-left p-4 font-medium text-gray-500">Slug</th>
                <th className="text-left p-4 font-medium text-gray-500">Description</th>
                <th className="text-right p-4 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {categories.map(cat => (
                <tr key={cat._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                  <td className="p-4 font-medium">{cat.name}</td>
                  <td className="p-4 text-gray-500">{cat.slug}</td>
                  <td className="p-4 text-gray-500">{cat.description || '-'}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(cat)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteCategory(cat)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmationModal
        open={!!deleteCategory}
        title="Delete this category?"
        description={deleteCategory ? `This will remove ${deleteCategory.name} and may affect any products that use it.` : 'This will remove the selected category.'}
        confirmLabel="Delete category"
        onCancel={() => setDeleteCategory(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
