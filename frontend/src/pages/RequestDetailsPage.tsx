import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Zap,
  MapPin,
  IndianRupee,
  Clock,
  Phone,
  User,
  Star,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  XCircle,
  Send,
  Wrench,
  ThumbsUp,
} from 'lucide-react';
import { requestApi, ratingApi } from '../services/api';
import { ServiceRequest, RequestStatus, Interest } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { StarRating } from '../components/ui/StarRating';

export const RequestDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const { showToast } = useToast();

  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Electrician bid state
  const [bidAmount, setBidAmount] = useState<number | ''>('');
  const [bidMessage, setBidMessage] = useState('');

  // Rating state
  const [ratingScore, setRatingScore] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const fetchRequest = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await requestApi.getById(id);
      setRequest(data);
      if (data.budget && !bidAmount) {
        setBidAmount(data.budget);
      }
    } catch (err: any) {
      console.error(err);
      setError('Could not load request details. Make sure the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, [id]);

  // Cancel Request (Customer)
  const handleCancel = async () => {
    if (!id || !confirm('Are you sure you want to cancel this request?')) return;
    setActionLoading(true);
    try {
      const updated = await requestApi.cancel(id);
      setRequest(updated);
      showToast('Request cancelled.', 'info');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to cancel request.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Select Electrician (Customer)
  const handleSelectElectrician = async (electricianId: number | string) => {
    if (!id || !confirm('Confirm hiring this electrician?')) return;
    setActionLoading(true);
    try {
      const updated = await requestApi.selectElectrician(id, electricianId);
      setRequest(updated);
      showToast('Electrician hired! Status changed to In Progress.', 'success');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to select electrician.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Customer Confirm Completion
  const handleCustomerConfirm = async () => {
    if (!id) return;
    setActionLoading(true);
    try {
      const updated = await requestApi.customerConfirm(id);
      setRequest(updated);
      showToast('You confirmed job completion!', 'success');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to confirm completion.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Electrician Submit Bid
  const handleExpressInterest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !bidAmount) return;

    setActionLoading(true);
    try {
      const updated = await requestApi.expressInterest(id, {
        bidAmount: Number(bidAmount),
        message: bidMessage.trim() || 'I can complete this electrical work efficiently.',
      });
      setRequest(updated);
      showToast('Your bid quote has been submitted to the customer!', 'success');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to submit bid.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Electrician Withdraw Bid
  const handleWithdrawInterest = async () => {
    if (!id || !confirm('Withdraw your bid for this job?')) return;
    setActionLoading(true);
    try {
      const updated = await requestApi.withdrawInterest(id);
      setRequest(updated);
      showToast('Your bid has been withdrawn.', 'info');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to withdraw bid.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Electrician Confirm Completion
  const handleElectricianConfirm = async () => {
    if (!id) return;
    setActionLoading(true);
    try {
      const updated = await requestApi.electricianConfirm(id);
      setRequest(updated);
      showToast('You marked this job as completed!', 'success');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to mark completed.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Submit Rating (Customer or Electrician)
  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setActionLoading(true);
    try {
      await ratingApi.create({
        requestId: id,
        score: ratingScore,
        review: reviewText.trim() || 'Work completed smoothly.',
      });
      setRatingSubmitted(true);
      showToast('Thank you! Your rating and review have been recorded.', 'success');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Rating could not be submitted.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <div className="p-8 bg-white rounded-3xl border border-neutral-200 space-y-4">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-neutral-900">Request Not Found</h2>
          <p className="text-sm text-neutral-500">{error || 'Unable to find this service request.'}</p>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const isCustomerOwner = user && String(user.id) === String(request.customerId);
  const myExistingBid = request.interestedProviders?.find(
    (p) => user && String(p.electricianId) === String(user.id)
  );
  const isSelectedElectrician =
    user && request.selectedElectricianId && String(request.selectedElectricianId) === String(user.id);

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'OPEN':
        return <Badge variant="success">Open for Bidding</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="primary">In Progress</Badge>;
      case 'COMPLETED':
        return <Badge variant="secondary">Completed</Badge>;
      case 'CANCELLED':
        return <Badge variant="neutral">Cancelled</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Top back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to List
      </button>

      {/* Main Request Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              {getStatusBadge(request.status)}
              <span className="text-xs text-neutral-400 font-mono">
                #{request.requestNumber || request.id}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 font-medium">
                {request.serviceCategory}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
              {request.title}
            </h1>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-neutral-400 block font-medium">Expected Budget</span>
            <span className="text-2xl font-extrabold text-neutral-900 flex items-center sm:justify-end gap-0.5">
              <IndianRupee className="w-5 h-5 text-emerald-600" />
              {request.budget}
            </span>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
            Problem Description
          </h3>
          <p className="text-neutral-700 text-sm leading-relaxed whitespace-pre-line bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
            {request.description}
          </p>
        </div>

        {/* Location & Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Service Location
            </span>
            <p className="text-sm font-semibold text-neutral-900">
              {request.locality}, {request.city}
            </p>
            {/* Show full address if customer or assigned electrician */}
            {(isCustomerOwner || isSelectedElectrician) && (
              <p className="text-xs text-neutral-600 mt-1">
                <span className="font-medium text-neutral-800">Address:</span> {request.address}
              </p>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> Customer Info
            </span>
            <p className="text-sm font-semibold text-neutral-900">
              {request.customerName}
            </p>
            {(isCustomerOwner || isSelectedElectrician) && (
              <p className="text-xs text-neutral-600 mt-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-neutral-400" /> {request.customerPhone}
              </p>
            )}
          </div>
        </div>

        {/* Customer Actions for OPEN state */}
        {isCustomerOwner && request.status === 'OPEN' && (
          <div className="pt-4 border-t border-neutral-100 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              isLoading={actionLoading}
              className="text-rose-600 border-rose-200 hover:bg-rose-50"
            >
              Cancel Request
            </Button>
          </div>
        )}
      </div>

      {/* IN_PROGRESS: Completion confirmation card */}
      {request.status === 'IN_PROGRESS' && (
        <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900">Job In Progress</h3>
              <p className="text-xs text-neutral-600">
                Both parties confirm completion once work is finished.
              </p>
            </div>
          </div>

          {/* Selected Electrician info */}
          {request.selectedElectrician && (
            <div className="bg-white p-4 rounded-2xl border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-neutral-400 uppercase">Assigned Electrician</span>
                <p className="font-bold text-neutral-900 text-base">{request.selectedElectrician.name}</p>
                <p className="text-xs text-neutral-500 flex items-center gap-2 mt-0.5">
                  <span className="flex items-center gap-1 text-amber-600 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-current" /> {request.selectedElectrician.rating?.toFixed(1) || '5.0'}
                  </span>
                  <span>•</span>
                  <span>{request.selectedElectrician.experienceYears} yrs experience</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-neutral-700">
                    <Phone className="w-3 h-3" /> {request.selectedElectrician.phone}
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Status indicators */}
          <div className="grid grid-cols-2 gap-3 text-xs pt-1">
            <div className={`p-3 rounded-xl border ${request.electricianConfirmed ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold' : 'bg-white border-neutral-200 text-neutral-500'}`}>
              Electrician: {request.electricianConfirmed ? '✓ Confirmed Done' : 'Pending completion'}
            </div>
            <div className={`p-3 rounded-xl border ${request.customerConfirmed ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold' : 'bg-white border-neutral-200 text-neutral-500'}`}>
              Customer: {request.customerConfirmed ? '✓ Confirmed Done' : 'Pending confirmation'}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2">
            {isCustomerOwner && !request.customerConfirmed && (
              <Button
                variant="primary"
                onClick={handleCustomerConfirm}
                isLoading={actionLoading}
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Confirm Electrical Work Completed
              </Button>
            )}

            {isSelectedElectrician && !request.electricianConfirmed && (
              <Button
                variant="primary"
                onClick={handleElectricianConfirm}
                isLoading={actionLoading}
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Mark Job as Completed
              </Button>
            )}
          </div>
        </div>
      )}

      {/* COMPLETED: Rating & Review Card */}
      {request.status === 'COMPLETED' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900">Electrical Job Completed!</h3>
              <p className="text-xs text-neutral-600">
                Both customer and electrician have confirmed completion.
              </p>
            </div>
          </div>

          {!ratingSubmitted ? (
            <form onSubmit={handleSubmitRating} className="bg-white p-5 rounded-2xl border border-emerald-100 space-y-4">
              <h4 className="font-bold text-sm text-neutral-900">
                Leave a Rating & Review
              </h4>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1.5">
                  Rating Score (1 to 5 Stars)
                </label>
                <StarRating
                  rating={ratingScore}
                  interactive={true}
                  onChange={(val) => setRatingScore(val)}
                  size="lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1.5">
                  Your Feedback / Review
                </label>
                <textarea
                  rows={2}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share details about the quality of work, punctuality, and professionalism..."
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={actionLoading}
                leftIcon={<Send className="w-4 h-4" />}
              >
                Submit Review
              </Button>
            </form>
          ) : (
            <div className="p-4 bg-white rounded-2xl border border-emerald-100 text-sm text-emerald-800 font-semibold flex items-center gap-2">
              <ThumbsUp className="w-4 h-4" /> Thank you for your feedback!
            </div>
          )}
        </div>
      )}

      {/* ELECTRICIAN VIEW: Bid on OPEN request */}
      {role === 'ELECTRICIAN' && request.status === 'OPEN' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary-600" />
            Electrician Bidding Section
          </h3>

          {myExistingBid ? (
            <div className="p-4 rounded-2xl bg-primary-50 border border-primary-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-primary-700 uppercase">You have submitted a bid</span>
                  <p className="text-lg font-extrabold text-neutral-900">₹{myExistingBid.bidAmount}</p>
                </div>
                <Badge variant="warning">{myExistingBid.status}</Badge>
              </div>
              <p className="text-xs text-neutral-600 italic">"{myExistingBid.message}"</p>
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleWithdrawInterest}
                  isLoading={actionLoading}
                  className="text-rose-600 border-rose-200 hover:bg-rose-50"
                >
                  Withdraw Bid
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleExpressInterest} className="space-y-4">
              <p className="text-xs text-neutral-500">
                Customer's expected budget is ₹{request.budget}. You can quote your price and message.
              </p>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Your Bid Amount (₹)
                </label>
                <div className="relative">
                  <IndianRupee className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="number"
                    min={50}
                    required
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value ? Number(e.target.value) : '')}
                    className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Message for Customer
                </label>
                <textarea
                  rows={2}
                  value={bidMessage}
                  onChange={(e) => setBidMessage(e.target.value)}
                  placeholder="e.g. I have 6 years experience with this repair and can visit within 1 hour."
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={actionLoading}
                rightIcon={<Send className="w-4 h-4" />}
              >
                Submit Bid Quote
              </Button>
            </form>
          )}
        </div>
      )}

      {/* CUSTOMER VIEW: List of interested electrician bids */}
      {isCustomerOwner && request.status === 'OPEN' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-neutral-900">
              Electrician Bids ({request.interestedProviders?.length || 0})
            </h3>
            <span className="text-xs text-neutral-500">Choose the best electrician for your job</span>
          </div>

          {request.interestedProviders && request.interestedProviders.length > 0 ? (
            <div className="space-y-3">
              {request.interestedProviders.map((bid) => (
                <div
                  key={bid.interestId}
                  className="p-4 rounded-2xl border border-neutral-200 hover:border-primary-500 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-neutral-900">
                        {bid.electricianName}
                      </span>
                      <span className="flex items-center gap-0.5 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        <Star className="w-3 h-3 fill-current" />
                        {bid.electricianRating > 0 ? bid.electricianRating.toFixed(1) : 'New'}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {bid.electricianExperienceYears} yrs exp
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600 italic">"{bid.message}"</p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <span className="text-[11px] text-neutral-400 block font-medium">Quote Price</span>
                      <span className="text-xl font-extrabold text-neutral-900 flex items-center sm:justify-end gap-0.5">
                        <IndianRupee className="w-4 h-4 text-emerald-600" />
                        {bid.bidAmount}
                      </span>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleSelectElectrician(bid.electricianId)}
                      isLoading={actionLoading}
                    >
                      Select Electrician
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-neutral-500 text-sm bg-neutral-50 rounded-2xl border border-neutral-100">
              No electricians have quoted on this job yet. Local electricians in your area are being notified!
            </div>
          )}
        </div>
      )}
    </div>
  );
};
