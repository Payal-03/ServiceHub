import React from 'react';
import {
  FileText,
  UserCheck,
  Wrench,
  CheckCircle2,
  Check,
  Clock,
  AlertCircle,
  XCircle,
  ArrowRight
} from 'lucide-react';
import { ServiceRequest } from '../../types';

interface RequestLifecycleTrackerProps {
  request: ServiceRequest;
  className?: string;
}

export interface LifecycleStageInfo {
  step: number;
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  status: 'completed' | 'active' | 'pending' | 'cancelled';
}

export const RequestLifecycleTracker: React.FC<RequestLifecycleTrackerProps> = ({
  request,
  className = '',
}) => {
  const isCancelled = request.status === 'CANCELLED';
  const isExpired = request.status === 'EXPIRED';
  const isCompleted = request.status === 'COMPLETED';
  const hasSelectedElectrician = Boolean(request.selectedElectricianId || request.selectedElectrician);
  const isInProgress = request.status === 'IN_PROGRESS';

  // Determine current stage number (1: Open, 2: Electrician Selected, 3: Work In Progress, 4: Work Completed)
  let currentStageNumber = 1;
  if (isCompleted) {
    currentStageNumber = 4;
  } else if (isInProgress) {
    // Electrician has been selected and the job is in progress
    currentStageNumber = 3;
  } else if (hasSelectedElectrician) {
    currentStageNumber = 2;
  } else {
    currentStageNumber = 1;
  }

  // The 4 distinct stages requested
  const stages: LifecycleStageInfo[] = [
    {
      step: 1,
      id: 'open',
      label: 'Open',
      icon: FileText,
      description: isCancelled
        ? 'Request was cancelled'
        : isExpired
        ? 'Request expired'
        : currentStageNumber > 1
        ? 'Job posted'
        : 'Accepting electrician quotes',
      status: isCancelled || isExpired
        ? 'cancelled'
        : currentStageNumber > 1
        ? 'completed'
        : 'active',
    },
    {
      step: 2,
      id: 'selected',
      label: 'Electrician Selected',
      icon: UserCheck,
      description:
        hasSelectedElectrician && request.selectedElectrician?.name
          ? `Selected: ${request.selectedElectrician.name}`
          : hasSelectedElectrician
          ? 'Electrician assigned'
          : 'Waiting for selection',
      status: isCancelled || isExpired
        ? 'pending'
        : currentStageNumber > 2
        ? 'completed'
        : currentStageNumber === 2
        ? 'active'
        : 'pending',
    },
    {
      step: 3,
      id: 'in_progress',
      label: 'Work In Progress',
      icon: Wrench,
      description:
        isCompleted
          ? 'Work finished'
          : isInProgress
          ? request.electricianConfirmed && !request.customerConfirmed
            ? 'Electrician done • Awaiting customer'
            : request.customerConfirmed && !request.electricianConfirmed
            ? 'Customer confirmed • Awaiting pro'
            : 'Repair work underway'
          : 'Work not started',
      status: isCancelled || isExpired
        ? 'pending'
        : currentStageNumber > 3
        ? 'completed'
        : currentStageNumber === 3
        ? 'active'
        : 'pending',
    },
    {
      step: 4,
      id: 'completed',
      label: 'Work Completed',
      icon: CheckCircle2,
      description: isCompleted
        ? 'Confirmed & Verified'
        : 'Awaiting completion confirmation',
      status: isCancelled || isExpired
        ? 'pending'
        : isCompleted
        ? 'completed'
        : 'pending',
    },
  ];

  // Helper text and badge info based on current state
  const getStageSummary = () => {
    if (isCancelled) {
      return {
        badge: 'Cancelled',
        badgeVariant: 'bg-rose-50 text-rose-700 border-rose-200',
        message: 'This service request was cancelled. No further actions can be taken.',
      };
    }
    if (isExpired) {
      return {
        badge: 'Expired',
        badgeVariant: 'bg-neutral-100 text-neutral-600 border-neutral-200',
        message: 'This request expired before an electrician was selected.',
      };
    }
    if (isCompleted) {
      return {
        badge: 'Stage 4 of 4: Completed',
        badgeVariant: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        message: 'Electrical work is completed and confirmed by both parties. Reviews and ratings are now open!',
      };
    }
    if (isInProgress) {
      if (request.electricianConfirmed && !request.customerConfirmed) {
        return {
          badge: 'Stage 3 of 4: In Progress',
          badgeVariant: 'bg-blue-50 text-blue-800 border-blue-200',
          message: 'Electrician has confirmed completion! Customer must now confirm completion to finalize the job.',
        };
      }
      if (request.customerConfirmed && !request.electricianConfirmed) {
        return {
          badge: 'Stage 3 of 4: In Progress',
          badgeVariant: 'bg-blue-50 text-blue-800 border-blue-200',
          message: 'Customer confirmed completion! Electrician must now mark the job completed to finalize.',
        };
      }
      return {
        badge: 'Stage 3 of 4: In Progress',
        badgeVariant: 'bg-blue-50 text-blue-800 border-blue-200',
        message: `Electrician ${request.selectedElectrician?.name ? `(${request.selectedElectrician.name})` : ''} is on the job. Both parties will confirm completion once work is finished.`,
      };
    }
    if (hasSelectedElectrician) {
      return {
        badge: 'Stage 2 of 4: Electrician Selected',
        badgeVariant: 'bg-amber-50 text-amber-800 border-amber-200',
        message: 'An electrician has been selected. Work will begin shortly.',
      };
    }
    return {
      badge: 'Stage 1 of 4: Open',
      badgeVariant: 'bg-primary-50 text-primary-800 border-primary-200',
      message: 'Request is live and open for bidding. Nearby electricians can view and quote their price.',
    };
  };

  const summary = getStageSummary();

  // Progress percentage for background progress line
  // 4 stages: step 1 = 0%, step 2 = 33.3%, step 3 = 66.6%, step 4 = 100%
  let progressPercentage = 0;
  if (!isCancelled && !isExpired) {
    if (isCompleted) {
      progressPercentage = 100;
    } else if (currentStageNumber === 3) {
      progressPercentage = 66.6;
    } else if (currentStageNumber === 2) {
      progressPercentage = 33.3;
    } else {
      progressPercentage = 0;
    }
  }

  return (
    <div
      className={`bg-white p-5 sm:p-7 rounded-3xl border border-neutral-200 shadow-xs space-y-6 ${className}`}
      data-testid="request-lifecycle-tracker"
    >
      {/* Header with Title and Current Stage Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-neutral-900 flex items-center gap-2">
            <span>Request Lifecycle Tracker</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            4-stage live progress tracker updated automatically with each action
          </p>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border self-start sm:self-auto ${summary.badgeVariant}`}
        >
          {summary.badge}
        </span>
      </div>

      {/* Stepper Progress Bar (Desktop & Mobile Responsive) */}
      <div className="relative pt-2 pb-2">
        {/* Background connector line */}
        <div className="hidden sm:block absolute top-[28px] left-[10%] right-[10%] h-1 bg-neutral-100 rounded-full z-0">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* 4 Stage Nodes */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-2 relative z-10">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            const isStageCompleted = stage.status === 'completed';
            const isStageActive = stage.status === 'active';
            const isStageCancelled = stage.status === 'cancelled';

            return (
              <div
                key={stage.id}
                className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2"
              >
                {/* Step Circle Indicator */}
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm transition-all flex-shrink-0 ${
                    isStageCancelled
                      ? 'bg-rose-100 text-rose-600 border border-rose-300'
                      : isStageCompleted
                      ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/30 ring-4 ring-emerald-50'
                      : isStageActive
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-600/30 ring-4 ring-primary-100 animate-pulse'
                      : 'bg-neutral-100 text-neutral-400 border border-neutral-200'
                  }`}
                >
                  {isStageCompleted ? (
                    <Check className="w-5 h-5 stroke-[2.8]" />
                  ) : isStageCancelled ? (
                    <XCircle className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>

                {/* Step Text Info */}
                <div className="flex-1 sm:flex-initial space-y-0.5 sm:space-y-1">
                  <div className="flex items-center gap-1.5 sm:justify-center">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-400">
                      Stage {stage.step}
                    </span>
                    {isStageActive && (
                      <span className="inline-block w-2 h-2 rounded-full bg-primary-600 animate-ping" />
                    )}
                  </div>

                  <h3
                    className={`text-xs sm:text-sm font-extrabold ${
                      isStageCompleted
                        ? 'text-neutral-900'
                        : isStageActive
                        ? 'text-primary-700'
                        : 'text-neutral-400'
                    }`}
                  >
                    {stage.label}
                  </h3>

                  <p
                    className={`text-[11px] leading-tight line-clamp-2 ${
                      isStageCompleted
                        ? 'text-emerald-700 font-medium'
                        : isStageActive
                        ? 'text-primary-600 font-medium'
                        : 'text-neutral-400'
                    }`}
                  >
                    {stage.description}
                  </p>
                </div>

                {/* Mobile connecting arrow for list view on small screens */}
                {idx < stages.length - 1 && (
                  <div className="sm:hidden text-neutral-300 self-center">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contextual Status Alert Callout */}
      <div
        className={`p-3.5 sm:p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-3 transition-colors ${
          isCancelled
            ? 'bg-rose-50 border-rose-200 text-rose-800'
            : isCompleted
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : isInProgress
            ? 'bg-blue-50/90 border-blue-200 text-blue-900'
            : 'bg-neutral-50 border-neutral-200 text-neutral-700'
        }`}
      >
        <div className="mt-0.5 flex-shrink-0">
          {isCancelled ? (
            <AlertCircle className="w-4 h-4 text-rose-600" />
          ) : isCompleted ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : isInProgress ? (
            <Wrench className="w-4 h-4 text-blue-600" />
          ) : (
            <Clock className="w-4 h-4 text-primary-600" />
          )}
        </div>
        <div className="space-y-0.5">
          <span className="font-semibold block">
            {isCompleted
              ? 'Job Successfully Completed'
              : isInProgress
              ? 'Work Currently In Progress'
              : hasSelectedElectrician
              ? 'Electrician Assigned'
              : 'Request Open For Quotes'}
          </span>
          <p className="text-xs leading-relaxed opacity-90">{summary.message}</p>
        </div>
      </div>
    </div>
  );
};

