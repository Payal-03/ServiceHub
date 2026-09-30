import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  TrendingUp,
  ShieldCheck,
  CalendarCheck,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const BecomeProviderPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="py-12 sm:py-16 bg-neutral-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-600 block">
            Partner With ServiceHub
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight">
            Grow Your Service Business. <br />
            <span className="text-primary-600">Get Direct Customer Bookings.</span>
          </h1>
          <p className="text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Join thousands of professional electricians, technicians, plumbers, and cleaning specialists receiving guaranteed, verified booking requests in Mathura, Agra, Vrindavan, and Delhi NCR.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate('/register?role=provider')}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Register as Provider
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/login')}
            >
              Provider Portal Sign In
            </Button>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-card space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900">Steady Bookings & Higher Earnings</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Eliminate marketing middleman costs. Receive high-intent service requests directly from verified local homeowners.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-card space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900">Flexible Weekly Scheduling</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              You stay in control of your working days and hours. Define your operational weekly schedule and service boundaries easily.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-card space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900">Verified Provider Badge</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Stand out with an official Verified Partner badge, transparent job histories, and genuine 5-star customer reviews.
            </p>
          </div>
        </div>

        {/* Requirements Checklist */}
        <div className="bg-white rounded-3xl border border-neutral-200/90 p-8 shadow-card mb-16">
          <h3 className="text-xl font-bold text-neutral-900 mb-4">
            Simple 3-Step Verification Criteria
          </h3>
          <div className="space-y-4 text-sm text-neutral-700">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>1. Government ID Verification:</strong> Aadhaar Card or PAN card verification for safety.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>2. Trade Experience:</strong> Minimum 1 year of practical repair or maintenance experience in electrical, plumbing, HVAC, or IT hardware.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>3. Quality Commitment:</strong> Adherence to ServiceHub pricing transparency and professional customer courtesy code.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="p-8 rounded-3xl bg-primary-600 text-white text-center space-y-4 shadow-xl">
          <h3 className="text-2xl font-bold">Start earning with ServiceHub today</h3>
          <p className="text-primary-100 text-sm max-w-lg mx-auto">
            Create your provider account in 2 minutes. Our onboarding team reviews and verifies profiles within 24 hours.
          </p>
          <div className="pt-2">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/register?role=provider')}
              className="bg-white text-primary-700 hover:bg-neutral-100 shadow-md font-bold"
            >
              Sign Up As A Provider
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
