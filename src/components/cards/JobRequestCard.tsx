import React from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  Zap,
  Wrench,
  Wind,
  Laptop,
  Sparkles,
  Users,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { JobRequest } from '../../types';
import { JOB_REQUEST_STATUS_CONFIG } from '../../constants/jobRequestStatusConfig';
import { Button } from '../ui/Button';

interface JobRequestCardProps {
  request: JobRequest;
  currentUserId?: string;
  userRole?: 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
  onViewDetails: (request: JobRequest) => void;
  onExpressInterest?: (request: JobRequest) => void;
  onWithdrawInterest?: (request: JobRequest) => void;
  isInterested?: boolean;
  className?: string;
}

export const JobRequestCard: React.FC<JobRequestCardProps> = ({
  request,
  currentUserId,
  userRole = 'CUSTOMER',
  onViewDetails,
  onExpressInterest,
  onWithdrawInterest,
  isInterested = false,
  className = '',
}) => {
  const statusMeta = JOB_REQUEST_STATUS_CONFIG[request.status] || JOB_REQUEST_STATUS_CONFIG.POSTED;

  const getCategoryIcon = (category: string) => {
    const c = category.toLowerCase();
    if (c.includes('electric')) return <Zap className="w-4 h-4 text-amber-500" />;
    if (c.includes('plumb')) return <Wrench className="w-4 h-4 text-blue-500" />;
    if (c.includes('ac') || c.includes('cool')) return <Wind className="w-4 h-4 text-cyan-500" />;
    if (c.includes('laptop') || c.includes('computer')) return <Laptop className="w-4 h-4 text-indigo-500" />;
    return <Sparkles className="w-4 h-4 text-purple-500" />;
  };

  const isCustomerOwner = userRole === 'CUSTOMER' && request.customerId === currentUserId;
  const isAcceptedProvider = userRole === 'PROVIDER' && request.acceptedProviderId === currentUserId;

  return (
    <div
      className={`bg-white rounded-2xl border border-neutral-200/90 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Top Row: Category, Icon & Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-200/70 flex items-center justify-center">
              {getCategoryIcon(request.serviceCategory)}
            </div>
            <div>
              <span className="text-xs font-semibold text-neutral-400 block uppercase tracking-wider">
                {request.serviceCategory}
              </span>
              <h3 className="font-bold text-base text-neutral-900 line-clamp-1">
                {request.serviceType}
              </h3>
            </div>
          </div>
          <span
            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border flex-shrink-0 ${statusMeta.badgeClass}`}
          >
            {statusMeta.shortLabel}
          </span>
        </div>

        {/* Location & Schedule */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-neutral-600 mb-3">
          <div className="flex items-center gap-1 text-neutral-700 font-medium">
            <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
            <span className="truncate max-w-[200px]">
              {request.locality}, {request.city}
            </span>
          </div>

          <div className="flex items-center gap-1 text-neutral-500">
            <Calendar className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
            <span>{request.preferredDate}</span>
            <span className="text-neutral-300">•</span>
            <span>{request.preferredTime}</span>
          </div>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed mb-4 bg-neutral-50/70 p-2.5 rounded-xl border border-neutral-100">
          "{request.description}"
        </p>

        {/* Financials & Interested Count */}
        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-neutral-50/90 border border-neutral-200/60 mb-4 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">Customer Budget</span>
            <span className="font-extrabold text-neutral-900 text-sm">
              ₹{request.budget.toLocaleString('en-IN')}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">Estimated Benchmark</span>
            <span className="font-semibold text-neutral-700 text-xs">
              ₹{request.estimatedMin}–₹{request.estimatedMax}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
        {/* Left Info: Interested Count or Status Hint */}
        <div className="text-xs text-neutral-500 flex items-center gap-1.5">
          {request.interestedProviders.length > 0 ? (
            <span className="font-semibold text-primary-700 flex items-center gap-1 bg-primary-50 px-2 py-0.5 rounded-md border border-primary-100 text-[11px]">
              <Users className="w-3 h-3 text-primary-600" />
              {request.interestedProviders.length} Pro{request.interestedProviders.length > 1 ? 's' : ''} Interested
            </span>
          ) : (
            <span className="text-[11px] text-neutral-400">Open for nearby pros</span>
          )}
        </div>

        {/* Action Buttons based on Role */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewDetails(request)}
            className="text-xs py-1.5 px-3"
          >
            View Details
          </Button>

          {userRole === 'PROVIDER' && request.status !== 'COMPLETED' && request.status !== 'CANCELLED' && !request.acceptedProviderId && (
            <>
              {isInterested ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onWithdrawInterest && onWithdrawInterest(request)}
                  className="text-xs py-1.5 px-2.5 text-rose-600 border-rose-200 hover:bg-rose-50"
                >
                  Withdraw
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => onExpressInterest && onExpressInterest(request)}
                  className="text-xs py-1.5 px-3 shadow-xs"
                >
                  I'm Interested
                </Button>
              )}
            </>
          )}

          {isCustomerOwner && request.status === 'PROVIDER_INTERESTED' && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => onViewDetails(request)}
              className="text-xs py-1.5 px-3"
            >
              Choose Pro ({request.interestedProviders.length})
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
