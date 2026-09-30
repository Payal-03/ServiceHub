import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileQuestion, ArrowLeft, Home, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center bg-white rounded-2xl border border-neutral-200/90 p-8 shadow-card">
        <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center text-neutral-500 mx-auto mb-4">
          <FileQuestion className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest bg-neutral-100 px-2.5 py-1 rounded-full">
          HTTP 404 · Page Not Found
        </span>
        <h1 className="text-2xl font-bold text-neutral-900 mt-3 mb-2">
          Page Does Not Exist
        </h1>
        <p className="text-sm text-neutral-500 leading-relaxed mb-6">
          The booking, provider profile, or page you were trying to reach could not be found or has moved.
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
            onClick={() => navigate('/')}
            leftIcon={<Home className="w-4 h-4" />}
          >
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
};
