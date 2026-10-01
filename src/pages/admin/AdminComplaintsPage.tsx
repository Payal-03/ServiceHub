import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, Clock, XCircle, Search, MessageSquare } from 'lucide-react';
import { complaintService } from '../../services/api';
import { Complaint, ComplaintStatus } from '../../types';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/Skeletons';

export const AdminComplaintsPage: React.FC = () => {
  const { showToast } = useToast();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [adminNotesInput, setAdminNotesInput] = useState('');
  const [resolutionInput, setResolutionInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const loadComplaints = async () => {
    try {
      setIsLoading(true);
      const data = await complaintService.getAllComplaints();
      setComplaints(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const handleOpenDetail = (c: Complaint) => {
    setSelectedComplaint(c);
    setAdminNotesInput(c.adminNotes || '');
    setResolutionInput(c.resolution || '');
  };

  const handleUpdateStatus = async (status: ComplaintStatus) => {
    if (!selectedComplaint) return;
    setIsProcessing(true);
    try {
      await complaintService.updateComplaintStatus(
        selectedComplaint.id,
        status,
        adminNotesInput,
        resolutionInput
      );
      showToast(`Complaint status updated to ${status}.`, 'success');
      setSelectedComplaint(null);
      await loadComplaints();
    } catch (err: any) {
      showToast(err.message || 'Failed to update complaint', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
            Customer Grievances & Service Complaints
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Resolve dispute tickets, pricing reviews, and dispatch SLA complaints.
          </p>
        </div>

        <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
          {complaints.filter((c) => c.status !== 'CLOSED').length} Active Issues
        </span>
      </div>

      {isLoading ? (
        <TableSkeleton rows={4} />
      ) : complaints.length === 0 ? (
        <EmptyState
          title="No active complaints"
          description="There are currently no reported customer grievances or dispute tickets."
          icon={AlertTriangle}
        />
      ) : (
        <div className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/80 border-b border-neutral-100 text-neutral-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-5">Ticket ID</th>
                  <th className="py-3.5 px-4">Subject</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Provider</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {complaints.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => handleOpenDetail(c)}
                    className="hover:bg-neutral-50/60 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-5 font-mono font-bold text-neutral-900">
                      #{c.id}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-neutral-900 max-w-xs truncate">
                      {c.subject}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-600">{c.customerName}</td>
                    <td className="py-3.5 px-4 text-neutral-600">{c.providerName}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          c.priority === 'HIGH'
                            ? 'bg-rose-100 text-rose-800'
                            : c.priority === 'MEDIUM'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        {c.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          c.status === 'RESOLVED' || c.status === 'CLOSED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : c.status === 'UNDER_REVIEW'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {c.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                      <Button variant="outline" size="sm" onClick={() => handleOpenDetail(c)}>
                        Manage Ticket
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Complaint Detail & Resolution Modal */}
      <Modal
        isOpen={!!selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        title={selectedComplaint ? `Ticket #${selectedComplaint.id}: ${selectedComplaint.subject}` : ''}
        maxWidth="lg"
        footer={
          <div className="flex items-center justify-between w-full">
            <Button variant="outline" size="sm" onClick={() => setSelectedComplaint(null)}>
              Cancel
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                isLoading={isProcessing}
                onClick={() => handleUpdateStatus('UNDER_REVIEW')}
              >
                Mark Under Review
              </Button>
              <Button
                variant="primary"
                size="sm"
                isLoading={isProcessing}
                onClick={() => handleUpdateStatus('RESOLVED')}
              >
                Resolve Ticket
              </Button>
              <Button
                variant="success"
                size="sm"
                isLoading={isProcessing}
                onClick={() => handleUpdateStatus('CLOSED')}
              >
                Close Ticket
              </Button>
            </div>
          </div>
        }
      >
        {selectedComplaint && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100">
              <div>
                <span className="text-neutral-400 block font-medium">Customer</span>
                <span className="font-bold text-neutral-900">{selectedComplaint.customerName}</span>
              </div>
              <div>
                <span className="text-neutral-400 block font-medium">Reported Provider</span>
                <span className="font-bold text-neutral-900">{selectedComplaint.providerName}</span>
              </div>
            </div>

            <div>
              <span className="text-neutral-400 block font-medium mb-1">Issue Description</span>
              <p className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 text-neutral-800 leading-relaxed italic">
                "{selectedComplaint.description}"
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Internal Administrator Notes
              </label>
              <textarea
                rows={2}
                value={adminNotesInput}
                onChange={(e) => setAdminNotesInput(e.target.value)}
                placeholder="Log internal investigations, calls with provider or customer..."
                className="w-full p-2.5 rounded-xl border border-neutral-300 focus:border-primary-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Official Resolution / Outcome
              </label>
              <textarea
                rows={2}
                value={resolutionInput}
                onChange={(e) => setResolutionInput(e.target.value)}
                placeholder="State how the complaint was resolved..."
                className="w-full p-2.5 rounded-xl border border-neutral-300 focus:border-primary-500 outline-none"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
