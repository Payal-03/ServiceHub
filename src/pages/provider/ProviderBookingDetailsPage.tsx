import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  User,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Phone,
  Mail,
  DollarSign,
  Send,
  Navigation
} from 'lucide-react';
import { bookingService } from '../../services/api';
import { Booking, BookingStatus } from '../../types';
import { BOOKING_STATUS_CONFIG } from '../../constants/bookingStatusConfig';
import { BookingTimeline } from '../../components/booking/BookingTimeline';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';
import { ErrorState } from '../../components/common/ErrorState';

export const ProviderBookingDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Transition confirmation modal
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [targetNextStatus, setTargetNextStatus] = useState<BookingStatus | null>(null);
  const [transitionNote, setTransitionNote] = useState('');

  // Final Cost Submission Modal (when transitioning to COMPLETED or during IN_PROGRESS)
  const [costModalOpen, setCostModalOpen] = useState(false);
  const [finalCostInput, setFinalCostInput] = useState('');
  const [finalCostReasonInput, setFinalCostReasonInput] = useState('');

  const loadBooking = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const data = await bookingService.getBookingById(id);
      setBooking(data);
      if (data.finalCost) {
        setFinalCostInput(data.finalCost.toString());
      } else {
        setFinalCostInput(data.estimatedCost.toString());
      }
      if (data.finalCostReason) {
        setFinalCostReasonInput(data.finalCostReason);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBooking();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!booking) {
    return (
      <ErrorState
        type="not_found"
        title="Booking Not Found"
        actionText="Back to Bookings"
        onRetry={() => navigate('/provider/bookings')}
      />
    );
  }

  // Determine next allowed status and contextual action label based on Requirement 21 & 22
  const statusConfig = BOOKING_STATUS_CONFIG[booking.status];
  const nextActions = statusConfig.providerActions || [];

  const handleOpenStatusConfirm = (nextStatus: BookingStatus) => {
    setTargetNextStatus(nextStatus);
    setTransitionNote('');
    setConfirmModalOpen(true);
  };

  const handleExecuteStatusTransition = async () => {
    if (!targetNextStatus) return;
    setIsUpdating(true);
    try {
      const updated = await bookingService.updateStatus(booking.id, targetNextStatus, transitionNote);
      setBooking(updated);
      setConfirmModalOpen(false);
      showToast(
        `Booking status successfully advanced to ${BOOKING_STATUS_CONFIG[targetNextStatus].label}.`,
        'success',
        'Status Advanced'
      );
    } catch (err: any) {
      showToast(err.message || 'Status transition failed', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSubmitFinalCost = async (e: React.FormEvent) => {
    e.preventDefault();
    const cost = Number(finalCostInput);
    if (!cost || cost <= 0) {
      showToast('Please enter a valid final cost amount', 'warning');
      return;
    }
    if (!finalCostReasonInput.trim()) {
      showToast('Please provide a reason or spare parts breakdown for cost adjustment', 'warning');
      return;
    }

    setIsUpdating(true);
    try {
      const updated = await bookingService.submitFinalCost(booking.id, cost, finalCostReasonInput);
      setBooking(updated);
      setCostModalOpen(false);
      showToast(
        `Final cost of ₹${cost} submitted. Customer will receive a confirmation prompt.`,
        'success',
        'Cost Revision Sent'
      );
    } catch (err: any) {
      showToast(err.message || 'Failed to submit final cost', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/provider/bookings')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all provider jobs
        </button>

        <span className="font-mono text-xs font-bold text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-md">
          {booking.bookingNumber}
        </span>
      </div>

      {/* Main Status & Large Contextual Action Banner (Requirement 22) */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 shadow-card space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          <div>
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
              Active Job Workflow State
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`text-sm font-bold px-3 py-1 rounded-full border ${statusConfig.badgeClass}`}
              >
                Current Stage: {statusConfig.label}
              </span>
            </div>
          </div>

          {/* Contextual Action Button (Requirement 22) */}
          {nextActions.length > 0 && (
            <div className="w-full sm:w-auto flex items-center gap-2">
              {nextActions.map((action) => (
                <Button
                  key={action.nextStatus}
                  variant={action.variant === 'success' ? 'success' : 'primary'}
                  size="lg"
                  onClick={() => handleOpenStatusConfirm(action.nextStatus)}
                  className="w-full sm:w-auto font-bold shadow-md"
                  rightIcon={<Navigation className="w-4 h-4" />}
                >
                  {action.actionLabel}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Option to Revise / Submit Final Cost (Requirement 14) */}
        {(booking.status === 'IN_PROGRESS' || booking.status === 'COMPLETED' || booking.status === 'SCHEDULED') && (
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-amber-900 block text-sm">
                Final Inspected Cost Adjustment
              </span>
              <p className="text-amber-800 mt-0.5">
                Current Quote: <strong>₹{booking.finalCost || booking.estimatedCost}</strong>{' '}
                {booking.finalCostStatus && `(${booking.finalCostStatus.replace(/_/g, ' ')})`}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCostModalOpen(true)}
              className="bg-white border-amber-300 text-amber-900 hover:bg-amber-100/50"
            >
              {booking.finalCost ? 'Update Final Cost' : 'Submit Final Inspected Cost'}
            </Button>
          </div>
        )}

        {/* State Machine Timeline */}
        <BookingTimeline currentStatus={booking.status} booking={booking} />
      </div>

      {/* Customer & Address Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-subtle space-y-3">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-primary-600" />
            Customer Information
          </h3>
          <div className="space-y-1">
            <h4 className="font-bold text-base text-neutral-900">{booking.customer.name}</h4>
            <div className="flex items-center gap-2 text-xs text-neutral-600 pt-1">
              <Phone className="w-3.5 h-3.5 text-neutral-400" />
              <span>{booking.customer.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-600">
              <Mail className="w-3.5 h-3.5 text-neutral-400" />
              <span>{booking.customer.email}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-subtle space-y-3">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            Service Location
          </h3>
          <p className="text-xs text-neutral-800 font-semibold leading-relaxed">
            {booking.address.street}
          </p>
          <p className="text-xs text-neutral-600">
            {booking.address.area}, {booking.address.city} - {booking.address.pincode}
          </p>
        </div>
      </div>

      {/* Problem & Schedule Summary */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-subtle space-y-3">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
          Problem Reported by Customer
        </h3>
        <p className="text-xs sm:text-sm text-neutral-700 bg-neutral-50 p-4 rounded-2xl border border-neutral-100 italic leading-relaxed">
          "{booking.description}"
        </p>
      </div>

      {/* Status Transition Confirmation Modal */}
      <Modal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title="Confirm Status Transition"
        subtitle={`Advancing to ${targetNextStatus ? BOOKING_STATUS_CONFIG[targetNextStatus].label : ''}`}
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setConfirmModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isUpdating}
              onClick={handleExecuteStatusTransition}
            >
              Confirm Update
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-xs text-neutral-600 leading-relaxed">
            Are you sure you want to transition this booking to{' '}
            <strong className="text-neutral-900">
              {targetNextStatus ? BOOKING_STATUS_CONFIG[targetNextStatus].label : ''}
            </strong>
            ? The customer will receive an immediate notification update.
          </p>
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Internal Dispatch / Arrival Note (Optional)
            </label>
            <input
              type="text"
              value={transitionNote}
              onChange={(e) => setTransitionNote(e.target.value)}
              placeholder="e.g. Arrived at building gate, started diagnosis..."
              className="w-full text-xs p-3 rounded-xl border border-neutral-300 focus:border-primary-500 outline-none"
            />
          </div>
        </div>
      </Modal>

      {/* Final Cost Revision Modal (Requirement 14) */}
      <Modal
        isOpen={costModalOpen}
        onClose={() => setCostModalOpen(false)}
        title="Submit Final Inspected Cost"
        subtitle="Requires explicit customer approval"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setCostModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isUpdating}
              onClick={handleSubmitFinalCost}
            >
              Submit For Approval
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmitFinalCost} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Final Cost (₹ INR) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-bold">
                ₹
              </span>
              <input
                type="number"
                required
                min={1}
                value={finalCostInput}
                onChange={(e) => setFinalCostInput(e.target.value)}
                placeholder="e.g. 1150"
                className="w-full text-sm pl-8 pr-4 py-2.5 rounded-xl border border-neutral-300 focus:border-primary-500 outline-none font-bold"
              />
            </div>
            <span className="text-[10px] text-neutral-400 mt-1 block">
              Original base estimate was ₹{booking.estimatedCost}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Reason for Cost Change / Replacement Spares <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={finalCostReasonInput}
              onChange={(e) => setFinalCostReasonInput(e.target.value)}
              placeholder="e.g. Additional copper pipe replacement and flared valve sealing required."
              className="w-full text-xs p-3 rounded-xl border border-neutral-300 focus:border-primary-500 outline-none"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
