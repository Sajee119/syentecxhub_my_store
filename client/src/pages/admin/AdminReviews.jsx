import { useState, useEffect } from 'react';
import { Check, X, Trash2, Star } from 'lucide-react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/common/ConfirmationModal';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [deleteReview, setDeleteReview] = useState(null);

  useEffect(() => { fetchReviews(); }, [filter]);

  const fetchReviews = async () => {
    try {
      const params = filter ? `?isApproved=${filter}` : '';
      const { data } = await API.get(`/admin/reviews${params}`);
      setReviews(data.reviews);
    } catch {} finally { setLoading(false); }
  };

  const handleToggle = async (id) => {
    await API.put(`/admin/reviews/${id}/toggle`);
    toast.success('Review status updated');
    fetchReviews();
  };

  const handleDelete = async () => {
    if (!deleteReview) return;
    await API.delete(`/admin/reviews/${deleteReview._id}`);
    toast.success('Review deleted');
    setDeleteReview(null);
    fetchReviews();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Reviews Management</h1>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="input-field w-40">
          <option value="">All Reviews</option>
          <option value="true">Approved</option>
          <option value="false">Pending</option>
        </select>
      </div>

      <div className="space-y-4">
        {loading && <p className="text-center text-gray-400 py-8">Loading...</p>}
        {!loading && reviews.length === 0 && <p className="text-center text-gray-400 py-8">No reviews found.</p>}
        {reviews.map(review => (
          <div key={review._id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-300">
                  {review.user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{review.user?.name || 'Unknown User'}</p>
                  <p className="text-xs text-gray-400">{review.user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                ))}
              </div>
            </div>
            {review.title && <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">{review.title}</p>}
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{review.comment}</p>
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">Product: {review.product?.name || 'Deleted'}</p>
              <div className="flex gap-2">
                <button onClick={() => handleToggle(review._id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${review.isApproved ? 'bg-green-50 dark:bg-green-900/20 text-green-600 hover:bg-green-100' : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 hover:bg-yellow-100'}`}>
                  {review.isApproved ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  {review.isApproved ? 'Approved' : 'Pending'}
                </button>
                <button onClick={() => setDeleteReview(review)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmationModal
        open={!!deleteReview}
        title="Delete this review?"
        description={deleteReview ? 'This will permanently remove the selected review from the admin panel.' : 'This will permanently remove the selected review.'}
        confirmLabel="Delete review"
        onCancel={() => setDeleteReview(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
