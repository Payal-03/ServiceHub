import React, { useState, useEffect } from 'react';
import { Users, Search, Shield, Ban, CheckCircle2, UserCheck, AlertCircle } from 'lucide-react';
import { userService } from '../../services/api';
import { User, UserRole, UserStatus } from '../../types';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';
import { TableSkeleton } from '../../components/common/Skeletons';

export const AdminUsersPage: React.FC = () => {
  const { showToast } = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [roleFilter, setRoleFilter] = useState<'ALL' | UserRole>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | UserStatus>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Block / Unblock Modal
  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleBlock = async () => {
    if (!targetUser) return;
    setIsProcessing(true);
    const nextStatus: UserStatus = targetUser.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    try {
      await userService.updateUserStatus(targetUser.id, nextStatus);
      showToast(
        `User ${targetUser.name} has been ${nextStatus === 'BLOCKED' ? 'suspended' : 'unblocked'}.`,
        nextStatus === 'BLOCKED' ? 'warning' : 'success'
      );
      setConfirmModalOpen(false);
      setTargetUser(null);
      await loadUsers();
    } catch (err: any) {
      showToast(err.message || 'Action failed', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.includes(searchTerm);

    if (!matchesSearch) return false;
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    if (statusFilter !== 'ALL' && u.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
            User Directory & Access Control
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Manage customer, provider, and administrator identities, authorization, and account security.
          </p>
        </div>

        <span className="text-xs font-bold text-neutral-600 bg-neutral-100 px-3 py-1.5 rounded-full">
          Total: {users.length} registered
        </span>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-subtle">
        <div className="flex flex-wrap items-center gap-3">
          {/* Role Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-neutral-500 font-medium">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="text-xs font-semibold p-1.5 px-2 rounded-xl border border-neutral-300 bg-neutral-50 outline-none cursor-pointer"
            >
              <option value="ALL">All Roles</option>
              <option value="CUSTOMER">Customers</option>
              <option value="PROVIDER">Providers</option>
              <option value="ADMIN">Admins</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-neutral-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="text-xs font-semibold p-1.5 px-2 rounded-xl border border-neutral-300 bg-neutral-50 outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active Only</option>
              <option value="BLOCKED">Blocked Only</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search name, email, phone..."
            className="w-full text-xs pl-9 pr-3 py-1.5 rounded-xl border border-neutral-300 focus:border-primary-500 outline-none"
          />
        </div>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : (
        <div className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/80 border-b border-neutral-100 text-neutral-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-5">User</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Contact Phone</th>
                  <th className="py-3.5 px-4">Joined Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                          alt={u.name}
                          className="w-9 h-9 rounded-xl object-cover border border-neutral-200"
                        />
                        <div>
                          <span className="font-bold text-neutral-900 block">{u.name}</span>
                          <span className="text-[11px] text-neutral-500">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                          u.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-700'
                            : u.role === 'PROVIDER'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-600">{u.phone}</td>
                    <td className="py-3.5 px-4 text-neutral-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          u.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      {u.role !== 'ADMIN' && (
                        <button
                          onClick={() => {
                            setTargetUser(u);
                            setConfirmModalOpen(true);
                          }}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                            u.status === 'ACTIVE'
                              ? 'text-rose-600 hover:bg-rose-50 border border-rose-200'
                              : 'text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
                          }`}
                        >
                          {u.status === 'ACTIVE' ? 'Suspend' : 'Unblock'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Block / Unblock */}
      <Modal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title={targetUser?.status === 'ACTIVE' ? 'Suspend User Access' : 'Restore User Access'}
        subtitle={`Account: ${targetUser?.email}`}
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setConfirmModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={targetUser?.status === 'ACTIVE' ? 'danger' : 'success'}
              size="sm"
              isLoading={isProcessing}
              onClick={handleToggleBlock}
            >
              {targetUser?.status === 'ACTIVE' ? 'Confirm Suspension' : 'Restore Access'}
            </Button>
          </>
        }
      >
        <p className="text-xs text-neutral-600 leading-relaxed">
          {targetUser?.status === 'ACTIVE'
            ? `Are you sure you want to suspend ${targetUser?.name}? They will be blocked from logging into the platform until restored.`
            : `Are you sure you want to unblock ${targetUser?.name}? They will regain full access to their dashboard.`}
        </p>
      </Modal>
    </div>
  );
};
