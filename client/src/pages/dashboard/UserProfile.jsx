import { useState, useEffect } from 'react';
import Seo from '../../components/common/Seo';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Lock } from 'lucide-react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Breadcrumb from '../../components/common/Breadcrumb';
import toast from 'react-hot-toast';

const profileSchema = z.object({ name: z.string().min(2).max(50), phone: z.string().optional() });
const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Required'),
  newPassword: z.string().min(6, 'Min 6 characters'),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

export default function UserProfile() {
  const { user, updateUser } = useAuth();
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => { document.title = 'My Store | Profile'; }, []);

  const { register: regProfile, handleSubmit: handleProfile, formState: { errors: profileErrors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || '', phone: user?.phone || '' },
  });

  const { register: regPass, handleSubmit: handlePass, formState: { errors: passErrors }, reset: resetPass } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = async (data) => {
    setProfileLoading(true);
    try {
      const { data: res } = await API.put('/users/profile', data);
      updateUser(res.user);
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setProfileLoading(false); }
  };

  const onPasswordSubmit = async (data) => {
    setPasswordLoading(true);
    try {
      await API.put('/users/change-password', data);
      toast.success('Password changed!');
      resetPass();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to change password'); }
    finally { setPasswordLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Seo title="My Profile" description="Edit your profile information and password." />
      <Breadcrumb items={[{ label: 'My Account', path: '/account' }, { label: 'Profile' }]} />
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">My Profile</h1>
      <div className="space-y-8">
        <div className="glass-card p-8">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-6"><User className="w-5 h-5 text-primary-600" /> Personal Information</h2>
          <form onSubmit={handleProfile(onProfileSubmit)} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input {...regProfile('name')} className="input-field" />
                {profileErrors.name && <p className="text-red-500 text-xs mt-1">{profileErrors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input value={user?.email} disabled className="input-field bg-gray-100 dark:bg-gray-800 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input {...regProfile('phone')} className="input-field" />
              </div>
            </div>
            <button type="submit" disabled={profileLoading} className="btn-primary">{profileLoading ? 'Saving...' : 'Save Changes'}</button>
          </form>
        </div>
        <div className="glass-card p-8">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-6"><Lock className="w-5 h-5 text-primary-600" /> Change Password</h2>
          <form onSubmit={handlePass(onPasswordSubmit)} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium mb-2">Current Password</label>
              <input type="password" {...regPass('currentPassword')} className="input-field" />
              {passErrors.currentPassword && <p className="text-red-500 text-xs mt-1">{passErrors.currentPassword.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">New Password</label>
              <input type="password" {...regPass('newPassword')} className="input-field" />
              {passErrors.newPassword && <p className="text-red-500 text-xs mt-1">{passErrors.newPassword.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Confirm New Password</label>
              <input type="password" {...regPass('confirmPassword')} className="input-field" />
              {passErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{passErrors.confirmPassword.message}</p>}
            </div>
            <button type="submit" disabled={passwordLoading} className="btn-primary">{passwordLoading ? 'Changing...' : 'Change Password'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
