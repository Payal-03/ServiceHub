import React, { useState, useEffect } from 'react';
import { TrendingUp, CreditCard, CheckCircle2, ArrowUpRight, Calendar, DollarSign } from 'lucide-react';
import { bookingService } from '../../services/api';
import { Booking } from '../../types';
import { TableSkeleton } from '../../components/common/Skeletons';

export const ProviderEarningsPage: React.FC = () => {
  const [completedJobs, setCompletedJobs] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const all = await bookingService.getBookings('PROVIDER', 'prov-1');
        setCompletedJobs(all.filter((b) => b.paymentStatus === 'PAID'));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEarnings();
  }, []);

  const totalEarned = completedJobs.reduce(
    (acc, cur) => acc + (cur.finalCost || cur.estimatedCost),
    0
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
            Earnings & Settlement Records
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Complete log of completed service appointments settled in-system.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-neutral-400 block uppercase font-medium">
            Total Revenue Earned
          </span>
          <span className="text-2xl font-black text-neutral-900">
            ₹{totalEarned.toLocaleString()}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-subtle">
          <span className="text-xs text-neutral-500 font-medium">Settled Jobs</span>
          <span className="text-2xl font-black text-neutral-900 mt-1 block">
            {completedJobs.length}
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold">100% Direct Payout</span>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-subtle">
          <span className="text-xs text-neutral-500 font-medium">Average Ticket Size</span>
          <span className="text-2xl font-black text-primary-600 mt-1 block">
            ₹{completedJobs.length > 0 ? Math.round(totalEarned / completedJobs.length) : 0}
          </span>
          <span className="text-[10px] text-neutral-400">Per completed booking</span>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-subtle">
          <span className="text-xs text-neutral-500 font-medium">Platform Fee</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">₹0</span>
          <span className="text-[10px] text-emerald-600 font-semibold">0% Commission tier</span>
        </div>
      </div>

      {/* Earnings Table */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-subtle">
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-neutral-900">Settlement Ledger</h3>
          <span className="text-xs text-neutral-400">{completedJobs.length} records</span>
        </div>

        {isLoading ? (
          <TableSkeleton rows={4} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-5">Booking Ref</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-5 text-right">Earned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {completedJobs.map((j) => (
                  <tr key={j.id} className="hover:bg-neutral-50/60">
                    <td className="py-3.5 px-5 font-mono font-bold text-neutral-900">
                      {j.bookingNumber}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-neutral-800">{j.customer.name}</td>
                    <td className="py-3.5 px-4 text-neutral-600">{j.serviceTitle}</td>
                    <td className="py-3.5 px-4 text-neutral-500">{j.date}</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-md font-medium text-[10px]">
                        {j.paymentMethod?.replace(/_/g, ' ') || 'CASH RECORDED'}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right font-black text-neutral-900 text-sm">
                      ₹{j.finalCost || j.estimatedCost}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
