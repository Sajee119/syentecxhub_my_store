import { useState, useEffect } from 'react';
import { Trash2, Mail } from 'lucide-react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/common/ConfirmationModal';

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteSubscriber, setDeleteSubscriber] = useState(null);

  useEffect(() => { fetchSubscribers(); }, [page]);

  const fetchSubscribers = async () => {
    try {
      const { data } = await API.get(`/newsletter?page=${page}&limit=20`);
      setSubscribers(data.subscribers);
      setTotal(data.total);
    } catch {} finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!deleteSubscriber) return;
    await API.delete(`/newsletter/${deleteSubscriber._id}`);
    toast.success('Subscriber removed');
    setDeleteSubscriber(null);
    fetchSubscribers();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Newsletter Subscribers</h1>
        <span className="text-sm text-gray-500">{total} total</span>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="text-left p-4 font-medium text-gray-500">Email</th>
                <th className="text-left p-4 font-medium text-gray-500">Subscribed</th>
                <th className="text-right p-4 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {subscribers.map(sub => (
                <tr key={sub._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="p-4 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-gray-100">{sub.email}</span>
                  </td>
                  <td className="p-4 text-gray-500">{new Date(sub.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => setDeleteSubscriber(sub)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {loading && <p className="text-center text-gray-400 py-8">Loading...</p>}
        {!loading && subscribers.length === 0 && <p className="text-center text-gray-400 py-8">No subscribers yet.</p>}
      </div>

      {Math.ceil(total / 20) > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: Math.ceil(total / 20) }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded-lg text-sm ${page === i + 1 ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 hover:bg-gray-200'}`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}

      <ConfirmationModal
        open={!!deleteSubscriber}
        title="Remove this subscriber?"
        description={deleteSubscriber ? `This will remove ${deleteSubscriber.email} from the newsletter list.` : 'This will remove the selected subscriber from the newsletter list.'}
        confirmLabel="Remove subscriber"
        onCancel={() => setDeleteSubscriber(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
