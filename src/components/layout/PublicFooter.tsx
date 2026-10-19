import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ShieldCheck, Clock, MapPin, Phone, Mail, Heart } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-neutral-900 text-neutral-300 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-sm">
                <Zap className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                SERVICE<span className="text-primary-500">HUB</span>
              </span>
            </Link>
            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
              India's trusted on-demand electrician platform. Post your electrical problem and connect with
              verified local electricians in Mathura, Vrindavan, Agra and Delhi NCR.
            </p>
            <div className="flex items-center gap-4 text-xs text-neutral-400 pt-2">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> 100% Verified
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary-400" /> On-Time Guarantee
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" /> Area Matched
              </span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Electrical Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/customer/book-service?problem=el-wiring" className="hover:text-white transition-colors">
                  Wiring & Short Circuit
                </Link>
              </li>
              <li>
                <Link to="/customer/book-service?problem=el-mcb" className="hover:text-white transition-colors">
                  MCB & Switchboard
                </Link>
              </li>
              <li>
                <Link to="/customer/book-service?problem=el-fan" className="hover:text-white transition-colors">
                  Fan & Regulator
                </Link>
              </li>
              <li>
                <Link to="/customer/book-service?problem=el-inverter" className="hover:text-white transition-colors">
                  Inverter & Battery
                </Link>
              </li>
              <li>
                <Link to="/customer/book-service?problem=el-lighting" className="hover:text-white transition-colors">
                  Lighting & Fittings
                </Link>
              </li>
            </ul>
          </div>

          {/* For Customers & Providers */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/customer/services" className="hover:text-white transition-colors">
                  Find an Electrician
                </Link>
              </li>
              <li>
                <Link to="/become-provider" className="hover:text-white transition-colors">
                  Become an Electrician Partner
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Electrician Portal
                </Link>
              </li>
              <li>
                <Link to="/customer/requests" className="hover:text-white transition-colors">
                  Track My Requests
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Support & Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2 text-neutral-400">
                <Mail className="w-4 h-4 text-primary-400" />
                <span>support@servicehub.in</span>
              </li>
              <li className="flex items-center gap-2 text-neutral-400">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>+91 (0565) 240-0199</span>
              </li>
              <li className="pt-2">
                <a href="#privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© 2026 ServiceHub Technologies Pvt. Ltd. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> by Payal Sharma
          </p>
        </div>
      </div>
    </footer>
  );
};
