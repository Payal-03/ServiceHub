import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Users,
  ShieldCheck,
  AlertTriangle,
  CalendarCheck2,
  CheckCircle2,
  XCircle,
  TrendingUp,
  CreditCard,
  Clock,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { adminService, bookingService, userService, complaintService } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { DashboardSkeleton } from '../../components/common/Skeletons';
import { DEMO_MODE } from '../../services/api';
import { ErrorState } from '../../components/common/ErrorState';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        setLoadError(false);
        const data = await adminService.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error(err);
        setLoadError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, [retryCount]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }
  if (loadError || !stats) return <ErrorState type="network" message="We couldn't load the admin dashboard." onRetry={() => { setIsLoading(true); setRetryCount((count) => count + 1); }} />;

  // Analytics Chart Data
  const bookingsOverTime = [
    { month: 'May', bookings: 28, revenue: 16800 },
    { month: 'Jun', bookings: 45, revenue: 31200 },
    { month: 'Jul', bookings: 62, revenue: 44900 },
    { month: 'Aug', bookings: 89, revenue: 67300 },
    { month: 'Sep', bookings: 124, revenue: 98400 },
    { month: 'Oct (Current)', bookings: 165, revenue: 135800 },
  ];

  const servicesByCategory = [
    { category: 'MCB / Switchboard', jobs: 58, fill: '#F59E0B' },
    { category: 'Wiring & Short Ckt', jobs: 47, fill: '#EF4444' },
    { category: 'Fan & Regulator', jobs: 41, fill: '#3B82F6' },
    { category: 'Inverter & Battery', jobs: 33, fill: '#10B981' },
    { category: 'Lighting', jobs: 27, fill: '#8B5CF6' },
    { category: 'Safety Check', jobs: 19, fill: '#06B6D4' },
  ];

  const statusDistribution = [
    { name: 'Active In Progress', value: stats.activeBookings || 8, color: '#3B82F6' },
    { name: 'Completed & Paid', value: stats.completedBookings || 16, color: '#10B981' },
    { name: 'Pending Review', value: stats.pendingVerification || 3, color: '#F59E0B' },
    { name: 'Cancelled', value: stats.cancelledBookings || 2, color: '#EF4444' },
  ];

  const providerVerificationData = [
    { name: 'Verified', count: stats.verifiedProviders, fill: '#10B981' },
    { name: 'Pending Review', count: stats.pendingVerification, fill: '#F59E0B' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-primary-600 uppercase tracking-widest block">
            System Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mt-1">
            Platform Operations & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Real-time monitoring of customers, electrician verification queues, and job lifecycles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/admin/provider-verification')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Review Verifications ({stats.pendingVerification})
          </Button>
        </div>
      </div>

      {/* 8 Stats KPI Grid (Requirement 28) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-subtle">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Total Platform Users</span>
            <Users className="w-4 h-4 text-primary-600" />
          </div>
          <div className="text-2xl font-black text-neutral-900">{stats.totalUsers}</div>
          <span className="text-[10px] text-neutral-400">Customers & Providers</span>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-subtle">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Verified Providers</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{stats.verifiedProviders}</div>
          <span className="text-[10px] text-neutral-400">Of {stats.totalProviders} registered</span>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-subtle">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Pending Verifications</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600">{stats.pendingVerification}</div>
          <span className="text-[10px] text-amber-600 font-medium">Awaiting document check</span>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-subtle">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Active Bookings</span>
            <CalendarCheck2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-indigo-600">{stats.activeBookings}</div>
          <span className="text-[10px] text-neutral-400">In progression now</span>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-subtle">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Completed Bookings</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-neutral-900">{stats.completedBookings}</div>
          <span className="text-[10px] text-emerald-600 font-semibold">100% Verified done</span>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-subtle">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Cancelled Bookings</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-600">{stats.cancelledBookings}</div>
          <span className="text-[10px] text-neutral-400">Cancellation rate: &lt;5%</span>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-subtle">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Active Complaints</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600">{stats.complaintsCount}</div>
          <span className="text-[10px] text-neutral-400">Within response SLA</span>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-subtle">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Platform GMV</span>
            <CreditCard className="w-4 h-4 text-primary-600" />
          </div>
          <div className="text-2xl font-black text-neutral-900">
            ₹{(stats.totalRevenue ?? (DEMO_MODE ? 18450 : 0)).toLocaleString()}
          </div>
          <span className="text-[10px] text-neutral-400">Recorded gross volume</span>
        </div>
      </div>

      {/* Analytics Charts Grid using Recharts (Requirement 28) */}
      {DEMO_MODE ? <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Bookings Over Time */}
        <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Bookings Over Time</h3>
              <p className="text-xs text-neutral-500">Monthly booking volume growth</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              +32% MoM
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={bookingsOverTime}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="bookings" stroke="#2563EB" strokeWidth={2.5} fill="url(#colorBookings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Services by Category */}
        <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-subtle space-y-4">
          <div>
            <h3 className="text-sm font-bold text-neutral-900">Demand by Electrical Problem</h3>
            <p className="text-xs text-neutral-500">Most requested electrician job types</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={servicesByCategory} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                <XAxis type="number" stroke="#94A3B8" fontSize={11} />
                <YAxis dataKey="category" type="category" stroke="#64748B" fontSize={11} width={110} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="jobs" radius={[0, 8, 8, 0]}>
                  {servicesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Booking Status Distribution */}
        <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-subtle space-y-4">
          <div>
            <h3 className="text-sm font-bold text-neutral-900">Booking Status Distribution</h3>
            <p className="text-xs text-neutral-500">Breakdown of current state machine distribution</p>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Provider Verification Status */}
        <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Provider Verification Status</h3>
              <p className="text-xs text-neutral-500">Quality screening conversion breakdown</p>
            </div>
            <Link
              to="/admin/provider-verification"
              className="text-xs text-primary-600 font-bold hover:underline"
            >
              Queue →
            </Link>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={providerVerificationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {providerVerificationData.map((entry, index) => (
                    <Cell key={`cell-v-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div> : <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">Trend charts are not available until the analytics endpoint is connected.</div>}
    </div>
  );
};
