import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Inbox,
  CalendarCheck,
  Clock,
  TrendingUp,
  Star,
  CheckCircle2,
  ArrowRight,
  MapPin,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { bookingService, providerService } from '../../services/api';
import { Booking, Provider } from '../../types';
import { Button } from '../../components/ui/Button';
import { BOOKING_STATUS_CONFIG } from '../../constants/bookingStatusConfig';
import { DashboardSkeleton } from '../../components/common/Skeletons';

export const ProviderDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [provider, setProvider] = useState<Provider | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProviderData = async () => {
      if (!user) return;
      try {
        setIsLoading(true);
        // Find provider profile
        const provData = await providerService.getProviderById('prov-1');
        setProvider(provData);

        const allBookings = await bookingService.getBookings('PROVIDER', provData.id);
        setBookings(allBookings);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadProviderData();
  }, [user]);

  if (isLoading || !provider) {
    return <DashboardSkeleton />;
  }

  const pendingRequests = bookings.filter((b) => b.status === 'PENDING');
  const activeJobs = bookings.filter((b) => ['ACCEPTED', 'SCHEDULED', 'ON_THE_WAY', 'IN_PROGRESS'].includes(b.status));
  const completedJobs = bookings.filter((b) => ['COMPLETED', 'PAID', 'REVIEWED'].includes(b.status));
  const totalEarnings = completedJobs
    .filter((b) => b.paymentStatus === 'PAID')
    .reduce((acc, cur) => acc + (cur.finalCost || cur.estimatedCost), 0);

  // Today's jobs
  const todayJobs = activeJobs.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* 1. Header Card */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-primary-950 text-white rounded-3xl p-6 sm:p-8 shadow-card relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-primary-400 tracking-wider uppercase">
              Provider Operational Portal
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
          <p className="text-sm text-neutral-300 mt-1">
            Here is your daily dispatch overview. You have{' '}
            <strong className="text-white">{pendingRequests.length} pending request(s)</strong> awaiting confirmation.
          </p>
        </div>

        <div className="mt-5 relative z-10 flex flex-wrap gap-2.5">
          <Button
            size="sm"
            variant="primary"
            onClick={() => navigate('/provider/requests')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Review Requests ({pendingRequests.length})
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-neutral-700 text-white hover:bg-neutral-800"
            onClick={() => navigate('/provider/availability')}
          >
            Manage Weekly Schedule
          </Button>
        </div>
      </div>

      {/* 2. 6 Essential KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-4 shadow-subtle">
          <span className="text-xs text-neutral-500 font-medium block">Pending Requests</span>
          <span className="text-2xl font-black text-amber-600 mt-1 block">
            {pendingRequests.length}
          </span>
          <span className="text-[10px] text-neutral-400">Needs action</span>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200/80 p-4 shadow-subtle">
          <span className="text-xs text-neutral-500 font-medium block">Today's Jobs</span>
          <span className="text-2xl font-black text-primary-600 mt-1 block">
            {todayJobs.length}
          </span>
          <span className="text-[10px] text-neutral-400">Scheduled</span>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200/80 p-4 shadow-subtle">
          <span className="text-xs text-neutral-500 font-medium block">Active Jobs</span>
          <span className="text-2xl font-black text-indigo-600 mt-1 block">
            {activeJobs.length}
          </span>
          <span className="text-[10px] text-neutral-400">In progression</span>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200/80 p-4 shadow-subtle">
          <span className="text-xs text-neutral-500 font-medium block">Completed</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">
            {completedJobs.length}
          </span>
          <span className="text-[10px] text-neutral-400">All-time</span>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200/80 p-4 shadow-subtle">
          <span className="text-xs text-neutral-500 font-medium block">Total Earnings</span>
          <span className="text-xl font-black text-neutral-900 mt-1 block truncate">
            ₹{totalEarnings.toLocaleString()}
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold">In-system recorded</span>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200/80 p-4 shadow-subtle">
          <span className="text-xs text-neutral-500 font-medium block">Average Rating</span>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-2xl font-black text-neutral-900">{provider.rating.toFixed(1)}</span>
          </div>
          <span className="text-[10px] text-neutral-400">{provider.jobCount} reviews</span>
        </div>
      </div>

      {/* 3. Main Section: Today's Schedule (Requirement 19) */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-neutral-900">Today's Dispatch Schedule</h3>
            <p className="text-xs text-neutral-500">Upcoming appointments queued for today</p>
          </div>
          <Link
            to="/provider/bookings"
            className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            All Bookings <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {todayJobs.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-neutral-200 rounded-2xl text-xs text-neutral-400">
            No active jobs scheduled for today.{' '}
            <Link to="/provider/requests" className="text-primary-600 font-bold underline">
              Check incoming requests
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {todayJobs.map((job) => {
              const config = BOOKING_STATUS_CONFIG[job.status];
              return (
                <div
                  key={job.id}
                  onClick={() => navigate(`/provider/bookings/${job.id}`)}
                  className="p-4 rounded-2xl border border-neutral-200/80 hover:border-primary-400 hover:shadow-card-hover transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer group"
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-700 font-extrabold text-xs flex flex-col items-center justify-center flex-shrink-0">
                      <Clock className="w-3.5 h-3.5 mb-0.5" />
                      <span>{job.time}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-neutral-900 group-hover:text-primary-600 transition-colors">
                          {job.serviceTitle}
                        </h4>
                        <span className="text-[10px] font-mono text-neutral-400 font-semibold">
                          #{job.bookingNumber}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 mt-0.5">
                        Customer: <strong className="text-neutral-800">{job.customer.name}</strong> ·{' '}
                        <span>{job.address.area}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border ${config.badgeClass}`}
                    >
                      {config.label}
                    </span>
                    <Button variant="outline" size="sm">
                      Open Job
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
