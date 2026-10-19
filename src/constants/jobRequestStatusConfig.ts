import { JobRequestStatus } from '../types';

export interface JobRequestStatusMeta {
  label: string;
  shortLabel: string;
  description: string;
  badgeClass: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  stepNumber: number;
}

export const JOB_REQUEST_STATUS_CONFIG: Record<JobRequestStatus, JobRequestStatusMeta> = {
  POSTED: {
    label: 'Request Live · Looking for Nearby Pros',
    shortLabel: 'Posted',
    description: 'Your request is visible to verified nearby technicians in your locality.',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    bgClass: 'bg-amber-500',
    textClass: 'text-amber-800',
    borderClass: 'border-amber-300',
    stepNumber: 1,
  },
  PROVIDER_INTERESTED: {
    label: 'Providers Interested',
    shortLabel: 'Interested Pros',
    description: 'Technicians in your area have reviewed your problem and expressed interest.',
    badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
    bgClass: 'bg-blue-500',
    textClass: 'text-blue-800',
    borderClass: 'border-blue-300',
    stepNumber: 2,
  },
  PROVIDER_ACCEPTED: {
    label: 'Provider Accepted',
    shortLabel: 'Provider Selected',
    description: 'You accepted a professional. The provider has confirmed the service slot.',
    badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    bgClass: 'bg-indigo-500',
    textClass: 'text-indigo-800',
    borderClass: 'border-indigo-300',
    stepNumber: 3,
  },
  IN_PROGRESS: {
    label: 'Work In Progress',
    shortLabel: 'In Progress',
    description: 'The technician is currently on-site diagnosing and repairing the problem.',
    badgeClass: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    bgClass: 'bg-cyan-500',
    textClass: 'text-cyan-800',
    borderClass: 'border-cyan-300',
    stepNumber: 4,
  },
  PROVIDER_MARKED_COMPLETE: {
    label: 'Awaiting Customer Confirmation',
    shortLabel: 'Provider Done',
    description: 'Provider marked work as done. Please inspect the repair and confirm completion.',
    badgeClass: 'bg-purple-50 text-purple-800 border-purple-200',
    bgClass: 'bg-purple-500',
    textClass: 'text-purple-800',
    borderClass: 'border-purple-300',
    stepNumber: 5,
  },
  CUSTOMER_CONFIRMED_COMPLETE: {
    label: 'Customer Confirmed',
    shortLabel: 'Customer Confirmed',
    description: 'Customer verified the work. Finalizing settlement.',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    bgClass: 'bg-emerald-500',
    textClass: 'text-emerald-800',
    borderClass: 'border-emerald-300',
    stepNumber: 6,
  },
  COMPLETED: {
    label: 'Service Completed',
    shortLabel: 'Completed',
    description: 'Both provider and customer confirmed completion. Work successfully finished.',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    bgClass: 'bg-emerald-600',
    textClass: 'text-emerald-800',
    borderClass: 'border-emerald-400',
    stepNumber: 6,
  },
  CANCELLED: {
    label: 'Request Cancelled',
    shortLabel: 'Cancelled',
    description: 'This service request was closed before work started.',
    badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
    bgClass: 'bg-rose-500',
    textClass: 'text-rose-800',
    borderClass: 'border-rose-300',
    stepNumber: 0,
  },
};
