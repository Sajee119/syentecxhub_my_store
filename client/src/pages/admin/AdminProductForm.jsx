import { useState, useEffect } from 'react';
import Seo from '../../components/common/Seo';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().min(10),
  price: z.string().min(1),
  originalPrice: z.string().optional(),
  imageUrl: z.string().url().optional(),
  imageAlt: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  stock: z.string().min(1),
  isFeatured: z.boolean().optional(),
  brand: z.string().optional(),
  tags: z.string().optional(),
});

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => { document.title = `My Store | ${id ? 'Edit Product' : 'Add Product'}`; }, [id]);

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { isFeatured: false, imageUrl: '', imageAlt: '' },
  });

  const watchImageUrl = watch('imageUrl');

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return toast.error('Please select an image file');
    if (file.size > 5 * 1024 * 1024) return toast.error('Image must be under 5MB');
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
    toast.success('Image selected — it will be used as a URL reference');
  };

  useEffect(() => {
    API.get('/categories/all').then(({ data }) => setCategories(data.categories)).catch(() => {});
    if (id) {
      API.get(`/products/id/${id}`).then(({ data }) => {
        const p = data.product;
        reset({
          name: p.name,
          description: p.description,
          price: p.price.toString(),
          originalPrice: p.originalPrice?.toString() || '',
          imageUrl: p.images && p.images.length ? p.images[0].url : '',
          imageAlt: p.images && p.images.length ? p.images[0].alt || '' : '',
          category: p.category?._id || p.category,
          stock: p.stock.toString(),
          isFeatured: p.isFeatured,
          brand: p.brand || '',
          tags: p.tags?.join(', ') || '',
        });
      }).catch(() => toast.error('Product not found')).finally(() => setFetching(false));
    } else setFetching(false);
  }, [id, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    const payload = {
      ...data,
      images: data.imageUrl ? [{ url: data.imageUrl, alt: data.imageAlt || '' }] : [],
      price: parseFloat(data.price),
      originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : undefined,
      stock: parseInt(data.stock),
      tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    };
    try {
      if (id) {
        await API.put(`/products/${id}`, payload);
        toast.success('Product updated!');
      } else {
        await API.post('/products', payload);
        toast.success('Product created!');
      }
      navigate('/admin/products');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  if (fetching) return <div className="animate-pulse h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl" />;

  return (
    <div>
      <Seo title={id ? 'Edit Product' : 'Add Product'} description="View and manage your product catalog." />
      <button onClick={() => navigate('/admin/products')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </button>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{id ? 'Edit Product' : 'Add Product'}</h1>
      <div className="glass-card p-8 max-w-3xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Product Name</label>
              <input {...register('name')} className="input-field" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select {...register('category')} className="input-field">
                <option value="">Select category</option>
                {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea {...register('description')} rows={4} className="input-field" />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Price ($)</label>
              <input type="number" step="0.01" {...register('price')} className="input-field" />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Original Price ($)</label>
              <input type="number" step="0.01" {...register('originalPrice')} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Stock</label>
              <input type="number" {...register('stock')} className="input-field" />
              {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Product Image</label>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Image URL</label>
                <input {...register('imageUrl')} placeholder="https://.../image.jpg" className="input-field" />
                {errors.imageUrl && <p className="text-red-500 text-xs mt-1">Please enter a valid image URL</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Alt Text</label>
                <input {...register('imageAlt')} placeholder="Short description" className="input-field" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-4">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl text-sm font-medium transition-colors">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                Upload Image
              </label>
              {(imagePreview || watchImageUrl) && (
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700">
                  <img src={imagePreview || watchImageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
                </div>
              )}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Brand</label>
              <input {...register('brand')} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
              <input {...register('tags')} className="input-field" placeholder="e.g. electronics, audio, bluetooth" />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('isFeatured')} className="w-4 h-4" />
            <span className="text-sm font-medium">Featured Product</span>
          </label>
          <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Saving...' : id ? 'Update Product' : 'Create Product'}</button>
        </form>
      </div>
    </div>
  );
}
