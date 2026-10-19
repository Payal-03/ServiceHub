import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarCheck2,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  AlertCircle,
  FileText,
  MapPin,
  Clock,
  User
} from 'lucide-react';
import { bookingService } from '../../services/api';
import { Booking, BookingStatus } from '../../types';
import { BOOKING_STATUS_CONFIG } from '../../constants/bookingStatusConfig';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { BookingTimeline } from '../../components/booking/BookingTimeline';
import { TableSkeleton } from '../../components/common/Skeletons';

export const AdminBookingsPage: React.FC = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState<'ALL' | BookingStatus>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Detail Modal
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const data = await bookingService.getBookings();
        setBookings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filtered = bookings.filter((b) => {
    const matchSearch =
      b.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchSearch) return false;
    if (statusFilter !== 'ALL' && b.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
            Platform Master Bookings Ledger
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Full audit log of all bookings across customers and service providers in all jurisdictions.
          </p>
        </div>

        <span className="text-xs font-bold text-neutral-600 bg-neutral-100 px-3 py-1.5 rounded-full">
          Total: {bookings.length} orders
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-subtle">
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-xs font-semibold p-1.5 px-2 rounded-xl border border-neutral-300 bg-neutral-50 outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="ON_THE_WAY">On The Way</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="PAID">Paid</option>
            <option value="REVIEWED">Reviewed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search booking ref, customer, provider..."
            className="w-full text-xs pl-9 pr-3 py-1.5 rounded-xl border border-neutral-300 focus:border-primary-500 outline-none"
          />
        </div>
      </div>

      {/* Bookings Table */}
      {isLoading ? (
        <TableSkeleton rows={6} />
      ) : (
        <div className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/80 border-b border-neutral-100 text-neutral-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-5">Booking Ref</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Provider</th>
                  <th className="py-3.5 px-4">Service</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Est. Cost</th>
                  <th className="py-3.5 px-4">Final Cost</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map((b) => {
                  const config = BOOKING_STATUS_CONFIG[b.status];
                  return (
                    <tr
                      key={b.id}
                      onClick={() => setSelectedBooking(b)}
                      className="hover:bg-neutral-50/60 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-5 font-mono font-bold text-neutral-900">
                        {b.bookingNumber}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-neutral-800">{b.customer.name}</td>
                      <td className="py-3.5 px-4 text-neutral-600">{b.provider.name}</td>
                      <td className="py-3.5 px-4 text-neutral-700">{b.serviceTitle}</td>
                      <td className="py-3.5 px-4 text-neutral-500 whitespace-nowrap">{b.date}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${config.badgeClass}`}
                        >
                          {config.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-neutral-700">₹{b.estimatedCost}</td>
                      <td className="py-3.5 px-4 font-black text-neutral-900">
                        {b.finalCost ? `₹${b.finalCost}` : '—'}
                      </td>
                      <td className="py-3.5 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="p-1.5 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors font-semibold"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Booking Detail Modal / Drawer */}
      <Modal
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title={`Audit: ${selectedBooking?.bookingNumber}`}
        subtitle={selectedBooking?.serviceTitle}
        maxWidth="lg"
        footer={
          <Button variant="outline" size="sm" onClick={() => setSelectedBooking(null)}>
            Close
          </Button>
        }
      >
        {selectedBooking && (
          <div className="space-y-4">
            <BookingTimeline currentStatus={selectedBooking.status} booking={selectedBooking} compact />

            <div className="grid grid-cols-2 gap-3 text-xs bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
              <div>
                <span className="text-neutral-400 block font-medium">Customer</span>
                <span className="font-bold text-neutral-900">{selectedBooking.customer.name}</span>
                <p className="text-[11px] text-neutral-500">{selectedBooking.customer.phone}</p>
              </div>

              <div>
                <span className="text-neutral-400 block font-medium">Provider</span>
                <span className="font-bold text-neutral-900">{selectedBooking.provider.name}</span>
                <p className="text-[11px] text-neutral-500">{selectedBooking.provider.phone}</p>
              </div>

              <div>
                <span className="text-neutral-400 block font-medium">Service Address</span>
                <span className="font-bold text-neutral-900">
                  {selectedBooking.address.area}, {selectedBooking.address.city}
                </span>
                <p className="text-[11px] text-neutral-500">{selectedBooking.address.street}</p>
              </div>

              <div>
                <span className="text-neutral-400 block font-medium">Payment Settlement</span>
                <span className="font-bold text-neutral-900">{selectedBooking.paymentStatus}</span>
                <p className="text-[11px] text-neutral-500">
                  Amount: ₹{selectedBooking.finalCost || selectedBooking.estimatedCost}
                </p>
              </div>
            </div>

            {selectedBooking.finalCostReason && (
              <div className="p-3 rounded-xl bg-amber-50 text-amber-900 text-xs border border-amber-200">
                <strong>Cost Adjustment Reason:</strong> {selectedBooking.finalCostReason}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
