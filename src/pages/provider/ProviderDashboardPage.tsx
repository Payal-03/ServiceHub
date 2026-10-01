import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Inbox,
  Clock,
  TrendingUp,
  Star,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Calendar,
  Filter,
  ShieldCheck,
  Briefcase,
  AlertCircle,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { providerService } from '../../services/api';
import { jobRequestService } from '../../services/jobRequestService';
import { Provider, JobRequest } from '../../types';
import { JobRequestCard } from '../../components/cards/JobRequestCard';
import { RequestStatusTimeline } from '../../components/requests/RequestStatusTimeline';
import { ContactModal } from '../../components/requests/ContactModal';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { DashboardSkeleton } from '../../components/common/Skeletons';

export const ProviderDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [provider, setProvider] = useState<Provider | null>(null);
  const [requests, setRequests] = useState<JobRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Filters & Sorting for Provider
  const [selectedArea, setSelectedArea] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'budget_desc'>('newest');

  // Request Details Modal
  const [selectedRequest, setSelectedRequest] = useState<JobRequest | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Contact Modal
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactTarget, setContactTarget] = useState<{ name: string; phone: string; email?: string } | null>(null);

  const loadProviderData = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      // Provider profile: user-prov-1 maps to prov-1
      const provData = await providerService.getProviderById('prov-1');
      setProvider(provData);

      const available = await jobRequestService.getAvailableRequestsForProvider('prov-1');
      setRequests(available);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProviderData();
  }, [user]);

  // Express interest in a request
  const handleExpressInterest = async (req: JobRequest) => {
    if (!provider) return;
    setIsProcessing(true);
    try {
      const updated = await jobRequestService.expressInterest(req.id, {
        providerId: provider.id,
        providerName: provider.name,
        providerPhone: provider.phone,
        providerEmail: provider.email,
        providerAvatar: provider.avatar,
        providerRating: provider.rating,
        providerJobCount: provider.jobCount,
        providerExperienceYears: provider.experienceYears,
        verified: provider.verified,
        primaryCategory: provider.primaryCategory,
        expressedAt: new Date().toISOString(),
        quotedAmount: req.budget,
        distanceEstimate: 'Nearby in your coverage area',
      });
      // update state
      setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      if (selectedRequest?.id === updated.id) {
        setSelectedRequest(updated);
      }
      showToast(`Interest submitted for ${req.serviceType}! Customer notified.`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to express interest', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Withdraw interest
  const handleWithdrawInterest = async (req: JobRequest) => {
    if (!provider) return;
    setIsProcessing(true);
    try {
      const updated = await jobRequestService.withdrawInterest(req.id, provider.id);
      setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      if (selectedRequest?.id === updated.id) {
        setSelectedRequest(updated);
      }
      showToast(`Interest withdrawn from request #${req.requestNumber}`, 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to withdraw', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Two-sided completion: Provider marks work complete
  const handleProviderMarkComplete = async (requestId: string) => {
    if (!provider) return;
    setIsProcessing(true);
    try {
      const updated = await jobRequestService.providerMarkComplete(requestId, provider.id);
      setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      if (selectedRequest?.id === updated.id) {
        setSelectedRequest(updated);
      }
      showToast('Work marked complete! Awaiting customer verification.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update status', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Open Details Modal
  const handleOpenDetails = (req: JobRequest) => {
    setSelectedRequest(req);
    setDetailsModalOpen(true);
  };

  // Filter & sort
  const availableRequests = useMemo(() => {
    let list = requests.filter(
      (r) =>
        r.status === 'POSTED' ||
        (r.status === 'PROVIDER_INTERESTED' && !r.acceptedProviderId)
    );

    if (selectedArea !== 'ALL') {
      list = list.filter((r) => r.locality.toLowerCase().includes(selectedArea.toLowerCase()));
    }

    if (sortBy === 'budget_desc') {
      list.sort((a, b) => b.budget - a.budget);
    } else {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return list;
  }, [requests, selectedArea, sortBy]);

  // Active jobs accepted by this provider
  const myActiveJobs = useMemo(() => {
    return requests.filter(
      (r) =>
        r.acceptedProviderId === 'prov-1' &&
        (r.status === 'PROVIDER_ACCEPTED' ||
          r.status === 'IN_PROGRESS' ||
          r.status === 'PROVIDER_MARKED_COMPLETE' ||
          r.status === 'CUSTOMER_CONFIRMED_COMPLETE')
    );
  }, [requests]);

  if (isLoading || !provider) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-7 max-w-5xl mx-auto">
      {/* 1. PROVIDER HEADER WITH DISPATCH SUMMARY */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-primary-950 text-white rounded-3xl p-6 sm:p-8 shadow-card relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-primary-400 tracking-wider uppercase">
              Partner Operational Portal
            </span>
            {provider.verified && (
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-500/30">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Verified Partner
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Good morning, {provider.name.split(' ')[0]} 🛠️
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            There are <strong className="text-white">{availableRequests.length} available job requests</strong> in your service areas for <strong className="text-white">{provider.primaryCategory}</strong>.
          </p>
        </div>

        {/* Quick KPI Strip */}
        <div className="mt-6 pt-4 border-t border-neutral-700/60 grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10 text-xs">
          <div>
            <span className="text-neutral-400 text-[10px] uppercase font-bold block">Available Jobs</span>
            <span className="text-xl font-extrabold text-white">{availableRequests.length}</span>
          </div>
          <div>
            <span className="text-neutral-400 text-[10px] uppercase font-bold block">Active Jobs</span>
            <span className="text-xl font-extrabold text-primary-300">{myActiveJobs.length}</span>
          </div>
          <div>
            <span className="text-neutral-400 text-[10px] uppercase font-bold block">Rating</span>
            <span className="text-xl font-extrabold text-amber-400 flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400" />
              {provider.rating}
            </span>
          </div>
          <div>
            <span className="text-neutral-400 text-[10px] uppercase font-bold block">Jobs Completed</span>
            <span className="text-xl font-extrabold text-emerald-400">{provider.jobCount}</span>
          </div>
        </div>
      </div>

      {/* 2. MY ACTIVE ACCEPTED JOBS (IF ANY) */}
      {myActiveJobs.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-neutral-900 tracking-tight flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary-600" />
                My Active Jobs ({myActiveJobs.length})
              </h2>
              <p className="text-xs text-neutral-500">
                Jobs where customer selected you. Mark work complete once physical service is done.
              </p>
            </div>
            <Link
              to="/provider/bookings"
              className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              All Bookings <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {myActiveJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-neutral-200/90 p-5 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-2 py-0.5 rounded-md border border-primary-100">
                      {job.serviceCategory}
                    </span>
                    <h3 className="font-bold text-base text-neutral-900 mt-1">
                      {job.serviceType}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-neutral-500 mt-0.5">
                      <span className="flex items-center gap-1 text-neutral-700 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        {job.locality}, {job.city}
                      </span>
                      <span>•</span>
                      <span>Scheduled: {job.preferredDate} at {job.preferredTime}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setContactTarget({
                          name: job.customerName,
                          phone: job.customerPhone,
                          email: job.customerEmail,
                        });
                        setContactModalOpen(true);
                      }}
                    >
                      Contact Customer
                    </Button>

                    {!job.providerCompleted ? (
                      <Button
                        size="sm"
                        variant="primary"
                        disabled={isProcessing}
                        onClick={() => handleProviderMarkComplete(job.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 font-bold"
                      >
                        Mark Job Complete ✓
                      </Button>
                    ) : (
                      <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
                        Marked Done ✓ (Awaiting Customer)
                      </span>
                    )}
                  </div>
                </div>

                <RequestStatusTimeline
                  status={job.status}
                  providerCompleted={job.providerCompleted}
                  customerConfirmed={job.customerConfirmed}
                  providerName="You"
                  customerName={job.customerName}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. AVAILABLE JOB REQUESTS FEED (Section 5 & 15) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-neutral-200/80">
          <div>
            <h2 className="text-lg font-extrabold text-neutral-900 tracking-tight flex items-center gap-2">
              <Inbox className="w-5 h-5 text-primary-600" />
              Available Job Requests
            </h2>
            <p className="text-xs text-neutral-500">
              Nearby customer requests matching your category and service territories.
            </p>
          </div>

          {/* Simple Filters for Provider */}
          <div className="flex items-center gap-2 text-xs">
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="bg-white border border-neutral-200 rounded-xl px-3 py-1.5 font-medium text-neutral-700 outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="ALL">All Territories</option>
              <option value="Krishna Nagar">Krishna Nagar</option>
              <option value="BSA College">BSA College Road</option>
              <option value="Vrindavan">Vrindavan</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-neutral-200 rounded-xl px-3 py-1.5 font-medium text-neutral-700 outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="newest">Newest First</option>
              <option value="budget_desc">Highest Budget</option>
            </select>
          </div>
        </div>

        {availableRequests.length === 0 ? (
          <div className="bg-white rounded-3xl border border-neutral-200/90 p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-neutral-900">No new requests in this area</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Check back shortly or expand your coverage areas in your provider profile settings.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableRequests.map((req) => {
              const isInterested = req.interestedProviders.some(
                (p) => p.providerId === provider.id
              );
              return (
                <JobRequestCard
                  key={req.id}
                  request={req}
                  currentUserId={provider.id}
                  userRole="PROVIDER"
                  isInterested={isInterested}
                  onViewDetails={handleOpenDetails}
                  onExpressInterest={handleExpressInterest}
                  onWithdrawInterest={handleWithdrawInterest}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* REQUEST DETAILS MODAL */}
      {selectedRequest && (
        <Modal
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          title={`Job Request: ${selectedRequest.serviceType}`}
          maxWidth="lg"
        >
          <div className="space-y-5">
            {/* Header info */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary-700 uppercase tracking-wider">
                  {selectedRequest.serviceCategory}
                </span>
                <span className="text-xs font-mono text-neutral-400">
                  #{selectedRequest.requestNumber}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-neutral-400 text-[10px] uppercase font-bold block">Location</span>
                  <span className="font-semibold text-neutral-900 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    {selectedRequest.locality}, {selectedRequest.city} ({selectedRequest.pincode})
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 text-[10px] uppercase font-bold block">Preferred Slot</span>
                  <span className="font-semibold text-neutral-900 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    {selectedRequest.preferredDate} at {selectedRequest.preferredTime}
                  </span>
                </div>
              </div>
            </div>

            {/* Problem Description */}
            <div className="space-y-1.5 text-xs">
              <span className="font-bold text-neutral-700 block">Customer Problem Description:</span>
              <p className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-100 text-neutral-700 leading-relaxed">
                "{selectedRequest.description}"
              </p>
              {selectedRequest.notes && (
                <p className="text-neutral-500 text-[11px] pt-1">
                  <strong>Notes:</strong> {selectedRequest.notes}
                </p>
              )}
            </div>

            {/* Financial Overview */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/70 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Customer Budget</span>
                <span className="font-extrabold text-neutral-900 text-base">
                  ₹{selectedRequest.budget}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Estimated Benchmark</span>
                <span className="font-semibold text-neutral-700 text-sm">
                  ₹{selectedRequest.estimatedMin}–₹{selectedRequest.estimatedMax}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-3">
              <Button size="sm" variant="outline" onClick={() => setDetailsModalOpen(false)}>
                Close
              </Button>

              <div className="flex items-center gap-2">
                {selectedRequest.interestedProviders.some((p) => p.providerId === provider.id) ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      handleWithdrawInterest(selectedRequest);
                      setDetailsModalOpen(false);
                    }}
                    className="text-rose-600 border-rose-200 hover:bg-rose-50"
                  >
                    Withdraw Interest
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="primary"
                    disabled={isProcessing}
                    onClick={() => {
                      handleExpressInterest(selectedRequest);
                      setDetailsModalOpen(false);
                    }}
                    className="shadow-xs font-bold"
                  >
                    Express Interest
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* CONTACT MODAL */}
      {contactTarget && (
        <ContactModal
          isOpen={contactModalOpen}
          onClose={() => setContactModalOpen(false)}
          contactName={contactTarget.name}
          phone={contactTarget.phone}
          email={contactTarget.email}
          roleTitle="Customer"
          contextTitle="Assigned Service Job"
        />
      )}
    </div>
  );
};
