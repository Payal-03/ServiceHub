import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ShieldCheck, Clock, ThumbsUp } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-900 text-neutral-300 border-t border-neutral-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <span className="font-extrabold text-xl text-white">
                Service<span className="text-primary-500">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-neutral-400 max-w-sm">
              Connecting households with verified, skilled electricians for fan repair, wiring, switchboards, and electrical installations.
            </p>
            <div className="flex items-center gap-4 text-xs text-neutral-400 pt-2">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-4 h-4" /> Verified Pros
              </span>
              <span className="flex items-center gap-1 text-sky-400">
                <Clock className="w-4 h-4" /> Quick Bids
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <ThumbsUp className="w-4 h-4" /> Mutual Ratings
              </span>
            </div>
          </div>

          {/* Customer Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">For Customers</h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <Link to="/customer/create-request" className="hover:text-white transition-colors">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link to="/customer/requests" className="hover:text-white transition-colors">
                  My Requests
                </Link>
              </li>
              <li>
                <Link to="/register?role=customer" className="hover:text-white transition-colors">
                  Customer Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Electrician Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">For Electricians</h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <Link to="/electrician/jobs" className="hover:text-white transition-colors">
                  Browse Open Jobs
                </Link>
              </li>
              <li>
                <Link to="/register?role=electrician" className="hover:text-white transition-colors">
                  Join as Electrician
                </Link>
              </li>
              <li>
                <Link to="/electrician/profile" className="hover:text-white transition-colors">
                  Electrician Profile
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>© {new Date().getFullYear()} ServiceHub. Built with Spring Boot & React.</p>
          <p className="text-neutral-400">Simple, transparent household electrical repairs.</p>
        </div>
      </div>
    </footer>
  );
};
