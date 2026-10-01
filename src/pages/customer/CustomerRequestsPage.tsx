import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Plus,
  Filter,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Inbox
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { jobRequestService } from '../../services/jobRequestService';
import { JobRequest } from '../../types';
import { JobRequestCard } from '../../components/cards/JobRequestCard';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/common/EmptyState';

export const CustomerRequestsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [requests, setRequests] = useState<JobRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const activeTab = searchParams.get('tab') || 'all';

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user) return;
      try {
        setIsLoading(true);
        const data = await jobRequestService.getCustomerRequests(user.id);
        setRequests(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, [user]);

  const filteredRequests = requests.filter((r) => {
    if (activeTab === 'active') {
      return r.status === 'POSTED' || r.status === 'PROVIDER_INTERESTED';
    }
    if (activeTab === 'ongoing') {
      return (
        r.status === 'PROVIDER_ACCEPTED' ||
        r.status === 'IN_PROGRESS' ||
        r.status === 'PROVIDER_MARKED_COMPLETE' ||
        r.status === 'CUSTOMER_CONFIRMED_COMPLETE'
      );
    }
    if (activeTab === 'completed') {
      return r.status === 'COMPLETED';
    }
    if (activeTab === 'cancelled') {
      return r.status === 'CANCELLED';
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-7 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
            My Service Requests
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Track active requests, review interested nearby professionals, and confirm job completion.
          </p>
        </div>

        <Button
          size="md"
          variant="primary"
          onClick={() => navigate('/customer/book-service')}
          leftIcon={<Plus className="w-4 h-4 stroke-[2.5]" />}
          className="shadow-xs"
        >
          Post a Request
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
        {[
          { key: 'all', label: 'All Requests', count: requests.length },
          {
            key: 'active',
            label: 'Responses / Bids',
            count: requests.filter((r) => r.status === 'POSTED' || r.status === 'PROVIDER_INTERESTED')
              .length,
          },
          {
            key: 'ongoing',
            label: 'In Progress',
            count: requests.filter(
              (r) =>
                r.status === 'PROVIDER_ACCEPTED' ||
                r.status === 'IN_PROGRESS' ||
                r.status === 'PROVIDER_MARKED_COMPLETE' ||
                r.status === 'CUSTOMER_CONFIRMED_COMPLETE'
            ).length,
          },
          {
            key: 'completed',
            label: 'Completed',
            count: requests.filter((r) => r.status === 'COMPLETED').length,
          },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setSearchParams({ tab: tab.key })}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-neutral-900 text-white font-bold shadow-xs'
                  : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200/80'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Requests Grid */}
      {isLoading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white rounded-3xl border border-neutral-200/90 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
            <Inbox className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-neutral-900">No requests found</h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              You do not have any requests in this section right now.
            </p>
          </div>
          <Button
            size="sm"
            variant="primary"
            onClick={() => navigate('/customer/book-service')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Post a Service Request
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRequests.map((req) => (
            <JobRequestCard
              key={req.id}
              request={req}
              currentUserId={user?.id}
              userRole="CUSTOMER"
              onViewDetails={() => navigate(`/customer/requests/${req.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
