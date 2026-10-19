import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Zap,
  Fan,
  Plug,
  PlugZap,
  Lightbulb,
  BatteryCharging,
  ShieldCheck,
  ArrowRight,
  Clock,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { jobRequestService } from '../../services/jobRequestService';
import { JobRequest } from '../../types';
import { JobRequestCard } from '../../components/cards/JobRequestCard';
import { Button } from '../../components/ui/Button';
import { DashboardSkeleton } from '../../components/common/Skeletons';
import { ErrorState } from '../../components/common/ErrorState';

export const CustomerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [requests, setRequests] = useState<JobRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const loadRequests = async () => {
      if (!user) return;
      try {
        setIsLoading(true);
        setLoadError(false);
        const data = await jobRequestService.getCustomerRequests(user.id);
        setRequests(data);
      } catch (err) {
        console.error(err);
        setLoadError(true);
      } finally {
        setIsLoading(false);
      }
    };
    loadRequests();
  }, [user, retryCount]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }
  if (loadError) return <ErrorState type="network" message="We couldn't load your requests." onRetry={() => { setIsLoading(true); setRetryCount((count) => count + 1); }} />;

  // Segment requests into clear decision-oriented groups
  const activeNeeds = requests.filter(
    (r) => r.status === 'POSTED' || r.status === 'PROVIDER_INTERESTED'
  );
  const ongoingJobs = requests.filter(
    (r) =>
      r.status === 'PROVIDER_ACCEPTED' ||
      r.status === 'IN_PROGRESS' ||
      r.status === 'PROVIDER_MARKED_COMPLETE' ||
      r.status === 'CUSTOMER_CONFIRMED_COMPLETE'
  );
  const completedJobs = requests.filter((r) => r.status === 'COMPLETED');

  // Quick-start electrical problems (ids match COMMON_SERVICE_PROBLEMS)
  const quickProblems = [
    { name: 'MCB Tripping', problemId: 'el-mcb', icon: PlugZap },
    { name: 'Fan Installation', problemId: 'el-fan', icon: Fan },
    { name: 'Wiring / Short Circuit', problemId: 'el-wiring', icon: Zap },
    { name: 'Lights & Fittings', problemId: 'el-lighting', icon: Lightbulb },
    { name: 'Inverter Setup', problemId: 'el-inverter', icon: BatteryCharging },
    { name: 'AC Power Point', problemId: 'el-ac-point', icon: Plug },
    { name: 'Safety Check', problemId: 'el-safety', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* 1. PRIMARY ACTION HERO: POST AN ELECTRICIAN REQUEST */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-primary-950 text-white rounded-3xl p-6 sm:p-8 shadow-card relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="text-[11px] font-bold text-primary-300 uppercase tracking-widest bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
            Electrician on Demand
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            What electrical work do you need today?
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Post your electrical problem, get a transparent price estimate, and let verified local electricians respond. You approve the final cost.
          </p>

          {/* Big Primary CTA */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate('/customer/book-service')}
              leftIcon={<Plus className="w-5 h-5 stroke-[2.5]" />}
              className="shadow-lg shadow-primary-600/30 font-bold"
            >
              Post an Electrician Request
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/customer/requests')}
              className="border-neutral-600 text-neutral-200 hover:bg-neutral-800"
            >
              My Requests ({requests.length})
            </Button>
          </div>
        </div>

        {/* Quick Category Chips inside Hero */}
        <div className="mt-6 pt-5 border-t border-neutral-700/60 relative z-10">
          <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-2 tracking-wider">
            Quick Start by Problem
          </span>
          <div className="flex flex-wrap gap-2">
            {quickProblems.map((qc) => {
              const Icon = qc.icon;
              return (
                <button
                  key={qc.problemId}
                  onClick={() => navigate(`/customer/book-service?problem=${qc.problemId}`)}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold text-white transition-all flex items-center gap-2 hover:scale-[1.02]"
                >
                  <Icon className="w-3.5 h-3.5 text-primary-300" />
                  <span>{qc.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. ONGOING JOBS REQUIRING ATTENTION (e.g. TWO-SIDED COMPLETION) */}
      {ongoingJobs.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-neutral-900 tracking-tight flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-600" />
                Ongoing Jobs ({ongoingJobs.length})
              </h2>
              <p className="text-xs text-neutral-500">
                Jobs in progress or waiting for your completion confirmation.
              </p>
            </div>
            <Link
              to="/customer/requests"
              className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ongoingJobs.map((req) => (
              <JobRequestCard
                key={req.id}
                request={req}
                currentUserId={user?.id}
                userRole="CUSTOMER"
                onViewDetails={() => navigate(`/customer/requests/${req.id}`)}
              />
            ))}
          </div>
        </section>
      )}

      {/* 3. ACTIVE POSTINGS & INTERESTED PROVIDERS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-neutral-900 tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-primary-600" />
              Active Requests & Nearby Responses ({activeNeeds.length})
            </h2>
            <p className="text-xs text-neutral-500">
              Open requests receiving interest from verified electricians.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/customer/book-service')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New Request
          </Button>
        </div>

        {activeNeeds.length === 0 ? (
          <div className="bg-white rounded-3xl border border-neutral-200/90 p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto">
              <Plus className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-neutral-900">No active electrician requests</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Flickering lights, tripping MCB or a new fan to fit? Post a request in under a minute.
            </p>
            <Button
              size="sm"
              variant="primary"
              onClick={() => navigate('/customer/book-service')}
            >
              Post an Electrician Request
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeNeeds.map((req) => (
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
      </section>

      {/* 4. COMPLETED SERVICES */}
      {completedJobs.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-neutral-200/70">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-neutral-900 tracking-tight flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Completed Services ({completedJobs.length})
            </h2>
            <Link
              to="/customer/requests?tab=completed"
              className="text-xs font-bold text-neutral-500 hover:text-neutral-800"
            >
              History
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedJobs.slice(0, 2).map((req) => (
              <JobRequestCard
                key={req.id}
                request={req}
                currentUserId={user?.id}
                userRole="CUSTOMER"
                onViewDetails={() => navigate(`/customer/requests/${req.id}`)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
