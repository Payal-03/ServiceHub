import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

export const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useAuth();

  const getDashboardPath = () => {
    if (role === 'ADMIN') return '/admin/dashboard';
    if (role === 'PROVIDER') return '/provider/dashboard';
    return '/customer/dashboard';
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center bg-white rounded-2xl border border-neutral-200/90 p-8 shadow-card">
        <div className="w-16 h-16 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center text-rose-600 mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold text-rose-600 uppercase tracking-widest bg-rose-50 px-2.5 py-1 rounded-full">
          HTTP 403 · Access Forbidden
        </span>
        <h1 className="text-2xl font-bold text-neutral-900 mt-3 mb-2">
          Restricted Portal Access
        </h1>
        <p className="text-sm text-neutral-500 leading-relaxed mb-6">
          Your current account role <strong className="text-neutral-800">({role || 'Guest'})</strong> is not authorized to access this administrative or provider workflow.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate(-1)}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Go Back
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate(getDashboardPath())}
            leftIcon={<Home className="w-4 h-4" />}
          >
            My Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};
