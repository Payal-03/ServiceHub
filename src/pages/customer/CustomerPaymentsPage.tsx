import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, Download, ExternalLink, Calendar, Search } from 'lucide-react';
import { paymentService } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/Skeletons';

export const CustomerPaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const list = await paymentService.getPayments();
        setPayments(list);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const filtered = payments.filter(
    (p) =>
      p.bookingNumber?.toLowerCase().includes(search.toLowerCase()) ||
      p.service?.toLowerCase().includes(search.toLowerCase()) ||
      p.providerName?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPaid = payments.reduce((acc, cur) => acc + (cur.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
            Payments & Receipts
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Verified in-system payment records and settlements with service providers.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-neutral-400 block uppercase font-medium">Total Paid Out</span>
          <span className="text-2xl font-black text-neutral-900">₹{totalPaid.toLocaleString()}</span>
        </div>
      </div>

      {/* Filter / Search */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search booking number or provider..."
            className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 focus:border-primary-500 outline-none bg-white"
          />
        </div>
      </div>

      {/* Payments Table */}
      {isLoading ? (
        <TableSkeleton rows={4} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No payment records found"
          description="Your completed service payment history and receipts will be recorded here."
          icon={CreditCard}
        />
      ) : (
        <div className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/80 border-b border-neutral-100 text-neutral-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-5">Booking Ref</th>
                  <th className="py-3.5 px-4">Service</th>
                  <th className="py-3.5 px-4">Provider</th>
                  <th className="py-3.5 px-4">Settled Date</th>
                  <th className="py-3.5 px-4">Method</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map((item, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3.5 px-5 font-mono font-bold text-neutral-900">
                      {item.bookingNumber}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-neutral-800">{item.service}</td>
                    <td className="py-3.5 px-4 text-neutral-600">{item.providerName}</td>
                    <td className="py-3.5 px-4 text-neutral-500">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-md font-medium text-[11px]">
                        {item.method?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-neutral-900">
                      ₹{item.amount}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Settled
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
