import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, IndianRupee, MapPin, AlertCircle, ChevronRight, XCircle } from 'lucide-react';
import { requestApi } from '../../services/api';
import { ServiceRequest, RequestStatus } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

export const ElectricianMyJobsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await requestApi.getMyRequests();
      setRequests(data);
    } catch (err: any) {
      console.error(err);
      setError('Could not load your job history. Please make sure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleWithdraw = async (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation(); // prevent card navigation
    if (!confirm('Withdraw your bid for this job?')) return;
    setWithdrawingId(jobId);
    try {
      await requestApi.withdrawInterest(jobId);
      showToast('Your bid has been withdrawn.', 'info');
      await load(); // refresh list
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to withdraw bid.', 'error');
    } finally {
      setWithdrawingId(null);
    }
  };

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'OPEN':
        return <Badge variant="warning">Bid Submitted / Open</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="primary">Assigned to You / In Progress</Badge>;
      case 'COMPLETED':
        return <Badge variant="success">Completed</Badge>;
      case 'CANCELLED':
        return <Badge variant="neutral">Cancelled</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 py-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
          My Bids &amp; Assigned Jobs
        </h1>
        <p className="text-sm text-neutral-500">
          Track the status of jobs you have quoted on or have been hired to complete.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-neutral-100 animate-pulse" />
          ))}
        </div>
      ) : requests.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {requests.map((job) => (
            <div
              key={job.id}
              onClick={() => navigate(`/requests/${job.id}`)}
              className="bg-white p-5 rounded-2xl border border-neutral-200/90 hover:border-primary-500 hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  {getStatusBadge(job.status)}
                  <span className="text-xs px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 font-medium">
                    {job.serviceCategory}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-neutral-900 hover:text-primary-600 transition-colors">
                  {job.title}
                </h3>

                <p className="text-xs text-neutral-500 line-clamp-1">{job.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 pt-1">
                  <span className="flex items-center gap-1 font-semibold text-neutral-900">
                    <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                    Customer Budget: ₹{job.budget}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    {job.locality}, {job.city}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:border-l sm:border-neutral-100 sm:pl-4">
                {/* Withdraw button — only on OPEN bids */}
                {job.status === 'OPEN' && (
                  <Button
                    variant="outline"
                    size="sm"
                    isLoading={withdrawingId === job.id}
                    onClick={(e) => handleWithdraw(e, job.id)}
                    className="text-rose-600 border-rose-200 hover:bg-rose-50"
                    leftIcon={<XCircle className="w-4 h-4" />}
                  >
                    Withdraw
                  </Button>
                )}
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600">
                  View <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-neutral-200 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-500 mx-auto flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-neutral-900">No bids placed yet</h3>
            <p className="text-sm text-neutral-500 max-w-sm mx-auto">
              You haven't placed any bids on open jobs yet. Check out open jobs and start bidding!
            </p>
          </div>
          <Button variant="primary" onClick={() => navigate('/electrician/jobs')}>
            Browse Open Jobs
          </Button>
        </div>
      )}
    </div>
  );
};
