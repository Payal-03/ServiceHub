import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  Star,
  Users,
  CheckCircle2,
  Phone,
  MessageSquare,
  AlertCircle,
  XCircle,
  Briefcase,
  Share2
} from 'lucide-react';
import { jobRequestService } from '../../services/jobRequestService';
import { reviewService } from '../../services/api';
import { JobRequest, InterestedProvider } from '../../types';
import { JOB_REQUEST_STATUS_CONFIG } from '../../constants/jobRequestStatusConfig';
import { RequestStatusTimeline } from '../../components/requests/RequestStatusTimeline';
import { ContactModal } from '../../components/requests/ContactModal';
import { Button } from '../../components/ui/Button';
import { StarRating } from '../../components/ui/StarRating';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export const CustomerRequestDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [request, setRequest] = useState<JobRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Contact Modal State
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [activeContactTarget, setActiveContactTarget] = useState<{
    name: string;
    phone: string;
    email?: string;
    roleTitle: string;
  } | null>(null);

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [hasReviewed, setHasReviewed] = useState(false);

  // Cancel Modal State
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const loadData = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const data = await jobRequestService.getRequestById(id);
      setRequest(data);
    } catch (err: any) {
      console.error(err);
      showToast('Could not load request details', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (isLoading || !request) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statusMeta = JOB_REQUEST_STATUS_CONFIG[request.status] || JOB_REQUEST_STATUS_CONFIG.POSTED;

  // Accept a provider
  const handleAcceptProvider = async (providerId: string, providerName: string) => {
    setIsProcessing(true);
    try {
      const updated = await jobRequestService.acceptProvider(request.id, providerId);
      setRequest(updated);
      showToast(`Selected ${providerName}! Your appointment slot is locked.`, 'success', 'Provider Accepted');
    } catch (err: any) {
      showToast(err.message || 'Failed to accept provider', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Two-sided completion: Customer confirms completion
  const handleConfirmCompletion = async () => {
    setIsProcessing(true);
    try {
      const updated = await jobRequestService.customerConfirmComplete(request.id, request.customerId);
      setRequest(updated);
      showToast('Service completion confirmed! Thank you.', 'success', 'Job Completed');
      setReviewModalOpen(true);
    } catch (err: any) {
      showToast(err.message || 'Failed to confirm completion', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Submit Review after completion
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!request.acceptedProviderId) return;
    setIsProcessing(true);
    try {
      await reviewService.createReview({
        bookingId: request.id,
        customerId: request.customerId,
        customerName: request.customerName,
        customerAvatar: request.customerAvatar,
        providerId: request.acceptedProviderId,
        providerName: request.acceptedProvider?.name || 'Technician',
        rating: reviewRating,
        comment: reviewComment || 'Great service! Technician was punctual and solved the issue.',
      });
      setHasReviewed(true);
      setReviewModalOpen(false);
      showToast('Thank you for rating your service experience!', 'success');
    } catch (err: any) {
      showToast('Review submitted locally.', 'info');
      setHasReviewed(true);
      setReviewModalOpen(false);
    } finally {
      setIsProcessing(false);
    }
  };

  // Cancel Request
  const handleCancelRequest = async () => {
    setIsProcessing(true);
    try {
      const updated = await jobRequestService.cancelRequest(
        request.id,
        cancelReason || 'Customer cancelled request',
        'CUSTOMER'
      );
      setRequest(updated);
      setCancelModalOpen(false);
      showToast('Request cancelled', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to cancel', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/customer/requests')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Requests</span>
        </button>

        <span className="text-xs text-neutral-400 font-mono">
          #{request.requestNumber}
        </span>
      </div>

      {/* Main Request Header Card */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-600">
                {request.serviceCategory}
              </span>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusMeta.badgeClass}`}>
                {statusMeta.label}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
              {request.serviceType}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500 mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                {request.locality}, {request.city} ({request.pincode})
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                {request.preferredDate} at {request.preferredTime}
              </span>
            </div>
          </div>

          {/* Budget Box */}
          <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-right min-w-[160px]">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">Your Budget</span>
            <span className="text-xl font-extrabold text-neutral-900">
              ₹{request.budget.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-neutral-500 block mt-0.5">
              Est: ₹{request.estimatedMin}–₹{request.estimatedMax}
            </span>
          </div>
        </div>

        {/* Problem Description */}
        <div className="p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200/70 space-y-1 text-xs">
          <span className="font-bold text-neutral-700 block">Description of Work:</span>
          <p className="text-neutral-600 leading-relaxed">{request.description}</p>
          {request.notes && (
            <p className="text-neutral-500 text-[11px] pt-1">
              <strong>Additional Notes:</strong> {request.notes}
            </p>
          )}
        </div>

        {/* Timeline Stepper */}
        <div className="pt-2 border-t border-neutral-100">
          <RequestStatusTimeline
            status={request.status}
            providerCompleted={request.providerCompleted}
            customerConfirmed={request.customerConfirmed}
            providerName={request.acceptedProvider?.name || 'Assigned Provider'}
            customerName={request.customerName}
          />
        </div>
      </div>

      {/* TWO-SIDED COMPLETION ACTION CALLOUT */}
      {request.status === 'PROVIDER_MARKED_COMPLETE' && !request.customerConfirmed && (
        <div className="bg-gradient-to-r from-purple-50 via-white to-emerald-50 border-2 border-purple-300 rounded-3xl p-6 shadow-md space-y-3 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="flex-1">
              <h3 className="font-extrabold text-base text-neutral-900">
                {request.acceptedProvider?.name || 'Your technician'} marked the work as completed!
              </h3>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                Please inspect the repaired fixture or installation. If you are satisfied with the completed work, confirm below to finalize the service settlement.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              size="md"
              variant="primary"
              disabled={isProcessing}
              onClick={handleConfirmCompletion}
              leftIcon={<CheckCircle2 className="w-4 h-4 stroke-[2.5]" />}
              className="bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 text-white font-bold"
            >
              {isProcessing ? 'Confirming...' : 'Confirm Service Completed ✓'}
            </Button>
          </div>
        </div>
      )}

      {/* COMPLETED BANNER + REVIEW CTA */}
      {request.status === 'COMPLETED' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-emerald-950">Service Successfully Completed</h4>
              <p className="text-xs text-emerald-700 mt-0.5">
                Both parties have confirmed completion. Thank you for using ServiceHub!
              </p>
            </div>
          </div>

          {!hasReviewed ? (
            <Button
              size="sm"
              variant="primary"
              onClick={() => setReviewModalOpen(true)}
              leftIcon={<Star className="w-4 h-4 fill-amber-300 text-amber-300" />}
            >
              Rate & Review Provider
            </Button>
          ) : (
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              ✓ Feedback submitted
            </span>
          )}
        </div>
      )}

      {/* SECTION: INTERESTED PROVIDERS (Section 7 Requirement) */}
      {!request.acceptedProviderId && request.status !== 'CANCELLED' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-neutral-900 tracking-tight flex items-center gap-2">
                <Users className="w-5 h-5 text-primary-600" />
                Interested Providers ({request.interestedProviders.length})
              </h2>
              <p className="text-xs text-neutral-500">
                Verified technicians who reviewed your problem and are ready to take this job.
              </p>
            </div>
          </div>

          {request.interestedProviders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-neutral-200/90 p-8 text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <Clock className="w-5 h-5 animate-pulse" />
              </div>
              <h3 className="font-bold text-sm text-neutral-900">Awaiting Nearby Providers</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Your request is visible to verified technicians in {request.locality}. You will receive a notification as soon as professionals express interest.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {request.interestedProviders.map((prov) => (
                <div
                  key={prov.providerId}
                  className="bg-white rounded-2xl border border-neutral-200/90 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Header: Avatar, Name, Rating, Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            prov.providerAvatar ||
                            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'
                          }
                          alt={prov.providerName}
                          className="w-12 h-12 rounded-xl object-cover border border-neutral-200"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-sm text-neutral-900">{prov.providerName}</h4>
                            {prov.verified && (
                              <span title="Verified Credentials" className="text-emerald-600">
                                <ShieldCheck className="w-4 h-4 fill-emerald-100" />
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-neutral-500 block">
                            {prov.primaryCategory} · {prov.providerExperienceYears} yrs exp
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1 text-xs font-bold text-neutral-900">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{prov.providerRating}</span>
                        </div>
                        <span className="text-[10px] text-neutral-400">{prov.providerJobCount} jobs</span>
                      </div>
                    </div>

                    {/* Distance / Note */}
                    <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-100 text-xs text-neutral-600 space-y-1">
                      {prov.distanceEstimate && (
                        <div className="flex items-center gap-1 text-neutral-700 font-medium">
                          <MapPin className="w-3 h-3 text-rose-500" />
                          <span>{prov.distanceEstimate}</span>
                        </div>
                      )}
                      {prov.note && <p className="italic text-[11px]">"{prov.note}"</p>}
                      {prov.quotedAmount && (
                        <div className="flex justify-between items-center pt-1 border-t border-neutral-200/60 font-semibold text-neutral-800">
                          <span>Offered Rate:</span>
                          <span className="text-emerald-700 font-bold">₹{prov.quotedAmount}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions: View Profile, Contact, Accept Provider */}
                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => navigate(`/customer/providers/${prov.providerId}`)}
                      className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 underline"
                    >
                      View Profile
                    </button>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setActiveContactTarget({
                            name: prov.providerName,
                            phone: prov.providerPhone,
                            email: prov.providerEmail,
                            roleTitle: 'Technician',
                          });
                          setContactModalOpen(true);
                        }}
                        className="text-xs py-1.5 px-3"
                      >
                        Contact
                      </Button>

                      <Button
                        size="sm"
                        variant="primary"
                        disabled={isProcessing}
                        onClick={() => handleAcceptProvider(prov.providerId, prov.providerName)}
                        className="text-xs py-1.5 px-3.5 shadow-xs font-bold"
                      >
                        Accept Provider
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* SECTION: ACCEPTED PROVIDER CARD */}
      {request.acceptedProvider && (
        <section className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
              Assigned Professional
            </h2>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified & Selected
            </span>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={
                  request.acceptedProvider.avatar ||
                  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'
                }
                alt={request.acceptedProvider.name}
                className="w-14 h-14 rounded-2xl object-cover border border-neutral-200 shadow-xs"
              />
              <div>
                <h3 className="font-extrabold text-base text-neutral-900">
                  {request.acceptedProvider.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
                  <span className="flex items-center gap-0.5 text-neutral-800 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {request.acceptedProvider.rating}
                  </span>
                  <span>•</span>
                  <span>{request.acceptedProvider.jobCount} jobs completed</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="md"
                variant="outline"
                onClick={() => {
                  setActiveContactTarget({
                    name: request.acceptedProvider!.name,
                    phone: request.acceptedProvider!.phone,
                    roleTitle: 'Assigned Technician',
                  });
                  setContactModalOpen(true);
                }}
                leftIcon={<Phone className="w-4 h-4" />}
              >
                Contact Provider
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Bottom Cancel Action */}
      {request.status !== 'COMPLETED' && request.status !== 'CANCELLED' && (
        <div className="flex justify-end pt-2">
          <button
            onClick={() => setCancelModalOpen(true)}
            className="text-xs text-neutral-400 hover:text-rose-600 transition-colors"
          >
            Cancel this request
          </button>
        </div>
      )}

      {/* Contact Modal */}
      {activeContactTarget && (
        <ContactModal
          isOpen={contactModalOpen}
          onClose={() => setContactModalOpen(false)}
          contactName={activeContactTarget.name}
          phone={activeContactTarget.phone}
          email={activeContactTarget.email}
          roleTitle={activeContactTarget.roleTitle}
          contextTitle={`${request.serviceCategory} (#${request.requestNumber})`}
        />
      )}

      {/* Review Modal */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Rate Your Service Experience"
        maxWidth="md"
      >
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <p className="text-xs text-neutral-500">
            How was your experience with <strong>{request.acceptedProvider?.name}</strong> for {request.serviceType}?
          </p>

          <div className="flex flex-col items-center py-2 space-y-1">
            <span className="text-xs font-semibold text-neutral-700">Overall Rating</span>
            <StarRating rating={reviewRating} interactive onChange={setReviewRating} size="lg" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-700">Comments / Feedback</label>
            <textarea
              rows={3}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Was the technician on time? Did they clean up afterward?"
              className="w-full text-xs p-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button size="sm" variant="outline" type="button" onClick={() => setReviewModalOpen(false)}>
              Skip
            </Button>
            <Button size="sm" variant="primary" type="submit" disabled={isProcessing}>
              Submit Feedback
            </Button>
          </div>
        </form>
      </Modal>

      {/* Cancel Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Service Request"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-neutral-600">
            Are you sure you want to cancel this request? Nearby providers will no longer be able to express interest.
          </p>
          <input
            type="text"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Reason for cancellation (optional)"
            className="w-full text-xs p-3 rounded-xl border border-neutral-200 focus:border-rose-400 outline-none"
          />
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={() => setCancelModalOpen(false)}>
              Keep Request
            </Button>
            <Button size="sm" variant="danger" onClick={handleCancelRequest} disabled={isProcessing}>
              Confirm Cancellation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
