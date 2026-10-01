import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  User,
  CreditCard,
  Star,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  FileText,
  DollarSign,
  Phone,
  Mail,
  RotateCcw
} from 'lucide-react';
import { bookingService, reviewService, paymentService } from '../../services/api';
import { Booking } from '../../types';
import { BOOKING_STATUS_CONFIG } from '../../constants/bookingStatusConfig';
import { BookingTimeline } from '../../components/booking/BookingTimeline';
import { StarRating } from '../../components/ui/StarRating';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { ErrorState } from '../../components/common/ErrorState';

export const BookingDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals & Action States
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  // Review Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Payment Recording State
  const [isPaying, setIsPaying] = useState(false);

  const loadBooking = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const data = await bookingService.getBookingById(id);
      setBooking(data);
    } catch (err: any) {
      setError(err.message || 'Booking not found');
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

  if (error || !booking) {
    return (
      <ErrorState
        type="not_found"
        title="Booking Not Found"
        message="The requested booking could not be retrieved."
        actionText="Back to Bookings"
        onRetry={() => navigate('/customer/bookings')}
      />
    );
  }

  // Handle Customer Response to Final Price Adjustment
  const handleRespondToFinalCost = async (accept: boolean) => {
    try {
      const updated = await bookingService.respondToFinalCost(booking.id, accept);
      setBooking(updated);
      showToast(
        accept
          ? `Final cost of ₹${booking.finalCost} accepted.`
          : 'Final cost revision rejected. Please contact the provider.',
        accept ? 'success' : 'warning',
        'Cost Confirmation Updated'
      );
    } catch (err: any) {
      showToast(err.message || 'Failed to update cost response', 'error');
    }
  };

  // Handle Payment Recording (In-System)
  const handleRecordPayment = async (method: string = 'CASH_RECORDED') => {
    setIsPaying(true);
    try {
      const updated = await paymentService.recordPayment(booking.id, method);
      setBooking(updated);
      showToast(
        `Payment of ₹${booking.finalCost || booking.estimatedCost} recorded successfully.`,
        'success',
        'Payment Recorded'
      );
    } catch (err: any) {
      showToast(err.message || 'Failed to record payment', 'error');
    } finally {
      setIsPaying(false);
    }
  };

  // Handle Review Submission
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      showToast('Please provide a comment for your review', 'warning');
      return;
    }

    setIsSubmittingReview(true);
    try {
      await reviewService.createReview({
        bookingId: booking.id,
        customerId: booking.customerId,
        customerName: booking.customer.name,
        customerAvatar: booking.customer.avatar,
        providerId: booking.providerId,
        providerName: booking.provider.name,
        rating: reviewRating,
        comment: reviewComment,
      });

      const updated = await bookingService.getBookingById(booking.id);
      setBooking(updated);
      showToast('Thank you! Your feedback has been published.', 'success', 'Review Submitted');
    } catch (err: any) {
      showToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Handle Booking Cancellation
  const handleCancelBooking = async () => {
    if (!cancellationReason.trim()) {
      showToast('Please specify a cancellation reason', 'warning');
      return;
    }
    setIsCancelling(true);
    try {
      const updated = await bookingService.cancelBooking(booking.id, cancellationReason, 'CUSTOMER');
      setBooking(updated);
      setIsCancelModalOpen(false);
      showToast('Booking cancelled successfully', 'info', 'Booking Cancelled');
    } catch (err: any) {
      showToast(err.message || 'Failed to cancel booking', 'error');
    } finally {
      setIsCancelling(false);
    }
  };

  const isCancellable = ['PENDING', 'ACCEPTED', 'SCHEDULED'].includes(booking.status);
  const costDifference = booking.finalCost ? booking.finalCost - booking.estimatedCost : 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/customer/bookings')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all bookings
        </button>

        {isCancellable && (
          <Button
            variant="danger"
            size="sm"
            onClick={() => setIsCancelModalOpen(true)}
          >
            Cancel Booking
          </Button>
        )}
      </div>

      {/* 1. Header Booking Identity */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-md">
              {booking.bookingNumber}
            </span>
            <span className="text-xs text-neutral-400">
              Placed on {new Date(booking.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 mt-1">
            {booking.serviceTitle}
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Category: <strong className="text-neutral-800">{booking.serviceCategory}</strong>
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-neutral-400 block uppercase font-medium">Total Cost</span>
          <span className="text-2xl font-black text-neutral-900">
            ₹{booking.finalCost || booking.estimatedCost}
          </span>
          <span className={`text-[10px] font-bold block uppercase mt-0.5 ${
            booking.paymentStatus === 'PAID' ? 'text-emerald-600' : 'text-amber-600'
          }`}>
            {booking.paymentStatus}
          </span>
        </div>
      </div>

      {/* 2. Visual Booking State Machine Timeline */}
      <BookingTimeline currentStatus={booking.status} booking={booking} />

      {/* 3. FINAL PRICE CONFIRMATION WORKFLOW (Requirement 14) */}
      {booking.finalCost && booking.finalCostReason && (
        <div className="bg-white rounded-3xl border-2 border-amber-300 p-6 shadow-card space-y-4">
          <div className="flex items-start justify-between gap-4 pb-3 border-b border-amber-100">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h3 className="font-bold text-base text-neutral-900">
                  Technician Inspection & Cost Revision
                </h3>
                <p className="text-xs text-neutral-500">
                  The service provider diagnosed your issue and proposed a final cost adjustment.
                </p>
              </div>
            </div>

            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              booking.finalCostStatus === 'ACCEPTED'
                ? 'bg-emerald-100 text-emerald-800'
                : booking.finalCostStatus === 'REJECTED'
                ? 'bg-rose-100 text-rose-800'
                : 'bg-amber-100 text-amber-900 animate-pulse'
            }`}>
              {booking.finalCostStatus === 'ACCEPTED'
                ? 'Cost Approved'
                : booking.finalCostStatus === 'REJECTED'
                ? 'Cost Rejected'
                : 'Awaiting Your Approval'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-xs">
            <div>
              <span className="text-neutral-400 block font-medium">Original Estimated Cost</span>
              <span className="text-base font-bold text-neutral-700">₹{booking.estimatedCost}</span>
            </div>
            <div>
              <span className="text-neutral-400 block font-medium">Final Inspected Cost</span>
              <span className="text-base font-extrabold text-neutral-900">₹{booking.finalCost}</span>
            </div>
            <div>
              <span className="text-neutral-400 block font-medium">Price Difference</span>
              <span className={`text-base font-bold ${costDifference >= 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                {costDifference >= 0 ? `+₹${costDifference}` : `-₹${Math.abs(costDifference)}`}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-xs">
            <span className="font-bold text-amber-900 block mb-1">Provider's Stated Reason:</span>
            <p className="text-neutral-700 leading-relaxed italic">
              "{booking.finalCostReason}"
            </p>
          </div>

          {booking.finalCostStatus === 'PENDING_APPROVAL' && (
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => handleRespondToFinalCost(false)}
                className="w-full sm:w-auto"
              >
                Reject / Contact Provider
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => handleRespondToFinalCost(true)}
                className="w-full sm:w-auto font-bold shadow-xs"
              >
                Accept Final Cost (₹{booking.finalCost})
              </Button>
            </div>
          )}
        </div>
      )}

      {/* 4. Service & Schedule Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Provider Details Card */}
        <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-subtle space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Assigned Service Provider
          </h3>
          <div className="flex items-center gap-3.5">
            <img
              src={booking.provider.avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'}
              alt={booking.provider.name}
              className="w-14 h-14 rounded-2xl object-cover border border-neutral-200"
            />
            <div>
              <h4 className="font-bold text-base text-neutral-900">{booking.provider.name}</h4>
              <p className="text-xs text-neutral-500">{booking.provider.primaryCategory || 'Technician'}</p>
              <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified Background Checked
              </span>
            </div>
          </div>
          <div className="space-y-1.5 pt-2 border-t border-neutral-100 text-xs text-neutral-600">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-neutral-400" />
              <span>{booking.provider.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-neutral-400" />
              <span>{booking.provider.email}</span>
            </div>
          </div>
        </div>

        {/* Appointment & Location Card */}
        <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-subtle space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary-600" />
            Appointment Details
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-neutral-400 block font-medium">Scheduled Date & Time</span>
                <span className="font-bold text-neutral-900 text-sm">
                  {booking.date} at {booking.time}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-neutral-400 block font-medium">Service Address</span>
                <span className="font-bold text-neutral-900 leading-snug">
                  {booking.address.street}, {booking.address.area}, {booking.address.city} - {booking.address.pincode}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 pt-2 border-t border-neutral-100">
              <FileText className="w-4 h-4 text-neutral-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-neutral-400 block font-medium">Problem Notes</span>
                <p className="text-neutral-700 italic mt-0.5">{booking.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. PAYMENT RECORDING SECTION (Requirement 15) */}
      <div id="payment" className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div>
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary-600" />
              Payment Settlement
            </h3>
            <p className="text-xs text-neutral-500">
              Direct settlement with provider recorded in-system for guarantee & warranty.
            </p>
          </div>
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full border ${
              booking.paymentStatus === 'PAID'
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
          >
            Status: {booking.paymentStatus}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80">
          <div>
            <span className="text-xs text-neutral-500 block uppercase font-medium">Payable Amount</span>
            <span className="text-2xl font-black text-neutral-900">
              ₹{booking.finalCost || booking.estimatedCost}
            </span>
            {booking.paidAt && (
              <span className="text-xs text-neutral-400 block mt-1">
                Settled on {new Date(booking.paidAt).toLocaleString()} ({booking.paymentMethod?.replace(/_/g, ' ')})
              </span>
            )}
          </div>

          {booking.paymentStatus === 'UNPAID' && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="primary"
                size="md"
                isLoading={isPaying}
                onClick={() => handleRecordPayment('CASH_RECORDED')}
                className="w-full sm:w-auto font-bold shadow-xs"
              >
                Mark as Paid (Cash / UPI)
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 6. REVIEW SYSTEM (Requirement 16) */}
      {(booking.status === 'COMPLETED' || booking.status === 'PAID' || booking.status === 'REVIEWED') && (
        <div id="review" className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-subtle space-y-4">
          <div className="pb-3 border-b border-neutral-100">
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              Service Review & Feedback
            </h3>
            <p className="text-xs text-neutral-500">
              Your feedback is verified and directly shapes the provider's public rating on ServiceHub.
            </p>
          </div>

          {booking.status === 'REVIEWED' ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Your review has been published
                </span>
                <span className="text-amber-500 font-bold text-sm">★★★★★</span>
              </div>
              <p className="text-xs text-neutral-700 italic">
                "Excellent service and professional behaviour."
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  How was your experience? (1 to 5 Stars)
                </label>
                <StarRating
                  rating={reviewRating}
                  interactive
                  size="lg"
                  onChange={(r) => setReviewRating(r)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Your Comments & Review <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share details regarding timeliness, technical skill, cleanliness, and communication..."
                  className="w-full text-xs sm:text-sm p-3.5 rounded-2xl border border-neutral-300 focus:border-primary-500 outline-none"
                />
              </div>

              <div className="text-right">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSubmittingReview}
                  className="font-bold shadow-xs"
                >
                  Submit Review
                </Button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Cancellation Modal */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Cancel Service Booking"
        subtitle={`Booking #${booking.bookingNumber}`}
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsCancelModalOpen(false)}>
              Keep Booking
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={isCancelling}
              onClick={handleCancelBooking}
            >
              Confirm Cancellation
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-xs text-neutral-600 leading-relaxed">
            Are you sure you want to cancel this booking with <strong>{booking.provider.name}</strong>?
          </p>
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Cancellation Reason <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder="e.g. Rescheduling with another technician, problem solved, travelling..."
              className="w-full text-xs p-3 rounded-xl border border-neutral-300 focus:border-rose-500 outline-none"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
