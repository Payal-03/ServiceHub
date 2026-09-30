import React from 'react';
import { AlertCircle, WifiOff, ShieldAlert, FileQuestion, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';

interface ErrorStateProps {
  type?: 'general' | 'network' | 'unauthorized' | 'forbidden' | 'not_found';
  title?: string;
  message?: string;
  onRetry?: () => void;
  actionText?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  type = 'general',
  title,
  message,
  onRetry,
  actionText = 'Try Again',
}) => {
  const configs = {
    general: {
      icon: AlertCircle,
      iconColor: 'text-rose-600 bg-rose-50',
      defaultTitle: 'Something went wrong',
      defaultMessage: "We couldn't complete your request. Please try again or refresh the page.",
    },
    network: {
      icon: WifiOff,
      iconColor: 'text-amber-600 bg-amber-50',
      defaultTitle: 'Network Connection Lost',
      defaultMessage: 'Please check your internet connection or backend API status and retry.',
    },
    unauthorized: {
      icon: ShieldAlert,
      iconColor: 'text-primary-600 bg-primary-50',
      defaultTitle: 'Session Expired',
      defaultMessage: 'Please log in again to continue accessing this service.',
    },
    forbidden: {
      icon: ShieldAlert,
      iconColor: 'text-rose-600 bg-rose-50',
      defaultTitle: 'Access Restricted (403)',
      defaultMessage: 'You do not have authorization to view this role dashboard or resource.',
    },
    not_found: {
      icon: FileQuestion,
      iconColor: 'text-neutral-600 bg-neutral-100',
      defaultTitle: 'Record Not Found (404)',
      defaultMessage: 'The requested booking, provider, or page could not be located.',
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl bg-white border border-neutral-200/80 shadow-card max-w-lg mx-auto my-8">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${config.iconColor}`}>
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-neutral-900 mb-1.5">
        {title || config.defaultTitle}
      </h3>
      <p className="text-sm text-neutral-500 mb-6 max-w-md leading-relaxed">
        {message || config.defaultMessage}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="primary" leftIcon={<RotateCcw className="w-4 h-4" />}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
