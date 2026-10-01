import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarCheck2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CreditCard,
  Star,
  ArrowRight,
  Filter,
  Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { bookingService } from '../../services/api';
import { Booking, BookingStatus } from '../../types';
import { BOOKING_STATUS_CONFIG } from '../../constants/bookingStatusConfig';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { BookingCardSkeleton } from '../../components/common/Skeletons';

export const CustomerBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadBookings = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const data = await bookingService.getBookings('CUSTOMER', user.id);
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [user]);

  // Tab Filtering
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'PENDING') return b.status === 'PENDING';
    if (activeTab === 'ACTIVE') return ['ACCEPTED', 'SCHEDULED', 'ON_THE_WAY', 'IN_PROGRESS'].includes(b.status);
    if (activeTab === 'COMPLETED') return ['COMPLETED', 'PAID', 'REVIEWED'].includes(b.status);
    if (activeTab === 'CANCELLED') return b.status === 'CANCELLED';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-5 sm:p-6 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
            My Service Bookings
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Track status, approve final costs, record payments, and rate completed services.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/customer/services')}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Book New Service
        </Button>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {(
            [
              { key: 'ALL', label: 'All Bookings' },
              { key: 'PENDING', label: 'Pending' },
              { key: 'ACTIVE', label: 'Active Progress' },
              { key: 'COMPLETED', label: 'Completed' },
              { key: 'CANCELLED', label: 'Cancelled' },
            ] as const
          ).map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === t.key
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200/80'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search booking # or provider..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-neutral-300 focus:border-primary-500 outline-none bg-white"
          />
        </div>
      </div>

      {/* Booking Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <BookingCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <EmptyState
          title="No bookings yet"
          description="Book a local service and your appointments and real-time status transitions will appear here."
          actionLabel="Find a Service"
          onAction={() => navigate('/customer/services')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBookings.map((booking) => {
            const config = BOOKING_STATUS_CONFIG[booking.status];
            const isPendingCostReview =
              booking.finalCost && booking.finalCostStatus === 'PENDING_APPROVAL';

            return (
              <div
                key={booking.id}
                className="bg-white rounded-3xl border border-neutral-200/90 p-5 shadow-card hover:border-primary-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top info */}
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-neutral-100">
                    <div>
                      <span className="text-[10px] font-mono text-neutral-400 uppercase font-semibold">
                        {booking.bookingNumber}
                      </span>
                      <h3 className="font-bold text-base text-neutral-900 mt-0.5">
                        {booking.serviceTitle}
                      </h3>
                      <p className="text-xs text-neutral-500">
                        Provider: <strong className="text-neutral-800">{booking.provider.name}</strong>
                      </p>
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border whitespace-nowrap ${config.badgeClass}`}
                    >
                      {config.label}
                    </span>
                  </div>

                  {/* Warning banner if final price requires approval */}
                  {isPendingCostReview && (
                    <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-semibold">
                        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        Final price: ₹{booking.finalCost} awaits your approval
                      </div>
                      <span className="text-[10px] underline font-bold">Review</span>
                    </div>
                  )}

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-3.5 text-xs text-neutral-600">
                    <div>
                      <span className="text-[10px] text-neutral-400 block font-medium">Scheduled Date</span>
                      <p className="font-bold text-neutral-800 mt-0.5">
                        {booking.date} at {booking.time}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 block font-medium">Location</span>
                      <p className="font-bold text-neutral-800 mt-0.5 truncate">
                        {booking.address.area}, {booking.address.city}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Cost & Action Buttons */}
                <div className="mt-5 pt-3.5 border-t border-neutral-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-neutral-400 block uppercase font-medium">
                      {booking.finalCost ? 'Final Cost' : 'Estimated Cost'}
                    </span>
                    <span className="text-base font-black text-neutral-900">
                      ₹{booking.finalCost || booking.estimatedCost}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* View Details */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/customer/bookings/${booking.id}`)}
                    >
                      View Details
                    </Button>

                    {/* Pay Button if Completed and Unpaid */}
                    {booking.status === 'COMPLETED' && booking.paymentStatus === 'UNPAID' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate(`/customer/bookings/${booking.id}#payment`)}
                        leftIcon={<CreditCard className="w-3.5 h-3.5" />}
                      >
                        Record Pay
                      </Button>
                    )}

                    {/* Review Button if Paid and not yet reviewed */}
                    {booking.status === 'PAID' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate(`/customer/bookings/${booking.id}#review`)}
                        leftIcon={<Star className="w-3.5 h-3.5" />}
                      >
                        Write Review
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
