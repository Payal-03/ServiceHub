import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, AlertCircle, Phone, Mail, MapPin, Briefcase } from 'lucide-react';
import { providerService } from '../../services/api';
import { Provider } from '../../types';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';

export const AdminProviderVerificationPage: React.FC = () => {
  const { showToast } = useToast();

  const [providers, setProviders] = useState<Provider[]>([]);
  const [activeTab, setActiveTab] = useState<'PENDING' | 'VERIFIED' | 'REJECTED'>('PENDING');
  const [isLoading, setIsLoading] = useState(true);

  // Reject modal
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const list = await providerService.getAllProvidersForAdmin();
      setProviders(list);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleVerify = async (provider: Provider) => {
    setIsProcessing(true);
    try {
      await providerService.verifyProvider(provider.id, true);
      showToast(`${provider.name} is now verified with the official trust badge.`, 'success', 'Provider Verified');
      await loadData();
    } catch (err: any) {
      showToast(err.message || 'Verification failed', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!selectedProvider) return;
    if (!rejectionReason.trim()) {
      showToast('Please state a reason for rejecting the verification request', 'warning');
      return;
    }
    setIsProcessing(true);
    try {
      await providerService.verifyProvider(selectedProvider.id, false, rejectionReason);
      showToast(`Verification for ${selectedProvider.name} rejected.`, 'info');
      setRejectModalOpen(false);
      setSelectedProvider(null);
      setRejectionReason('');
      await loadData();
    } catch (err: any) {
      showToast(err.message || 'Action failed', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredProviders = providers.filter((p) => {
    if (activeTab === 'PENDING') return p.verificationStatus === 'PENDING';
    if (activeTab === 'VERIFIED') return p.verificationStatus === 'VERIFIED';
    if (activeTab === 'REJECTED') return p.verificationStatus === 'REJECTED';
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
            Provider Quality & Credential Verification
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Screen identity credentials before allowing service providers to appear in customer searches.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        {(
          [
            { key: 'PENDING', label: 'Pending Review' },
            { key: 'VERIFIED', label: 'Verified Partners' },
            { key: 'REJECTED', label: 'Rejected' },
          ] as const
        ).map((t) => {
          const count = providers.filter((p) => p.verificationStatus === t.key).length;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === t.key
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200/80'
              }`}
            >
              <span>{t.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === t.key ? 'bg-neutral-700 text-white' : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Providers List */}
      {filteredProviders.length === 0 ? (
        <EmptyState
          title={`No ${activeTab.toLowerCase()} providers`}
          description={`There are currently no provider applications marked as ${activeTab.toLowerCase()}.`}
          icon={ShieldCheck}
        />
      ) : (
        <div className="space-y-4">
          {filteredProviders.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4 flex-1">
                <img
                  src={p.avatar}
                  alt={p.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-neutral-200 flex-shrink-0"
                />

                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-base text-neutral-900">{p.name}</h3>
                    <span className="text-[11px] font-semibold bg-primary-50 text-primary-700 px-2 py-0.5 rounded-md">
                      {p.primaryCategory}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        p.verificationStatus === 'VERIFIED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.verificationStatus === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {p.verificationStatus}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-neutral-400" />
                      {p.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-neutral-400" />
                      {p.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-neutral-400" />
                      {p.experienceYears} Years Experience
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    {p.serviceAreas.map((sa) => (
                      <span
                        key={sa.id}
                        className="text-[11px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-md flex items-center gap-1"
                      >
                        <MapPin className="w-3 h-3 text-neutral-400" />
                        {sa.area} ({sa.city} · {sa.pincode})
                      </span>
                    ))}
                  </div>

                  {p.rejectionReason && (
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 mt-2">
                      <strong>Rejection Reason:</strong> {p.rejectionReason}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                {p.verificationStatus !== 'VERIFIED' && (
                  <Button
                    variant="success"
                    size="sm"
                    isLoading={isProcessing}
                    onClick={() => handleVerify(p)}
                    leftIcon={<CheckCircle2 className="w-4 h-4" />}
                  >
                    Verify & Activate
                  </Button>
                )}

                {p.verificationStatus !== 'REJECTED' && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      setSelectedProvider(p);
                      setRejectModalOpen(true);
                    }}
                    leftIcon={<XCircle className="w-4 h-4" />}
                  >
                    Reject
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rejection Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Provider Verification"
        subtitle={`Application for ${selectedProvider?.name}`}
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={isProcessing}
              onClick={handleConfirmReject}
            >
              Confirm Rejection
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-neutral-700">
            Specify Reason for Rejection <span className="text-rose-500">*</span>
          </label>
          <select
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="w-full text-xs p-2.5 rounded-xl border border-neutral-300 focus:border-primary-500 outline-none bg-white mb-2"
          >
            <option value="">Select standard criteria...</option>
            <option value="Aadhaar / ID proof illegible or mismatch in name">
              Aadhaar / ID proof illegible or mismatch in name
            </option>
            <option value="Inadequate certified trade experience in specified category">
              Inadequate certified trade experience in specified category
            </option>
            <option value="Unreachable phone number during quality verification call">
              Unreachable phone number during quality verification call
            </option>
          </select>
          <textarea
            rows={3}
            required
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Type notes detailing what documents need re-submission..."
            className="w-full text-xs p-3 rounded-xl border border-neutral-300 focus:border-primary-500 outline-none"
          />
        </div>
      </Modal>
    </div>
  );
};
