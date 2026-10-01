import React, { useState } from 'react';
import { Bell, Lock, Shield, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

export const CustomerSettingsPage: React.FC = () => {
  const { showToast } = useToast();

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [marketingAlerts, setMarketingAlerts] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showToast('Please provide current and new passwords', 'warning');
      return;
    }
    showToast('Security credentials updated successfully', 'success');
    setCurrentPassword('');
    setNewPassword('');
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-subtle">
        <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
          Account Settings & Security
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
          Configure notification preferences and authentication security settings.
        </p>
      </div>

      {/* Notifications Preferences */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-card space-y-4">
        <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary-600" />
          Notification Preferences
        </h3>

        <div className="space-y-3 divide-y divide-neutral-100">
          <div className="pt-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-neutral-900 block">Booking Status Updates</span>
              <p className="text-xs text-neutral-500">
                Receive notifications when provider accepts, arrives, or completes service.
              </p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 text-primary-600 rounded border-neutral-300"
            />
          </div>

          <div className="pt-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-neutral-900 block">Final Cost Confirmations</span>
              <p className="text-xs text-neutral-500">
                Immediate notifications whenever a technician proposes an inspected price change.
              </p>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
              className="w-4 h-4 text-primary-600 rounded border-neutral-300"
            />
          </div>

          <div className="pt-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-neutral-900 block">Seasonal Offers & Tips</span>
              <p className="text-xs text-neutral-500">
                Quarterly maintenance reminders for AC servicing, home deep cleaning, etc.
              </p>
            </div>
            <input
              type="checkbox"
              checked={marketingAlerts}
              onChange={(e) => setMarketingAlerts(e.target.checked)}
              className="w-4 h-4 text-primary-600 rounded border-neutral-300"
            />
          </div>
        </div>
      </div>

      {/* Password & Security */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-card space-y-4">
        <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
          <Lock className="w-5 h-5 text-neutral-700" />
          Change Password
        </h3>

        <form onSubmit={handleSaveSecurity} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-neutral-300 focus:border-primary-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-neutral-300 focus:border-primary-500 outline-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="md">
              Update Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
