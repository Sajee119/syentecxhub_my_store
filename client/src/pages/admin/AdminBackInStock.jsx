import { useState, useEffect } from 'react';
import { Bell, Check, Trash2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/common/ConfirmationModal';

export default function AdminBackInStock() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteRequest, setDeleteRequest] = useState(null);

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    try {
      const { data } = await API.get('/back-in-stock');
      setRequests(data.requests);
    } catch {} finally { setLoading(false); }
  };

  const handleNotify = async (id) => {
    await API.put(`/back-in-stock/${id}/notify`);
    toast.success('Marked as notified');
    fetchRequests();
  };

  const handleDelete = async () => {
    if (!deleteRequest) return;
    await API.delete(`/back-in-stock/${deleteRequest._id}`);
    toast.success('Request deleted');
    setDeleteRequest(null);
    fetchRequests();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Back-in-Stock Requests</h1>
        <span className="text-sm text-gray-500">{requests.length} pending</span>
      </div>

      <div className="space-y-4">
        {loading && <p className="text-center text-gray-400 py-8">Loading...</p>}
        {!loading && requests.length === 0 && <p className="text-center text-gray-400 py-8">No pending requests.</p>}
        {requests.map(req => (
          <div key={req._id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0">
                <img src={req.product?.images?.[0]?.url || '/placeholder.jpg'} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <Link to={`/shop/${req.product?.slug}`} className="font-medium text-gray-900 dark:text-gray-100 hover:text-primary-500 flex items-center gap-1">
                  {req.product?.name || 'Deleted Product'} <ExternalLink className="w-3 h-3" />
                </Link>
                <p className="text-sm text-gray-500">${req.product?.price?.toFixed(2)}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {req.email} &middot; {new Date(req.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleNotify(req._id)} className="btn-primary text-xs flex items-center gap-1 py-2"><Bell className="w-3 h-3" /> Notify</button>
              <button onClick={() => setDeleteRequest(req)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmationModal
        open={!!deleteRequest}
        title="Delete this request?"
        description={deleteRequest ? `This will remove the back-in-stock request for ${deleteRequest.email}.` : 'This will remove the selected back-in-stock request.'}
        confirmLabel="Delete request"
        onCancel={() => setDeleteRequest(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
