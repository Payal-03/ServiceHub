import React from 'react';
import { Check, Clock, AlertTriangle, XCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Booking, BookingStatus } from '../../types';
import { ORDERED_LIFECYCLE_STATUSES, BOOKING_STATUS_CONFIG } from '../../constants/bookingStatusConfig';

interface BookingTimelineProps {
  currentStatus: BookingStatus;
  booking?: Booking;
  compact?: boolean;
}

export const BookingTimeline: React.FC<BookingTimelineProps> = ({
  currentStatus,
  booking,
  compact = false,
}) => {
  const isCancelled = currentStatus === 'CANCELLED';

  if (isCancelled) {
    return (
      <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-5 text-rose-900">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0 text-rose-600">
            <XCircle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-rose-900 text-base">Booking Cancelled</h4>
              <span className="text-xs bg-rose-200/80 text-rose-800 font-medium px-2 py-0.5 rounded-full">
                {booking?.cancelledBy ? `by ${booking.cancelledBy.toLowerCase()}` : 'Terminated'}
              </span>
            </div>
            <p className="text-sm text-rose-700 mt-1">
              Reason: {booking?.cancellationReason || 'No specific cancellation reason provided.'}
            </p>
            {booking?.updatedAt && (
              <span className="text-xs text-rose-500 mt-2 block">
                Cancelled on {new Date(booking.updatedAt).toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  const currentIndex = ORDERED_LIFECYCLE_STATUSES.indexOf(currentStatus);

  if (compact) {
    return (
      <div className="flex items-center gap-2 overflow-x-auto py-2">
        {ORDERED_LIFECYCLE_STATUSES.map((status, index) => {
          const isPast = index < currentIndex;
          const isCurrent = index === currentIndex;
          const config = BOOKING_STATUS_CONFIG[status];

          return (
            <React.Fragment key={status}>
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  isCurrent
                    ? 'bg-primary-600 text-white shadow-xs'
                    : isPast
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-neutral-100 text-neutral-400'
                }`}
              >
                {isPast ? (
                  <Check className="w-3 h-3 stroke-[3]" />
                ) : isCurrent ? (
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-neutral-300" />
                )}
                {config.label}
              </div>
              {index < ORDERED_LIFECYCLE_STATUSES.length - 1 && (
                <div
                  className={`w-4 h-0.5 flex-shrink-0 ${
                    index < currentIndex ? 'bg-emerald-300' : 'bg-neutral-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  return (
    <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-subtle">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-100">
        <div>
          <h4 className="font-semibold text-neutral-900 text-base flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary-600" />
            Booking Workflow Lifecycle
          </h4>
          <p className="text-xs text-neutral-500 mt-0.5">
            Transparent verified status transitions tracked in real-time
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-neutral-500">Current Phase:</span>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${BOOKING_STATUS_CONFIG[currentStatus].badgeClass}`}>
            {BOOKING_STATUS_CONFIG[currentStatus].label}
          </span>
        </div>
      </div>

      {/* Responsive Timeline: Desktop Stepper & Mobile Vertical List */}
      <div className="hidden lg:flex items-center justify-between relative px-2">
        {/* Connection Bar */}
        <div className="absolute top-5 left-8 right-8 h-1 bg-neutral-100 -z-0">
          <div
            className="h-full bg-primary-600 transition-all duration-500"
            style={{
              width: `${(Math.max(0, currentIndex) / (ORDERED_LIFECYCLE_STATUSES.length - 1)) * 100}%`,
            }}
          />
        </div>

        {ORDERED_LIFECYCLE_STATUSES.map((status, index) => {
          const isPast = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isFuture = index > currentIndex;
          const config = BOOKING_STATUS_CONFIG[status];

          return (
            <div key={status} className="flex flex-col items-center relative z-10 text-center max-w-[100px]">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 border-2 ${
                  isCurrent
                    ? 'bg-primary-600 text-white border-primary-300 ring-4 ring-primary-100 scale-110 shadow-md'
                    : isPast
                    ? 'bg-emerald-600 text-white border-emerald-300 shadow-xs'
                    : 'bg-white text-neutral-400 border-neutral-200'
                }`}
              >
                {isPast ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : isCurrent ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span
                className={`text-xs mt-2.5 font-medium leading-tight ${
                  isCurrent
                    ? 'text-primary-700 font-bold'
                    : isPast
                    ? 'text-neutral-800'
                    : 'text-neutral-400'
                }`}
              >
                {config.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile/Tablet Vertical Timeline */}
      <div className="lg:hidden space-y-4">
        {ORDERED_LIFECYCLE_STATUSES.map((status, index) => {
          const isPast = index < currentIndex;
          const isCurrent = index === currentIndex;
          const config = BOOKING_STATUS_CONFIG[status];
          const matchedTimelineItem = booking?.timeline?.find((t) => t.status === status);

          return (
            <div key={status} className="flex items-start gap-3.5 relative">
              {index < ORDERED_LIFECYCLE_STATUSES.length - 1 && (
                <div
                  className={`absolute top-7 left-4 w-0.5 h-[calc(100%+8px)] -translate-x-1/2 ${
                    index < currentIndex ? 'bg-emerald-400' : 'bg-neutral-200'
                  }`}
                />
              )}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 z-10 transition-all ${
                  isCurrent
                    ? 'bg-primary-600 text-white ring-4 ring-primary-100'
                    : isPast
                    ? 'bg-emerald-600 text-white'
                    : 'bg-neutral-100 text-neutral-400 border border-neutral-200'
                }`}
              >
                {isPast ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : index + 1}
              </div>
              <div className="flex-1 pb-1">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm font-semibold ${
                      isCurrent ? 'text-primary-700' : isPast ? 'text-neutral-900' : 'text-neutral-400'
                    }`}
                  >
                    {config.label}
                  </span>
                  {matchedTimelineItem && (
                    <span className="text-[11px] text-neutral-400">
                      {new Date(matchedTimelineItem.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">{config.description}</p>
                {matchedTimelineItem?.note && (
                  <p className="text-xs bg-neutral-50 border border-neutral-100 rounded-lg p-2 mt-1.5 text-neutral-700">
                    {matchedTimelineItem.note}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
