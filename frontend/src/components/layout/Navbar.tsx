import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Menu, X, LogOut, User as UserIcon, PlusCircle, Briefcase, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { NotificationBell } from './NotificationBell';

export const Navbar: React.FC = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-sm shadow-primary-600/30 group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-neutral-900">
            Service<span className="text-primary-600">Hub</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600">
          <Link to="/" className="hover:text-primary-600 transition-colors">
            Home
          </Link>

          {role === 'CUSTOMER' && (
            <>
              <Link to="/customer/requests" className="hover:text-primary-600 transition-colors flex items-center gap-1.5">
                <FileText className="w-4 h-4" /> My Requests
              </Link>
              <Link to="/customer/profile" className="hover:text-primary-600 transition-colors flex items-center gap-1.5">
                <UserIcon className="w-4 h-4" /> My Profile
              </Link>
              <Link to="/customer/create-request" className="hover:text-primary-600 transition-colors flex items-center gap-1.5 text-primary-600 font-semibold">
                <PlusCircle className="w-4 h-4" /> Post a Job
              </Link>
            </>
          )}

          {role === 'ELECTRICIAN' && (
            <>
              <Link to="/electrician/jobs" className="hover:text-primary-600 transition-colors flex items-center gap-1.5">
                <Briefcase className="w-4 h-4" /> Browse Jobs
              </Link>
              <Link to="/electrician/my-jobs" className="hover:text-primary-600 transition-colors flex items-center gap-1.5">
                <FileText className="w-4 h-4" /> My Applications
              </Link>
              <Link to="/electrician/profile" className="hover:text-primary-600 transition-colors flex items-center gap-1.5">
                <UserIcon className="w-4 h-4" /> My Profile
              </Link>
            </>
          )}
        </nav>

        {/* User / Auth Controls */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <NotificationBell />

              <Link
                to={role === 'CUSTOMER' ? '/customer/profile' : '/electrician/profile'}
                className="flex items-center gap-2 text-sm bg-neutral-100 hover:bg-neutral-200/80 transition-colors px-3 py-1.5 rounded-full border border-neutral-200"
                title="View your profile"
              >
                <span className="font-semibold text-neutral-800">{user.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-primary-100 text-primary-700">
                  {role}
                </span>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                leftIcon={<LogOut className="w-4 h-4" />}
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Sign In
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate('/register')}>
                Register
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/customer/create-request')}
                leftIcon={<PlusCircle className="w-4 h-4" />}
              >
                Post a Job
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle & Notification Bell */}
        <div className="md:hidden flex items-center gap-1 sm:gap-2">
          {user && <NotificationBell />}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-neutral-700 hover:text-primary-600"
          >
            Home
          </Link>

          {role === 'CUSTOMER' && (
            <>
              <Link
                to="/customer/requests"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-base font-medium text-neutral-700 hover:text-primary-600"
              >
                My Requests
              </Link>
              <Link
                to="/customer/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-base font-medium text-neutral-700 hover:text-primary-600"
              >
                My Profile & Ratings
              </Link>
              <Link
                to="/customer/create-request"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-base font-medium text-primary-600"
              >
                + Post a Job
              </Link>
            </>
          )}

          {role === 'ELECTRICIAN' && (
            <>
              <Link
                to="/electrician/jobs"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-base font-medium text-neutral-700 hover:text-primary-600"
              >
                Browse Jobs
              </Link>
              <Link
                to="/electrician/my-jobs"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-base font-medium text-neutral-700 hover:text-primary-600"
              >
                My Applications
              </Link>
              <Link
                to="/electrician/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-base font-medium text-neutral-700 hover:text-primary-600"
              >
                My Profile
              </Link>
            </>
          )}

          <div className="pt-3 border-t border-neutral-100">
            {user ? (
              <div className="space-y-3">
                <div className="text-sm text-neutral-600">
                  Signed in as <span className="font-semibold text-neutral-900">{user.name}</span> ({role})
                </div>
                <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}>
                  Sign In
                </Button>
                <Button variant="primary" size="sm" onClick={() => { setMobileMenuOpen(false); navigate('/register'); }}>
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
