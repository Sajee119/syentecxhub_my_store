import { useState, useEffect } from 'react';
import Seo from '../../components/common/Seo';
import { Search, Ban, Trash2, Shield } from 'lucide-react';
import API from '../../api/axios';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/common/ConfirmationModal';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteUser, setDeleteUser] = useState(null);

  useEffect(() => { document.title = 'My Store | Admin - Users'; }, []);

  const fetchUsers = () => {
    setLoading(true);
    const params = search ? `?search=${search}&limit=50` : '?limit=50';
    API.get(`/users${params}`).then(({ data }) => setUsers(data.users)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleBan = async (id) => {
    try {
      const { data } = await API.put(`/users/ban/${id}`);
      toast.success(data.message);
      fetchUsers();
    } catch { toast.error('Failed'); }
  };

  const handleRole = async (id, role) => {
    try {
      await API.put(`/users/role/${id}`, { role });
      toast.success('Role updated');
      fetchUsers();
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async () => {
    if (!deleteUser) return;
    try {
      await API.delete(`/users/${deleteUser._id}`);
      toast.success('User deleted');
      setDeleteUser(null);
      fetchUsers();
    } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <Seo title="Manage Users" description="View and manage registered users." />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Users</h1>
      <div className="glass-card p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
            placeholder="Search users..." className="input-field pl-10" />
        </div>
      </div>
      {loading ? <TableSkeleton rows={8} cols={5} /> : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-500">User</th>
                  <th className="text-left p-4 font-medium text-gray-500">Email</th>
                  <th className="text-left p-4 font-medium text-gray-500">Role</th>
                  <th className="text-left p-4 font-medium text-gray-500">Status</th>
                  <th className="text-left p-4 font-medium text-gray-500">Joined</th>
                  <th className="text-right p-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-medium">{u.name?.charAt(0)}</div>
                        <span className="font-medium">{u.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-500">{u.email}</td>
                    <td className="p-4">
                      <select value={u.role} onChange={(e) => handleRole(u._id, e.target.value)}
                        className="border border-gray-300 dark:border-gray-700 rounded-lg px-2 py-1 text-xs bg-transparent">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <span className={`badge ${u.isBanned ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                        {u.isBanned ? 'Banned' : 'Active'}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleBan(u._id)} className="p-2 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg" title={u.isBanned ? 'Unban' : 'Ban'}>
                          <Ban className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteUser(u)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
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
        open={!!deleteUser}
        title="Delete this user?"
        description={deleteUser ? `This will permanently remove ${deleteUser.name} and their account data.` : 'This will permanently remove the selected user.'}
        confirmLabel="Delete user"
        onCancel={() => setDeleteUser(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
