import React, { useState } from 'react';
import { Bell, Lock, Shield, Smartphone } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

export const ProviderSettingsPage: React.FC = () => {
  const { showToast } = useToast();

  const [instantRequestAlerts, setInstantRequestAlerts] = useState(true);
  const [dailySummary, setDailySummary] = useState(true);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPass || !newPass) {
      showToast('Please enter both passwords', 'warning');
      return;
    }
    showToast('Provider security password updated', 'success');
    setCurrentPass('');
    setNewPass('');
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-subtle">
        <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
          Provider Portal Settings
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
          Configure dispatch alerts, schedule notifications, and account credentials.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-card space-y-4">
        <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary-600" />
          Dispatch & Request Alerts
        </h3>

        <div className="space-y-3 divide-y divide-neutral-100">
          <div className="pt-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-neutral-900 block">Instant New Request Notification</span>
              <p className="text-xs text-neutral-500">
                Audible sound & high priority alert whenever a customer requests a service slot.
              </p>
            </div>
            <input
              type="checkbox"
              checked={instantRequestAlerts}
              onChange={(e) => setInstantRequestAlerts(e.target.checked)}
              className="w-4 h-4 text-primary-600 rounded border-neutral-300"
            />
          </div>

          <div className="pt-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-neutral-900 block">Daily Morning Dispatch Digest</span>
              <p className="text-xs text-neutral-500">
                Summary of scheduled appointments arriving at 07:00 AM daily.
              </p>
            </div>
            <input
              type="checkbox"
              checked={dailySummary}
              onChange={(e) => setDailySummary(e.target.checked)}
              className="w-4 h-4 text-primary-600 rounded border-neutral-300"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-card space-y-4">
        <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
          <Lock className="w-5 h-5 text-neutral-700" />
          Security & Password
        </h3>

        <form onSubmit={handleSaveSecurity} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
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
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
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
