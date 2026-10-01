import React from 'react';
import { BarChart3, Download, TrendingUp, ShieldCheck, Users, Calendar, DollarSign } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const AdminReportsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
            Financial & Operational Reports
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Export monthly settlement summaries, provider compliance audits, and booking analytics.
          </p>
        </div>

        <Button variant="outline" size="md" leftIcon={<Download className="w-4 h-4" />}>
          Export Master CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-card space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-neutral-900">Gross Settlement Report</h3>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Itemized breakdown of all in-system recorded transactions, average booking order values, and final price variance logs.
          </p>
          <div className="pt-2">
            <Button variant="outline" size="sm" className="w-full">
              Download Oct 2026 Statement
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-card space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-neutral-900">Provider Quality & Compliance</h3>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Audit logs of identity verifications, SLA response latencies, cancellation trends, and 5-star customer feedback averages.
          </p>
          <div className="pt-2">
            <Button variant="outline" size="sm" className="w-full">
              Download Compliance Audit
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-card space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-neutral-900">Territory Growth Metrics</h3>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Customer density analysis across Mathura, Vrindavan, Agra, and Delhi postal pincodes to identify supply shortage zones.
          </p>
          <div className="pt-2">
            <Button variant="outline" size="sm" className="w-full">
              Download Territory Analysis
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
