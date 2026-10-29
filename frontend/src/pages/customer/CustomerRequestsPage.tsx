import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlusCircle, Clock, MapPin, IndianRupee, Users, AlertCircle, CheckCircle2, ChevronRight, Lock, Edit3 } from 'lucide-react';
import { requestApi } from '../../services/api';
import { ServiceRequest, RequestStatus } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const CustomerRequestsPage: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'ALL' | RequestStatus>('ALL');

  const fetchRequests = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await requestApi.getMyRequests();
      setRequests(data);
    } catch (err: any) {
      console.error(err);
      setError('Could not load your service requests. Please make sure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRequests = requests.filter((r) => {
    if (filter === 'ALL') return true;
    return r.status === filter;
  });

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'OPEN':
        return <Badge variant="success">Open for Bids</Badge>;
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
    <div className="space-y-6 py-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">My Electrical Requests</h1>
          <p className="text-sm text-neutral-500">Track and manage your posted electrical jobs</p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/customer/create-request')}
          leftIcon={<PlusCircle className="w-4 h-4" />}
        >
          Post New Job
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-3 overflow-x-auto text-sm">
        {(['ALL', 'OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-xl font-semibold text-xs tracking-wide transition-all ${
              filter === tab
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            {tab === 'ALL' ? 'All Requests' : tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Main Content */}
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
      ) : filteredRequests.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              onClick={() => navigate(`/requests/${req.id}`)}
              className="bg-white p-5 rounded-2xl border border-neutral-200/90 hover:border-primary-500 hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {getStatusBadge(req.status)}
                  {req.status === 'OPEN' && !req.selectedElectricianId && (
                    <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Edit3 className="w-3 h-3" /> Editable
                    </span>
                  )}
                  {req.selectedElectricianId && (
                    <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  )}
                  <span className="text-xs text-neutral-400 font-mono">
                    #{req.requestNumber || req.id}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 font-medium">
                    {req.serviceCategory}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-neutral-900 hover:text-primary-600 transition-colors">
                  {req.title}
                </h3>

                <p className="text-xs text-neutral-500 line-clamp-1">{req.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 pt-1">
                  <span className="flex items-center gap-1 font-semibold text-neutral-800">
                    <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                    Budget: ₹{req.budget}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    {req.locality}, {req.city}
                  </span>
                  <span className="flex items-center gap-1 text-primary-600 font-medium">
                    <Users className="w-3.5 h-3.5" />
                    {req.interestedCount || req.interestedProviders?.length || 0} Bids
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end sm:border-l sm:border-neutral-100 sm:pl-4">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600">
                  {req.status === 'OPEN' && !req.selectedElectricianId ? 'View / Edit' : 'View Details'} <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-neutral-200 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-neutral-900">No requests found</h3>
            <p className="text-sm text-neutral-500 max-w-sm mx-auto">
              You haven't posted any jobs in this category yet. Post one now and receive electrician quotes!
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate('/customer/create-request')}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Post a Job
          </Button>
        </div>
      )}
    </div>
  );
};
