import React from 'react';
import { Check, Clock, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { JobRequestStatus } from '../../types';
import { JOB_REQUEST_STATUS_CONFIG } from '../../constants/jobRequestStatusConfig';

interface RequestStatusTimelineProps {
  status: JobRequestStatus;
  providerCompleted: boolean;
  customerConfirmed: boolean;
  providerName?: string;
  customerName?: string;
}

export const RequestStatusTimeline: React.FC<RequestStatusTimelineProps> = ({
  status,
  providerCompleted,
  customerConfirmed,
  providerName = 'Provider',
  customerName = 'Customer',
}) => {
  if (status === 'CANCELLED') {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-3">
        <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
        <div>
          <h4 className="text-xs font-bold text-rose-900">Request Cancelled</h4>
          <p className="text-[11px] text-rose-700">This request was cancelled before completion.</p>
        </div>
      </div>
    );
  }

  const steps = [
    { key: 'POSTED', label: 'Request Posted' },
    { key: 'PROVIDER_INTERESTED', label: 'Pros Interested' },
    { key: 'PROVIDER_ACCEPTED', label: 'Pro Accepted' },
    { key: 'IN_PROGRESS', label: 'Work In Progress' },
    { key: 'COMPLETED', label: 'Both Confirmed' },
  ];

  const currentOrder = JOB_REQUEST_STATUS_CONFIG[status]?.stepNumber || 1;

  return (
    <div className="space-y-4">
      {/* Step Indicators */}
      <div className="hidden sm:grid grid-cols-5 gap-2 relative">
        {steps.map((st, i) => {
          const stepNum = i + 1;
          const isDone = currentOrder > stepNum || status === 'COMPLETED';
          const isCurrent = currentOrder === stepNum && status !== 'COMPLETED';

          return (
            <div key={st.key} className="relative flex flex-col items-center text-center">
              {i < steps.length - 1 && (
                <div
                  className={`absolute top-3.5 left-1/2 w-full h-0.5 -z-0 transition-colors ${
                    isDone ? 'bg-primary-600' : 'bg-neutral-200'
                  }`}
                />
              )}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all relative z-10 ${
                  isDone
                    ? 'bg-primary-600 text-white shadow-xs'
                    : isCurrent
                    ? 'bg-primary-50 text-primary-700 border-2 border-primary-600 ring-4 ring-primary-100'
                    : 'bg-neutral-100 text-neutral-400 border border-neutral-200'
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : stepNum}
              </div>
              <span
                className={`text-[11px] mt-2 font-medium leading-tight ${
                  isCurrent ? 'font-bold text-primary-700' : isDone ? 'text-neutral-800' : 'text-neutral-400'
                }`}
              >
                {st.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Two-Sided Completion Verification Card */}
      {(status === 'IN_PROGRESS' ||
        status === 'PROVIDER_MARKED_COMPLETE' ||
        status === 'CUSTOMER_CONFIRMED_COMPLETE' ||
        status === 'COMPLETED') && (
        <div className="rounded-2xl border border-neutral-200 p-4 bg-neutral-50/70 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-900 tracking-tight flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-primary-600" />
              Two-Sided Service Completion Verification
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                status === 'COMPLETED'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {status === 'COMPLETED' ? '100% Completed' : 'Verification In Progress'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Provider Completion Box */}
            <div
              className={`p-3 rounded-xl border flex items-center justify-between ${
                providerCompleted
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                  : 'bg-white border-neutral-200 text-neutral-600'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    providerCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-neutral-100 text-neutral-400'
                  }`}
                >
                  {providerCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '1'}
                </div>
                <div>
                  <p className="font-bold text-neutral-900">{providerName}</p>
                  <p className="text-[11px] text-neutral-500">
                    {providerCompleted ? 'Marked Job Complete ✓' : 'Currently performing work...'}
                  </p>
                </div>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  providerCompleted
                    ? 'bg-emerald-200/60 text-emerald-800'
                    : 'bg-neutral-100 text-neutral-500'
                }`}
              >
                {providerCompleted ? 'Done' : 'Pending'}
              </span>
            </div>

            {/* Customer Completion Box */}
            <div
              className={`p-3 rounded-xl border flex items-center justify-between ${
                customerConfirmed
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                  : 'bg-white border-neutral-200 text-neutral-600'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    customerConfirmed
                      ? 'bg-emerald-600 text-white'
                      : 'bg-neutral-100 text-neutral-400'
                  }`}
                >
                  {customerConfirmed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '2'}
                </div>
                <div>
                  <p className="font-bold text-neutral-900">{customerName}</p>
                  <p className="text-[11px] text-neutral-500">
                    {customerConfirmed
                      ? 'Confirmed Work Satisfactory ✓'
                      : providerCompleted
                      ? 'Waiting for your confirmation'
                      : 'Awaiting completion'}
                  </p>
                </div>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  customerConfirmed
                    ? 'bg-emerald-200/60 text-emerald-800'
                    : providerCompleted
                    ? 'bg-amber-100 text-amber-800 animate-pulse'
                    : 'bg-neutral-100 text-neutral-500'
                }`}
              >
                {customerConfirmed ? 'Confirmed' : providerCompleted ? 'Action Needed' : 'Pending'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
