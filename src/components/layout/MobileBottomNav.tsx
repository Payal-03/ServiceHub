import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  CalendarCheck2,
  User,
  Inbox,
  Clock,
  Users,
  Wrench,
  Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const MobileBottomNav: React.FC = () => {
  const { role } = useAuth();

  const customerTabs = [
    { label: 'Home', path: '/customer/dashboard', icon: LayoutDashboard },
    { label: 'My Requests', path: '/customer/requests', icon: Inbox },
    { label: 'Active', path: '/customer/requests?tab=ongoing', icon: Clock },
    { label: 'Profile', path: '/customer/profile', icon: User },
  ];

  const providerTabs = [
    { label: 'Dashboard', path: '/provider/dashboard', icon: LayoutDashboard },
    { label: 'Requests', path: '/provider/requests', icon: Inbox },
    { label: 'My Jobs', path: '/provider/bookings', icon: CalendarCheck2 },
    { label: 'Profile', path: '/provider/profile', icon: User },
  ];

  const adminTabs = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Providers', path: '/admin/providers', icon: Wrench },
    { label: 'Bookings', path: '/admin/bookings', icon: CalendarCheck2 },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const tabs = role === 'ADMIN' ? adminTabs : role === 'PROVIDER' ? providerTabs : customerTabs;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200/90 py-1.5 px-2 flex items-center justify-around shadow-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive ? 'text-primary-600 font-bold' : 'text-neutral-500 hover:text-neutral-800'
              }`
            }
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">{tab.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
