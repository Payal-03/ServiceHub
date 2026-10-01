import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Inbox,
  Filter,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  Search,
  Eye
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { providerService } from '../../services/api';
import { jobRequestService } from '../../services/jobRequestService';
import { Provider, JobRequest } from '../../types';
import { JobRequestCard } from '../../components/cards/JobRequestCard';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

export const ProviderRequestsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [provider, setProvider] = useState<Provider | null>(null);
  const [requests, setRequests] = useState<JobRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocality, setSelectedLocality] = useState('ALL');
  const [activeTab, setActiveTab] = useState<'available' | 'interested' | 'all'>('available');

  // Modal
  const [activeRequest, setActiveRequest] = useState<JobRequest | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
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
    loadData();
  }, []);

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
      setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      if (activeRequest?.id === updated.id) setActiveRequest(updated);
      showToast(`Interest submitted for #${req.requestNumber}!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to express interest', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWithdrawInterest = async (req: JobRequest) => {
    if (!provider) return;
    setIsProcessing(true);
    try {
      const updated = await jobRequestService.withdrawInterest(req.id, provider.id);
      setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      if (activeRequest?.id === updated.id) setActiveRequest(updated);
      showToast(`Interest withdrawn from #${req.requestNumber}`, 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to withdraw', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const isInterested = r.interestedProviders.some((p) => p.providerId === 'prov-1');

      if (activeTab === 'available' && isInterested) return false;
      if (activeTab === 'interested' && !isInterested) return false;

      if (selectedLocality !== 'ALL' && !r.locality.toLowerCase().includes(selectedLocality.toLowerCase())) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.serviceType.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.locality.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [requests, activeTab, selectedLocality, searchQuery]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
            Available Job Requests
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Discover service needs posted by customers in your coverage areas and express interest.
          </p>
        </div>

        {/* Tab pills */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'available' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500'
            }`}
          >
            New Needs ({requests.filter((r) => !r.interestedProviders.some((p) => p.providerId === 'prov-1')).length})
          </button>
          <button
            onClick={() => setActiveTab('interested')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'interested' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500'
            }`}
          >
            My Bids ({requests.filter((r) => r.interestedProviders.some((p) => p.providerId === 'prov-1')).length})
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-3 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by problem, service, or locality..."
            className="w-full text-xs pl-10 pr-3 py-2 rounded-xl border border-neutral-200 focus:border-primary-500 outline-none"
          />
        </div>

        <select
          value={selectedLocality}
          onChange={(e) => setSelectedLocality(e.target.value)}
          className="text-xs border border-neutral-200 rounded-xl px-3 py-2 font-medium text-neutral-700 outline-none w-full sm:w-auto bg-white"
        >
          <option value="ALL">All Localities</option>
          <option value="Krishna Nagar">Krishna Nagar</option>
          <option value="BSA College">BSA College Road</option>
          <option value="Vrindavan">Vrindavan</option>
        </select>
      </div>

      {/* Requests Feed */}
      {isLoading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white rounded-3xl border border-neutral-200/90 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-neutral-900">No requests match your filter</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Try adjusting your search query or switching tabs.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRequests.map((req) => {
            const isInterested = req.interestedProviders.some((p) => p.providerId === 'prov-1');
            return (
              <JobRequestCard
                key={req.id}
                request={req}
                currentUserId="prov-1"
                userRole="PROVIDER"
                isInterested={isInterested}
                onViewDetails={(r) => {
                  setActiveRequest(r);
                  setModalOpen(true);
                }}
                onExpressInterest={handleExpressInterest}
                onWithdrawInterest={handleWithdrawInterest}
              />
            );
          })}
        </div>
      )}

      {/* Modal */}
      {activeRequest && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={`Job Request: ${activeRequest.serviceType}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/70 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-neutral-900">{activeRequest.serviceCategory}</span>
                <span className="text-neutral-400 font-mono">#{activeRequest.requestNumber}</span>
              </div>
              <div className="text-neutral-600 space-y-1">
                <p>
                  <strong>Location:</strong> {activeRequest.locality}, {activeRequest.city} ({activeRequest.pincode})
                </p>
                <p>
                  <strong>Preferred Time:</strong> {activeRequest.preferredDate} at {activeRequest.preferredTime}
                </p>
                <p>
                  <strong>Customer Budget:</strong> ₹{activeRequest.budget} (Est: ₹{activeRequest.estimatedMin}–₹{activeRequest.estimatedMax})
                </p>
              </div>
            </div>

            <div>
              <span className="font-bold text-neutral-700 block mb-1">Problem Description:</span>
              <p className="p-3 rounded-xl bg-neutral-50 text-neutral-700 leading-relaxed">
                "{activeRequest.description}"
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
              <Button size="sm" variant="outline" onClick={() => setModalOpen(false)}>
                Close
              </Button>
              {activeRequest.interestedProviders.some((p) => p.providerId === 'prov-1') ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    handleWithdrawInterest(activeRequest);
                    setModalOpen(false);
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
                    handleExpressInterest(activeRequest);
                    setModalOpen(false);
                  }}
                >
                  Express Interest
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
