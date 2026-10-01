import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, ShieldCheck, Camera, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';

export const CustomerProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState('Flat 402, Radhika Heights, Opp. BSA College Road, Krishna Nagar, Mathura - 281001');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({ name, phone });
      showToast('Profile information updated successfully.', 'success', 'Profile Saved');
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-subtle">
        <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
          Customer Profile
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
          Manage your personal details, verified contact phone, and saved service address.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 shadow-card space-y-6">
        {/* Avatar Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-neutral-100">
          <div className="relative">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
              alt={user?.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-neutral-200 shadow-xs"
            />
          </div>
          <div>
            <h3 className="font-bold text-base text-neutral-900">{user?.name}</h3>
            <p className="text-xs text-neutral-500">ServiceHub Verified Customer</p>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-1">
              Active Member
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 focus:border-primary-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Email Address (Login Identity)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                disabled
                value={email}
                className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-100 text-neutral-500 cursor-not-allowed outline-none"
              />
            </div>
            <span className="text-[10px] text-neutral-400 mt-1 block">
              Email is linked to account authentication and cannot be altered directly.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Phone Number (For Technician Dispatch)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 focus:border-primary-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Default Residential Address
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              <textarea
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 focus:border-primary-500 outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSaving}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
