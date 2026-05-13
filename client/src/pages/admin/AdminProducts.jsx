import { useState, useEffect } from 'react';
import Seo from '../../components/common/Seo';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import API from '../../api/axios';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/common/ConfirmationModal';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteProduct, setDeleteProduct] = useState(null);

  useEffect(() => { document.title = 'My Store | Admin - Products'; }, []);

  const fetchProducts = () => {
    setLoading(true);
    const params = search ? `?search=${search}&limit=50` : '?limit=50';
    API.get(`/products${params}`).then(({ data }) => setProducts(data.products)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async () => {
    if (!deleteProduct) return;
    try {
      await API.delete(`/products/${deleteProduct._id}`);
      toast.success('Product deleted');
      setDeleteProduct(null);
      fetchProducts();
    } catch { toast.error('Failed to delete'); }
  };

  const toggleFeatured = async (product) => {
    try {
      await API.put(`/products/${product._id}`, { isFeatured: !product.isFeatured });
      fetchProducts();
      toast.success(product.isFeatured ? 'Removed from featured' : 'Added to featured');
    } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <Seo title="Manage Products" description="View and manage your product catalog." />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Products</h1>
        <Link to="/admin/products/new" className="btn-primary text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Add Product</Link>
      </div>
      <div className="glass-card p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
            placeholder="Search products..." className="input-field pl-10" />
        </div>
      </div>
      {loading ? <TableSkeleton rows={8} cols={5} /> : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-500">Product</th>
                  <th className="text-left p-4 font-medium text-gray-500">Category</th>
                  <th className="text-left p-4 font-medium text-gray-500">Price</th>
                  <th className="text-left p-4 font-medium text-gray-500">Stock</th>
                  <th className="text-left p-4 font-medium text-gray-500">Featured</th>
                  <th className="text-right p-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {products.map(product => (
                  <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={product.images?.[0]?.url || ''} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100 line-clamp-1">{product.name}</p>
                          <p className="text-xs text-gray-500">ID: {product._id.slice(-8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-500">{product.category?.name || '-'}</td>
                    <td className="p-4 font-medium">${product.price?.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`badge ${product.stock > 10 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="p-4">
                      <button onClick={() => toggleFeatured(product)} className={`badge cursor-pointer ${product.isFeatured ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800'}`}>
                        {product.isFeatured ? 'Yes' : 'No'}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/admin/products/edit/${product._id}`} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button onClick={() => setDeleteProduct(product)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmationModal
        open={!!deleteProduct}
        title="Delete this product?"
        description={deleteProduct ? `This will permanently remove ${deleteProduct.name} from your catalog.` : 'This will permanently remove the selected product from your catalog.'}
        confirmLabel="Delete product"
        onCancel={() => setDeleteProduct(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
