import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  CalendarCheck2,
  Clock,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Zap,
  Wrench,
  Wind,
  Laptop,
  Sparkles,
  MapPin,
  Star,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { bookingService } from '../../services/api';
import { Booking } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { BOOKING_STATUS_CONFIG } from '../../constants/bookingStatusConfig';
import { DashboardSkeleton } from '../../components/common/Skeletons';

export const CustomerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      try {
        const data = await bookingService.getBookings('CUSTOMER', user.id);
        setBookings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [user]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Calculate statistics
  const activeBookings = bookings.filter(b => ['ACCEPTED', 'SCHEDULED', 'ON_THE_WAY', 'IN_PROGRESS'].includes(b.status));
  const completedServices = bookings.filter(b => ['COMPLETED', 'PAID', 'REVIEWED'].includes(b.status));
  const pendingRequests = bookings.filter(b => b.status === 'PENDING');
  const totalSpent = completedServices
    .filter(b => b.paymentStatus === 'PAID')
    .reduce((acc, cur) => acc + (cur.finalCost || cur.estimatedCost), 0);

  // Next upcoming booking
  const upcomingBooking = activeBookings.length > 0 ? activeBookings[0] : null;

  const quickServices = [
    { name: 'Electrician', slug: 'electrician', icon: Zap, color: 'text-amber-500 bg-amber-50' },
    { name: 'Plumber', slug: 'plumber', icon: Wrench, color: 'text-blue-500 bg-blue-50' },
    { name: 'AC Repair', slug: 'ac-repair', icon: Wind, color: 'text-cyan-500 bg-cyan-50' },
    { name: 'Laptop Repair', slug: 'laptop-repair', icon: Laptop, color: 'text-indigo-500 bg-indigo-50' },
    { name: 'Cleaning', slug: 'cleaning', icon: Sparkles, color: 'text-purple-500 bg-purple-50' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Greeting & Global Search */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-700 text-white rounded-3xl p-6 sm:p-8 shadow-card relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none -mr-16 -mt-16" />
        <div className="relative z-10 max-w-2xl">
          <span className="text-xs font-semibold text-primary-200 tracking-wider uppercase">
            ServiceHub Customer Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Good morning, {user?.name.split(' ')[0] || 'Customer'} 👋
          </h1>
          <p className="text-sm text-primary-100 mt-1 leading-relaxed">
            Need home repairs today? Discover verified professionals in your neighborhood with real-time tracking.
          </p>

          {/* Quick Search Bar */}
          <div className="mt-5 relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate(`/customer/services?q=${encodeURIComponent(searchQuery)}`);
                }
              }}
              placeholder="What service do you need today? (e.g. AC service, wiring, tap leak)"
              className="w-full bg-white text-neutral-900 text-sm pl-11 pr-28 py-3.5 rounded-2xl shadow-md border-0 focus:ring-4 focus:ring-white/30 outline-none"
            />
            <button
              onClick={() => navigate(`/customer/services?q=${encodeURIComponent(searchQuery)}`)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* 2. Quick Service Categories */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider">
            Quick Categories
          </h3>
          <Link
            to="/customer/services"
            className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            All Services <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {quickServices.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                onClick={() => navigate(`/customer/services?cat=${cat.slug}`)}
                className="bg-white rounded-2xl border border-neutral-200/80 p-4 hover:border-primary-400 hover:shadow-card-hover transition-all text-left flex items-center gap-3 group"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${cat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 group-hover:text-primary-600 transition-colors">
                    {cat.name}
                  </h4>
                  <span className="text-[10px] text-neutral-400">View Pros</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-subtle">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Active Bookings</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-neutral-900">{activeBookings.length}</div>
          <span className="text-[11px] text-emerald-600 font-medium">In progression</span>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-subtle">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Completed Services</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-neutral-900">{completedServices.length}</div>
          <span className="text-[11px] text-neutral-500 font-medium">Verified completed</span>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-subtle">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Pending Requests</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-neutral-900">{pendingRequests.length}</div>
          <span className="text-[11px] text-amber-600 font-medium">Awaiting acceptance</span>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-subtle">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Total Spent</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-neutral-900">₹{totalSpent.toLocaleString()}</div>
          <span className="text-[11px] text-neutral-500 font-medium">Settled in platform</span>
        </div>
      </div>

      {/* 4. Upcoming Booking Highlight Card */}
      {upcomingBooking && (
        <div className="bg-white rounded-3xl border-2 border-primary-200/80 p-5 sm:p-6 shadow-card relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center font-extrabold text-sm flex-shrink-0">
                {upcomingBooking.serviceCategory.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <span className="text-[11px] font-bold text-primary-600 uppercase tracking-wider block">
                  Next Scheduled Appointment
                </span>
                <h4 className="text-base sm:text-lg font-bold text-neutral-900">
                  {upcomingBooking.serviceTitle}
                </h4>
              </div>
            </div>

            <span
              className={`text-xs font-bold px-3 py-1 rounded-full border ${
                BOOKING_STATUS_CONFIG[upcomingBooking.status].badgeClass
              }`}
            >
              {BOOKING_STATUS_CONFIG[upcomingBooking.status].label}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
            <div>
              <span className="text-neutral-400 block font-medium">Provider</span>
              <p className="text-neutral-900 font-bold mt-0.5">{upcomingBooking.provider.name}</p>
            </div>
            <div>
              <span className="text-neutral-400 block font-medium">Appointment Slot</span>
              <p className="text-neutral-900 font-bold mt-0.5">
                {upcomingBooking.date} at {upcomingBooking.time}
              </p>
            </div>
            <div>
              <span className="text-neutral-400 block font-medium">Service Address</span>
              <p className="text-neutral-900 font-bold mt-0.5 truncate">
                {upcomingBooking.address.area}, {upcomingBooking.address.city}
              </p>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-neutral-400 uppercase font-medium">Estimated Amount</span>
              <span className="text-base font-extrabold text-neutral-900 block">
                ₹{upcomingBooking.finalCost || upcomingBooking.estimatedCost}
              </span>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate(`/customer/bookings/${upcomingBooking.id}`)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Track Booking
            </Button>
          </div>
        </div>
      )}

      {/* 5. Recent Bookings Section */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-neutral-900">Recent Service Bookings</h3>
            <p className="text-xs text-neutral-500">Your recent appointments and request activity</p>
          </div>
          <Link
            to="/customer/bookings"
            className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            View all ({bookings.length}) <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-8 text-neutral-400 text-xs">
            No bookings recorded yet.{' '}
            <Link to="/customer/services" className="text-primary-600 font-bold">
              Book a service now
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {bookings.slice(0, 4).map((b) => (
              <div
                key={b.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50/60 p-2 rounded-xl transition-colors cursor-pointer"
                onClick={() => navigate(`/customer/bookings/${b.id}`)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-xs font-bold text-neutral-700">
                    {b.serviceCategory.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-neutral-900">{b.serviceTitle}</h5>
                    <p className="text-xs text-neutral-500">
                      {b.provider.name} · {b.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-neutral-900 block">
                      ₹{b.finalCost || b.estimatedCost}
                    </span>
                    <span className="text-[10px] text-neutral-400">{b.paymentStatus}</span>
                  </div>
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                      BOOKING_STATUS_CONFIG[b.status].badgeClass
                    }`}
                  >
                    {BOOKING_STATUS_CONFIG[b.status].label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
