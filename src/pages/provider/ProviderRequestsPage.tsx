import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Inbox,
  Clock,
  Calendar,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  User,
  ArrowRight
} from 'lucide-react';
import { bookingService } from '../../services/api';
import { Booking } from '../../types';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';

export const ProviderRequestsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [requests, setRequests] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Rejection modal
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [activeRequest, setActiveRequest] = useState<Booking | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const loadRequests = async () => {
    try {
      setIsLoading(true);
      const all = await bookingService.getBookings('PROVIDER', 'prov-1');
      setRequests(all.filter((b) => b.status === 'PENDING'));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAccept = async (booking: Booking) => {
    setIsProcessing(true);
    try {
      await bookingService.updateStatus(booking.id, 'ACCEPTED', 'Provider accepted booking request.');
      showToast(`Booking #${booking.bookingNumber} accepted! Scheduled on your calendar.`, 'success', 'Request Accepted');
      await loadRequests();
    } catch (err: any) {
      showToast(err.message || 'Failed to accept request', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!activeRequest) return;
    setIsProcessing(true);
    try {
      await bookingService.cancelBooking(
        activeRequest.id,
        rejectReason || 'Provider currently unavailable for requested slot',
        'PROVIDER'
      );
      showToast(`Request #${activeRequest.bookingNumber} rejected`, 'info');
      setRejectModalOpen(false);
      setActiveRequest(null);
      setRejectReason('');
      await loadRequests();
    } catch (err: any) {
      showToast(err.message || 'Failed to reject request', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-subtle flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
            Incoming Service Requests
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Review customer requests and accept or decline based on your availability.
          </p>
        </div>
        <span className="text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full">
          {requests.length} Pending
        </span>
      </div>

      {isLoading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : requests.length === 0 ? (
        <EmptyState
          title="No pending requests"
          description="When new customers in your service area request an appointment, they will show up here."
          icon={Inbox}
        />
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-card space-y-4"
            >
              {/* Top details */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase">
                    {req.bookingNumber}
                  </span>
                  <h3 className="text-base font-bold text-neutral-900 mt-0.5">{req.serviceTitle}</h3>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-neutral-400 block uppercase font-medium">
                    Estimated Base Pay
                  </span>
                  <span className="text-xl font-black text-neutral-900">₹{req.estimatedCost}</span>
                </div>
              </div>

              {/* Grid with customer, problem, slot, area */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1">
                  <span className="text-neutral-400 block font-medium">Customer</span>
                  <p className="font-bold text-neutral-900 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-neutral-500" />
                    {req.customer.name}
                  </p>
                  <p className="text-neutral-500 text-[11px]">{req.customer.phone}</p>
                </div>

                <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1">
                  <span className="text-neutral-400 block font-medium">Requested Time</span>
                  <p className="font-bold text-neutral-900 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary-600" />
                    {req.date}
                  </p>
                  <p className="text-neutral-500 text-[11px]">Slot: {req.time}</p>
                </div>

                <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1">
                  <span className="text-neutral-400 block font-medium">Location</span>
                  <p className="font-bold text-neutral-900 flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    {req.address.area}, {req.address.city}
                  </p>
                  <p className="text-neutral-500 text-[11px]">Pin: {req.address.pincode}</p>
                </div>
              </div>

              {/* Problem Description */}
              <div className="p-3.5 rounded-2xl bg-primary-50/40 border border-primary-100/60 text-xs">
                <span className="font-bold text-primary-900 block mb-0.5">Problem Reported:</span>
                <p className="text-neutral-700 leading-relaxed italic">
                  "{req.description}"
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setActiveRequest(req);
                    setRejectModalOpen(true);
                  }}
                  className="text-neutral-600"
                >
                  Decline Request
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  isLoading={isProcessing}
                  onClick={() => handleAccept(req)}
                  className="font-bold shadow-xs"
                >
                  Accept & Schedule
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Why are you rejecting this request?"
        subtitle={`Booking #${activeRequest?.bookingNumber}`}
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setRejectModalOpen(false)}>
              Back
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={isProcessing}
              onClick={handleConfirmReject}
            >
              Confirm Decline
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-neutral-700">
            Decline Reason (Optional)
          </label>
          <select
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="w-full text-xs p-2.5 rounded-xl border border-neutral-300 focus:border-primary-500 outline-none bg-white mb-2"
          >
            <option value="">Select a common reason...</option>
            <option value="Schedule fully booked for this time slot">
              Schedule fully booked for this time slot
            </option>
            <option value="Outside my active travel jurisdiction today">
              Outside my active travel jurisdiction today
            </option>
            <option value="Specialized parts required are temporarily unavailable">
              Specialized parts required are temporarily unavailable
            </option>
            <option value="Personal / emergency unavailability">
              Personal / emergency unavailability
            </option>
          </select>
          <textarea
            rows={2}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Or type specific notes to notify customer..."
            className="w-full text-xs p-3 rounded-xl border border-neutral-300 focus:border-primary-500 outline-none"
          />
        </div>
      </Modal>
    </div>
  );
};
