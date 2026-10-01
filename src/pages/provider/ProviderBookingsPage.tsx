import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarCheck2,
  Clock,
  CheckCircle2,
  Search,
  Filter,
  User,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { bookingService } from '../../services/api';
import { Booking } from '../../types';
import { BOOKING_STATUS_CONFIG } from '../../constants/bookingStatusConfig';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/Skeletons';

export const ProviderBookingsPage: React.FC = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await bookingService.getBookings('PROVIDER', 'prov-1');
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      {/* Header */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
            Assigned Bookings & Service Jobs
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Manage your service appointments, track status progressions, and submit final costs.
          </p>
        </div>

        <span className="text-xs font-bold text-neutral-600 bg-neutral-100 px-3 py-1.5 rounded-full">
          Total: {bookings.length} jobs
        </span>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {(
            [
              { key: 'ALL', label: 'All Jobs' },
              { key: 'PENDING', label: 'Requests' },
              { key: 'ACTIVE', label: 'Active Progression' },
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
            placeholder="Search customer, booking ref..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-neutral-300 focus:border-primary-500 outline-none bg-white"
          />
        </div>
      </div>

      {/* Table of bookings */}
      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No bookings in this category"
          description="Service appointments matching your filter criteria will appear here."
          icon={CalendarCheck2}
        />
      ) : (
        <div className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/80 border-b border-neutral-100 text-neutral-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-5">Ref / Service</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map((b) => {
                  const config = BOOKING_STATUS_CONFIG[b.status];
                  return (
                    <tr
                      key={b.id}
                      className="hover:bg-neutral-50/60 transition-colors cursor-pointer"
                      onClick={() => navigate(`/provider/bookings/${b.id}`)}
                    >
                      <td className="py-3.5 px-5">
                        <span className="font-mono text-[10px] text-neutral-400 block font-bold">
                          {b.bookingNumber}
                        </span>
                        <span className="font-bold text-neutral-900">{b.serviceTitle}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-neutral-900">{b.customer.name}</div>
                        <div className="text-[11px] text-neutral-500">{b.customer.phone}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-neutral-900 block">{b.date}</span>
                        <span className="text-[11px] text-neutral-500">{b.time}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-neutral-800 block truncate max-w-[130px]">
                          {b.address.area}
                        </span>
                        <span className="text-[11px] text-neutral-400">{b.address.city}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-black text-neutral-900 block">
                          ₹{b.finalCost || b.estimatedCost}
                        </span>
                        <span className="text-[10px] text-neutral-400">{b.paymentStatus}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${config.badgeClass}`}
                        >
                          {config.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/provider/bookings/${b.id}`)}
                        >
                          Manage
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
