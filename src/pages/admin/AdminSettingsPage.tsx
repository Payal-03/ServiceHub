import React, { useState } from 'react';
import { Settings, Shield, Server, Database, Save, RotateCcw } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

export const AdminSettingsPage: React.FC = () => {
  const { showToast } = useToast();

  const [platformName, setPlatformName] = useState('ServiceHub Technologies');
  const [supportEmail, setSupportEmail] = useState('support@servicehub.in');
  const [apiEndpoint, setApiEndpoint] = useState(
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
  );
  const [autoVerifyProviders, setAutoVerifyProviders] = useState(false);
  const [enforceStrictSLA, setEnforceStrictSLA] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Platform operational settings saved successfully', 'success');
  };

  const handleResetMock = () => {
    localStorage.clear();
    showToast('Mock data store reset to factory seed. Reloading page...', 'info');
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
            System & API Architecture Settings
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Configure backend connection endpoints and global administrative parameters.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleResetMock}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          Reset Demo Data
        </Button>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 shadow-card space-y-6">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Platform Brand Name
            </label>
            <input
              type="text"
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-neutral-300 focus:border-primary-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Spring Boot REST API Base URL
            </label>
            <div className="relative">
              <Server className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                placeholder="http://localhost:8080/api"
                className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 focus:border-primary-500 outline-none font-mono"
              />
            </div>
            <span className="text-[11px] text-neutral-400 mt-1 block">
              Frontend uses automatic persistent mock fallback if Spring Boot is offline.
            </span>
          </div>

          <div className="pt-3 border-t border-neutral-100 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-neutral-900 block">
                  Enforce Verification Requirement
                </span>
                <p className="text-xs text-neutral-500">
                  Only providers with VERIFIED status appear in customer search results.
                </p>
              </div>
              <input
                type="checkbox"
                checked={!autoVerifyProviders}
                onChange={(e) => setAutoVerifyProviders(!e.target.checked)}
                className="w-4 h-4 text-primary-600 rounded border-neutral-300"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-xs font-bold text-neutral-900 block">
                  Strict Sequential State Machine
                </span>
                <p className="text-xs text-neutral-500">
                  Block jumping directly from Accepted to Completed without On The Way & In Progress.
                </p>
              </div>
              <input
                type="checkbox"
                checked={enforceStrictSLA}
                onChange={(e) => setEnforceStrictSLA(e.target.checked)}
                className="w-4 h-4 text-primary-600 rounded border-neutral-300"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Configuration
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
