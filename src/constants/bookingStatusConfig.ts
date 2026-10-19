import { BookingStatus } from '../types';

export interface StatusConfigItem {
  label: string;
  description: string;
  badgeClass: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  order: number;
  allowedNextStatuses: BookingStatus[];
  providerActions?: {
    nextStatus: BookingStatus;
    actionLabel: string;
    confirmMessage: string;
    variant?: 'primary' | 'success' | 'danger';
  }[];
}

export const BOOKING_STATUS_CONFIG: Record<BookingStatus, StatusConfigItem> = {
  PENDING: {
    label: 'Pending Request',
    description: 'Booking request sent. Awaiting provider acceptance.',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    bgClass: 'bg-amber-500',
    textClass: 'text-amber-700',
    borderClass: 'border-amber-300',
    order: 1,
    allowedNextStatuses: ['ACCEPTED', 'CANCELLED'],
    providerActions: [
      {
        nextStatus: 'ACCEPTED',
        actionLabel: 'Accept Booking Request',
        confirmMessage: 'Are you sure you want to accept this booking request? The customer will be notified.',
        variant: 'primary'
      }
    ]
  },
  ACCEPTED: {
    label: 'Accepted',
    description: 'Provider accepted your request and is finalizing the appointment.',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    bgClass: 'bg-blue-500',
    textClass: 'text-blue-700',
    borderClass: 'border-blue-300',
    order: 2,
    allowedNextStatuses: ['SCHEDULED', 'CANCELLED'],
    providerActions: [
      {
        nextStatus: 'SCHEDULED',
        actionLabel: 'Confirm Schedule',
        confirmMessage: 'Confirm the scheduled time and lock the appointment slot?',
        variant: 'primary'
      }
    ]
  },
  SCHEDULED: {
    label: 'Scheduled',
    description: 'Appointment confirmed on the provider schedule.',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    bgClass: 'bg-indigo-500',
    textClass: 'text-indigo-700',
    borderClass: 'border-indigo-300',
    order: 3,
    allowedNextStatuses: ['ON_THE_WAY', 'CANCELLED'],
    providerActions: [
      {
        nextStatus: 'ON_THE_WAY',
        actionLabel: 'Mark as On The Way',
        confirmMessage: 'Are you heading to the customer location now?',
        variant: 'primary'
      }
    ]
  },
  ON_THE_WAY: {
    label: 'On The Way',
    description: 'Provider has departed and is travelling to your location.',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    bgClass: 'bg-purple-500',
    textClass: 'text-purple-700',
    borderClass: 'border-purple-300',
    order: 4,
    allowedNextStatuses: ['IN_PROGRESS', 'CANCELLED'],
    providerActions: [
      {
        nextStatus: 'IN_PROGRESS',
        actionLabel: 'Start Service',
        confirmMessage: 'Have you arrived and started diagnosing / servicing the issue?',
        variant: 'primary'
      }
    ]
  },
  IN_PROGRESS: {
    label: 'In Progress',
    description: 'Service work is currently being performed at your premises.',
    badgeClass: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    bgClass: 'bg-cyan-500',
    textClass: 'text-cyan-700',
    borderClass: 'border-cyan-300',
    order: 5,
    allowedNextStatuses: ['COMPLETED'],
    providerActions: [
      {
        nextStatus: 'COMPLETED',
        actionLabel: 'Mark Completed',
        confirmMessage: 'Is the service work completed? Make sure to verify final pricing with the customer.',
        variant: 'success'
      }
    ]
  },
  COMPLETED: {
    label: 'Service Completed',
    description: 'Service work finished. Final cost confirmed, awaiting payment recording.',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    bgClass: 'bg-emerald-500',
    textClass: 'text-emerald-700',
    borderClass: 'border-emerald-300',
    order: 6,
    allowedNextStatuses: ['PAID'],
  },
  PAID: {
    label: 'Payment Recorded',
    description: 'Payment has been successfully recorded in the system.',
    badgeClass: 'bg-green-50 text-green-700 border-green-200',
    bgClass: 'bg-green-600',
    textClass: 'text-green-700',
    borderClass: 'border-green-300',
    order: 7,
    allowedNextStatuses: ['REVIEWED'],
  },
  REVIEWED: {
    label: 'Completed & Reviewed',
    description: 'Service completed, paid, and customer feedback submitted.',
    badgeClass: 'bg-teal-50 text-teal-700 border-teal-200',
    bgClass: 'bg-teal-600',
    textClass: 'text-teal-700',
    borderClass: 'border-teal-300',
    order: 8,
    allowedNextStatuses: [],
  },
  CANCELLED: {
    label: 'Cancelled',
    description: 'Booking has been cancelled.',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    bgClass: 'bg-rose-500',
    textClass: 'text-rose-700',
    borderClass: 'border-rose-300',
    order: 9,
    allowedNextStatuses: [],
  }
};

export const ORDERED_LIFECYCLE_STATUSES: BookingStatus[] = [
  'PENDING',
  'ACCEPTED',
  'SCHEDULED',
  'ON_THE_WAY',
  'IN_PROGRESS',
  'COMPLETED',
  'PAID',
  'REVIEWED'
];
