import React, { useState, useEffect } from 'react';
import { IndianRupee, AlertCircle, Bell, Loader2, Wrench, Lock } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ServiceRequest } from '../../types';
import { requestApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';

interface EditJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: ServiceRequest;
  onJobUpdated: (updated: ServiceRequest) => void;
}

export const EditJobModal: React.FC<EditJobModalProps> = ({
  isOpen,
  onClose,
  request,
  onJobUpdated,
}) => {
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [locality, setLocality] = useState('');
  const [address, setAddress] = useState('');
  const [expectedBudget, setExpectedBudget] = useState<number | ''>('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Populate form whenever modal opens with current request data
  useEffect(() => {
    if (!isOpen) return;

    setTitle(request.title || '');
    setDescription(request.description || '');
    setCity(request.city || 'Mathura');
    setLocality(request.locality || '');
    setAddress(request.address || '');
    setExpectedBudget(request.budget || '');
    setError(null);
  }, [isOpen, request]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (request.selectedElectricianId) {
      setError('An electrician has already been hired for this job. No further changes can be made.');
      return;
    }

    if (request.status !== 'OPEN') {
      setError('This job post cannot be edited because it is no longer open.');
      return;
    }

    if (!title.trim()) {
      setError('Job title is required.');
      return;
    }

    if (!description.trim()) {
      setError('Job description is required.');
      return;
    }

    if (!city.trim() || !locality.trim() || !address.trim()) {
      setError('Please provide complete location details (city, locality, and address).');
      return;
    }

    if (!expectedBudget || Number(expectedBudget) < 50) {
      setError('Expected budget must be at least ₹50.');
      return;
    }

    setIsSaving(true);
    try {
      // Category is not modified once posted
      const updated = await requestApi.update(request.id, {
        title: title.trim(),
        description: description.trim(),
        city: city.trim(),
        locality: locality.trim(),
        address: address.trim(),
        expectedBudget: Number(expectedBudget),
      });

      showToast(
        'Job post updated successfully! Interested electricians have been notified.',
        'success'
      );
      onJobUpdated(updated);
      onClose();
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Failed to update job post. Please try again.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const interestedCount = request.interestedCount || request.interestedProviders?.length || 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Job Post"
      subtitle={`Update details for request #${request.requestNumber || request.id}`}
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {/* Error notification */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Informative alert about electrician notifications */}
        <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 text-blue-800 text-xs sm:text-sm flex items-start gap-2.5">
          <Bell className="w-4 h-4 flex-shrink-0 text-blue-600 mt-0.5" />
          <div>
            <span className="font-semibold text-blue-900">Electrician Notification Notice:</span>
            <p className="text-xs text-blue-700 mt-0.5">
              {interestedCount > 0 ? (
                <>
                  <span className="font-bold">{interestedCount} electrician{interestedCount > 1 ? 's' : ''}</span>{' '}
                  who expressed interest in this job will immediately receive an in-app notification with your updated requirements and budget.
                </>
              ) : (
                'Any electricians who view or express interest in this job will see your updated information.'
              )}
            </p>
          </div>
        </div>

        {/* Category (Read-only once posted) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-neutral-700">
              Service Category
            </label>
            <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md flex items-center gap-1 border border-amber-200/80">
              <Lock className="w-3 h-3 text-amber-600" /> Fixed once posted
            </span>
          </div>
          <div className="px-3.5 py-2.5 bg-neutral-100/90 border border-neutral-200 rounded-xl text-neutral-800 text-xs sm:text-sm font-semibold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {request.serviceCategory || 'Electrical Work'}
            </span>
            <span className="text-[11px] font-normal text-neutral-500">Category cannot be changed after posting</span>
          </div>
        </div>

        {/* Job Title */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Job Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Ceiling fan not spinning and humming noise"
            className="w-full px-3.5 py-2 border border-neutral-300 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-xs sm:text-sm"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Detailed Problem Description
          </label>
          <textarea
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what needs repair, spare parts required, or symptoms..."
            className="w-full px-3.5 py-2 border border-neutral-300 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-xs sm:text-sm resize-none"
          />
        </div>

        {/* City and Locality */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              City
            </label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3.5 py-2 border border-neutral-300 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-xs sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Area / Locality
            </label>
            <input
              type="text"
              required
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              placeholder="e.g. Krishna Nagar"
              className="w-full px-3.5 py-2 border border-neutral-300 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-xs sm:text-sm"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Specific Address / Landmark
          </label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. House No. 42, Near Krishna Temple"
            className="w-full px-3.5 py-2 border border-neutral-300 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-xs sm:text-sm"
          />
        </div>

        {/* Budget */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Expected Budget (₹)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
              <IndianRupee className="w-4 h-4" />
            </span>
            <input
              type="number"
              min="50"
              step="10"
              required
              value={expectedBudget}
              onChange={(e) => setExpectedBudget(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="350"
              className="w-full pl-9 pr-3.5 py-2 border border-neutral-300 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-xs sm:text-sm"
            />
          </div>
          <span className="text-[11px] text-neutral-400 mt-1 block">
            Minimum expected budget is ₹50.
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSaving}
            leftIcon={isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wrench className="w-4 h-4" />}
          >
            {isSaving ? 'Saving Changes...' : 'Save & Notify Electricians'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
