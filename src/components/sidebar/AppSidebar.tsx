import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  CalendarCheck2,
  CreditCard,
  Star,
  User,
  Settings,
  Inbox,
  Clock,
  MapPin,
  TrendingUp,
  Users,
  ShieldCheck,
  Tag,
  AlertTriangle,
  BarChart3,
  LogOut,
  Wrench,
  HelpCircle,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ isOpen, onClose }) => {
  const { role, user, logout } = useAuth();
  const navigate = useNavigate();

  const customerNav = [
    { label: 'Home', path: '/customer/dashboard', icon: LayoutDashboard },
    { label: 'My Requests', path: '/customer/requests', icon: Inbox },
    { label: 'Active Job', path: '/customer/requests?tab=ongoing', icon: Clock },
    { label: 'Completed', path: '/customer/requests?tab=completed', icon: CalendarCheck2 },
    { label: 'Profile', path: '/customer/profile', icon: User },
  ];

  const providerNav = [
    { label: 'Dashboard', path: '/provider/dashboard', icon: LayoutDashboard },
    { label: 'Job Requests', path: '/provider/requests', icon: Inbox },
    { label: 'My Jobs', path: '/provider/bookings', icon: CalendarCheck2 },
    { label: 'Completed', path: '/provider/bookings?tab=completed', icon: Clock },
    { label: 'Profile', path: '/provider/profile', icon: User },
  ];

  const adminNav = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'User Directory', path: '/admin/users', icon: Users },
    { label: 'All Providers', path: '/admin/providers', icon: Wrench },
    { label: 'Verification Queue', path: '/admin/provider-verification', icon: ShieldCheck },
    { label: 'Service Categories', path: '/admin/services', icon: Tag },
    { label: 'Global Bookings', path: '/admin/bookings', icon: CalendarCheck2 },
    { label: 'Complaints & SLA', path: '/admin/complaints', icon: AlertTriangle },
    { label: 'Analytics Reports', path: '/admin/reports', icon: BarChart3 },
    { label: 'System Settings', path: '/admin/settings', icon: Settings },
  ];

  const navLinks = role === 'ADMIN' ? adminNav : role === 'PROVIDER' ? providerNav : customerNav;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-neutral-200/90 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-10 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Header */}
          <div className="h-16 px-6 flex items-center gap-3 border-b border-neutral-100 flex-shrink-0">
            <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-xs">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-neutral-900">
                SERVICE<span className="text-primary-600">HUB</span>
              </span>
              <span className="block text-[10px] text-neutral-400 -mt-0.5 tracking-wide">
                {role === 'ADMIN' ? 'Control Center' : role === 'PROVIDER' ? 'Partner Portal' : 'Customer Workspace'}
              </span>
            </div>
          </div>

          {/* Primary CTA Button (Section 12) */}
          <div className="p-4 pb-2">
            {role === 'CUSTOMER' && (
              <button
                onClick={() => {
                  navigate('/customer/book-service');
                  onClose();
                }}
                className="w-full py-2.5 px-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md shadow-primary-600/20 flex items-center justify-center gap-2 transition-all"
              >
                <span>+ Post Request</span>
              </button>
            )}

            {role === 'PROVIDER' && (
              <button
                onClick={() => {
                  navigate('/provider/requests');
                  onClose();
                }}
                className="w-full py-2.5 px-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                <span>View Available Requests</span>
              </button>
            )}
          </div>

          {/* Nav List */}
          <nav className="p-4 pt-1 space-y-1">
            <div className="px-3 pb-2 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              Navigation
            </div>
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => onClose()}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 shadow-xs border border-primary-100/80 font-bold'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Card at bottom of sidebar */}
        <div className="p-4 border-t border-neutral-100 bg-neutral-50/50">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-neutral-200/80 shadow-xs">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
              alt={user?.name}
              className="w-9 h-9 rounded-xl object-cover border border-neutral-200"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-neutral-900 truncate">{user?.name || 'Guest User'}</p>
              <p className="text-[10px] text-neutral-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              title="Sign Out"
              className="text-neutral-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
