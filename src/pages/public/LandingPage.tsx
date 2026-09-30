import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Zap,
  Wrench,
  Wind,
  Laptop,
  Sparkles,
  ShieldCheck,
  Clock,
  CreditCard,
  Star,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Check,
  Calendar,
  Search,
  Activity,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { MOCK_CATEGORIES, MOCK_PROVIDERS } from '../../constants/mockData';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const iconMap: Record<string, React.ReactNode> = {
    Zap: <Zap className="w-6 h-6 text-amber-500" />,
    Wrench: <Wrench className="w-6 h-6 text-blue-500" />,
    Wind: <Wind className="w-6 h-6 text-cyan-500" />,
    Laptop: <Laptop className="w-6 h-6 text-indigo-500" />,
    Sparkles: <Sparkles className="w-6 h-6 text-purple-500" />,
  };

  const steps = [
    {
      num: '01',
      title: 'Choose a Service',
      desc: 'Browse electrical, plumbing, HVAC, laptop, or deep cleaning with transparent base rates.',
      icon: Search,
    },
    {
      num: '02',
      title: 'Find Verified Providers',
      desc: 'Filter providers matching your city, local area, pincode, and verified credentials.',
      icon: ShieldCheck,
    },
    {
      num: '03',
      title: 'Request a Booking',
      desc: 'Specify your problem details, choose preferred date & time slot without phone calls.',
      icon: Calendar,
    },
    {
      num: '04',
      title: 'Track Your Service',
      desc: 'Real-time status: Scheduled → On The Way → In Progress → Work Completed.',
      icon: Clock,
    },
    {
      num: '05',
      title: 'Pay & Review',
      desc: 'Confirm final inspected cost, record settlement in-system, and leave authentic feedback.',
      icon: Star,
    },
  ];

  return (
    <div className="overflow-hidden bg-neutral-50">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
        {/* Soft Background Decorative Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-primary-50/60 to-transparent pointer-events-none -z-10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-48 -left-24 w-96 h-96 bg-indigo-200/25 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headlines and CTAs */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-200/80 text-primary-700 text-xs font-semibold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-primary-600 animate-pulse" />
                Verified Local On-Demand Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-neutral-900 tracking-tight leading-[1.12]">
                Find Trusted Local Services. <br />
                <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-700 bg-clip-text text-transparent">
                  Book With Confidence.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-neutral-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Discover verified electricians, plumbers, AC technicians, laptop repair experts and cleaners available in your area with transparent pricing and live status tracking.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Button
                  size="lg"
                  variant="primary"
                  onClick={() => navigate('/customer/services')}
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                  className="w-full sm:w-auto shadow-md shadow-primary-600/20"
                >
                  Find a Service
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/become-provider')}
                  className="w-full sm:w-auto"
                >
                  Become a Provider
                </Button>
              </div>

              {/* Trust Indicators Pill */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-neutral-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified Credentials</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>No Surprise Charges</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Stage-by-Stage Tracking</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Dashboard Mockup */}
            <div className="lg:col-span-6 relative">
              {/* Glassmorphic Platform Preview Frame */}
              <div className="relative mx-auto max-w-lg lg:max-w-none rounded-3xl p-3 sm:p-5 bg-gradient-to-tr from-white/90 via-white/80 to-primary-50/70 border border-neutral-200/80 shadow-2xl shadow-primary-900/10 backdrop-blur-xl">
                {/* Floating Top Pill: Live Booking Progress */}
                <div className="bg-white rounded-2xl border border-neutral-200/90 p-4 shadow-card mb-4 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                        AC
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-neutral-900">AC Jet Cleaning & Service</h4>
                        <p className="text-[11px] text-neutral-500">Booking #SH-2026-001</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
                      IN PROGRESS
                    </span>
                  </div>

                  {/* Micro Stepper */}
                  <div className="grid grid-cols-4 gap-1.5 pt-3 text-center">
                    <div className="space-y-1">
                      <div className="h-1.5 bg-emerald-500 rounded-full" />
                      <span className="text-[10px] font-semibold text-neutral-600 block">Accepted</span>
                    </div>
                    <div className="space-y-1">
                      <div className="h-1.5 bg-emerald-500 rounded-full" />
                      <span className="text-[10px] font-semibold text-neutral-600 block">Scheduled</span>
                    </div>
                    <div className="space-y-1">
                      <div className="h-1.5 bg-cyan-500 rounded-full" />
                      <span className="text-[10px] font-bold text-cyan-700 block">In Progress</span>
                    </div>
                    <div className="space-y-1">
                      <div className="h-1.5 bg-neutral-200 rounded-full" />
                      <span className="text-[10px] text-neutral-400 block">Completed</span>
                    </div>
                  </div>
                </div>

                {/* Provider Card Preview */}
                <div className="bg-white rounded-2xl border border-neutral-200/90 p-4 shadow-card">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150"
                        alt="Raj Kumar"
                        className="w-12 h-12 rounded-xl object-cover border border-neutral-200"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h5 className="font-bold text-neutral-900 text-sm">Raj AC & Cooling Tech</h5>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            Verified
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500">HVAC Specialist · Mathura (281001)</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1 text-xs font-bold text-neutral-900">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>4.8</span>
                      </div>
                      <span className="text-[10px] text-neutral-400">142 jobs</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-neutral-400 block uppercase">Estimate Approved</span>
                      <span className="font-extrabold text-neutral-900 text-sm">₹699</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg font-medium text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      Arrived on-site at 10:35 AM
                    </div>
                  </div>
                </div>

                {/* Floating Bottom Badge */}
                <div className="mt-4 p-3 bg-neutral-900 text-white rounded-2xl flex items-center justify-between shadow-xl">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <span className="text-xs font-medium">Final Cost confirmed before payment</span>
                  </div>
                  <span className="text-xs font-bold text-primary-300">100% Transparent</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICE CATEGORIES SECTION */}
      <section className="py-16 bg-white border-y border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-2">
              Popular Categories
            </h2>
            <h3 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
              Services tailored to your home & office
            </h3>
            <p className="text-sm text-neutral-500 mt-2">
              Select a specialized category to discover verified professionals with guaranteed pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {MOCK_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                onClick={() => navigate(`/customer/services?cat=${cat.slug}`)}
                className="group relative bg-neutral-50 hover:bg-white rounded-2xl border border-neutral-200/80 p-5 hover:border-primary-400 hover:shadow-card-hover transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white group-hover:bg-primary-50 border border-neutral-200/80 group-hover:border-primary-200 flex items-center justify-center mb-4 transition-colors shadow-xs">
                    {iconMap[cat.iconName] || <Zap className="w-6 h-6 text-primary-600" />}
                  </div>
                  <h4 className="font-bold text-base text-neutral-900 group-hover:text-primary-600 transition-colors">
                    {cat.name}
                  </h4>
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed line-clamp-3">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-neutral-200/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-neutral-400 block uppercase font-medium">From</span>
                    <span className="font-bold text-neutral-900 text-sm">₹{cat.basePrice}</span>
                  </div>
                  <span className="text-[11px] font-medium text-neutral-500 bg-white group-hover:bg-primary-50 px-2 py-0.5 rounded-md border border-neutral-200/60">
                    {cat.providerCount} Pros
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (5 STEPS TIMELINE) */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-2 block">
              Workflow Lifecycle
            </span>
            <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
              How ServiceHub Works
            </h2>
            <p className="text-sm text-neutral-500 mt-2">
              From discovering providers to recording payment, experience a seamless five-step booking journey.
            </p>
          </div>

          {/* Desktop Stepper */}
          <div className="hidden lg:grid grid-cols-5 gap-4 relative">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="relative flex flex-col items-center text-center group">
                  {/* Step Connector Line */}
                  {idx < steps.length - 1 && (
                    <div className="absolute top-6 left-1/2 w-full h-0.5 bg-neutral-200 -z-0" />
                  )}
                  <div className="w-12 h-12 rounded-2xl bg-white border-2 border-primary-200 text-primary-600 group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 flex items-center justify-center font-extrabold text-sm mb-4 transition-all duration-300 shadow-sm relative z-10">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-primary-600 mb-1">{step.num}</span>
                  <h4 className="font-bold text-sm text-neutral-900 mb-1">{step.title}</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Mobile Vertical Timeline */}
          <div className="lg:hidden space-y-6">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 border border-primary-200 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-primary-600 uppercase">Step {step.num}</span>
                    <h4 className="font-bold text-base text-neutral-900">{step.title}</h4>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. TRUST & VERIFICATION SECTION */}
      <section className="py-20 bg-white border-t border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 block">
                Peace Of Mind
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight">
                Built On Trust, Transparent Estimates & Structured Schedules.
              </h2>
              <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
                Traditional home services involve bargaining, unverified helpers, and delayed visits. ServiceHub transforms local services into a professional standard where every technician is identity-checked and every milestone is recorded.
              </p>

              <div className="space-y-4 pt-2">
                {[
                  {
                    title: 'Verified Providers',
                    desc: 'Aadhaar, background, and license credentials screened by our admin team before listing.',
                  },
                  {
                    title: 'Transparent Pricing Structure',
                    desc: 'Clear category base fees. Any additional spare part costs require explicit customer approval before billing.',
                  },
                  {
                    title: 'Deterministic State Machine',
                    desc: 'No vague updates. Real status progression: Accepted → Scheduled → On The Way → In Progress → Completed.',
                  },
                  {
                    title: 'Area & Pincode Matching',
                    desc: 'Matched directly with providers currently serving your specific neighborhood and sector.',
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3.5">
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-neutral-900">{item.title}</h4>
                      <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Card Comparison */}
            <div className="bg-neutral-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />
              <h3 className="text-xl font-bold text-white mb-6">ServiceHub vs. Traditional Way</h3>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="p-4 rounded-2xl bg-neutral-800/80 border border-neutral-700">
                  <span className="text-rose-400 font-bold block mb-1">❌ Traditional Unorganized Way</span>
                  <p className="text-neutral-400">
                    Call random numbers → Wait for unconfirmed visits → Bargain without receipt → No recourse for poor work.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-primary-950/80 border border-primary-500/40">
                  <span className="text-emerald-400 font-bold block mb-1">✓ The ServiceHub Guarantee</span>
                  <p className="text-neutral-300">
                    Verified profiles with genuine ratings → Instant schedule lock → Inspection confirmation → In-system payment recording with warranty.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-extrabold text-white">4.8 / 5</span>
                  <p className="text-neutral-400 text-xs mt-0.5">Average customer satisfaction</p>
                </div>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => navigate('/customer/services')}
                >
                  Explore Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION SECTION */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-700 text-white relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Need help with home repairs today?
          </h2>
          <p className="text-primary-100 text-base max-w-xl mx-auto leading-relaxed">
            Book professional service providers in Mathura, Vrindavan, Agra, and Delhi with on-demand booking assurance.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/customer/services')}
              className="bg-white text-primary-700 hover:bg-neutral-100 shadow-lg"
            >
              Find a Service
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/become-provider')}
              className="border-white/50 text-white hover:bg-white/10"
            >
              Join as a Service Partner
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
