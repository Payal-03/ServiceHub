import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  Wrench,
  Wind,
  Laptop,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Clock,
  Plus
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { MOCK_CATEGORIES } from '../../constants/mockData';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const iconMap: Record<string, React.ReactNode> = {
    Zap: <Zap className="w-5 h-5 text-amber-500" />,
    Wrench: <Wrench className="w-5 h-5 text-blue-500" />,
    Wind: <Wind className="w-5 h-5 text-cyan-500" />,
    Laptop: <Laptop className="w-5 h-5 text-indigo-500" />,
    Sparkles: <Sparkles className="w-5 h-5 text-purple-500" />,
  };

  const steps = [
    {
      num: '1',
      title: 'Post what you need',
      desc: 'Describe the problem, choose your locality, and set your budget with instant market estimates.',
    },
    {
      num: '2',
      title: 'Nearby pros respond',
      desc: 'Screened local technicians in your area review your request and express interest.',
    },
    {
      num: '3',
      title: 'Accept your professional',
      desc: 'Compare ratings, experience, and proximity. Contact or accept with a single click.',
    },
    {
      num: '4',
      title: 'Two-sided completion',
      desc: 'Provider marks work done and you confirm satisfaction before service closes.',
    },
  ];

  return (
    <div className="bg-neutral-50 text-neutral-900">
      {/* 1. HERO SECTION */}
      <section className="pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-neutral-200/80 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-primary-600 animate-pulse" />
            Local Service Marketplace · Mathura, Vrindavan, Agra & Delhi NCR
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-neutral-900 tracking-tight leading-[1.12]">
            Post what you need. <br className="hidden sm:inline" />
            <span className="text-primary-600">Get nearby professionals.</span>
          </h1>

          <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Describe your repair or maintenance need. Verified local electricians, plumbers, AC mechanics, and specialists in your locality review and respond.
          </p>

          {/* Direct Clear CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate('/customer/book-service')}
              leftIcon={<Plus className="w-5 h-5 stroke-[2.5]" />}
              className="w-full sm:w-auto shadow-md shadow-primary-600/20 font-bold"
            >
              Post a Request
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/services')}
              className="w-full sm:w-auto"
            >
              Find Services
            </Button>
          </div>

          {/* Trust Guarantees Strip */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-500 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Verified Local Professionals</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Transparent Price Estimates</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Two-Sided Completion Confirmation</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR CATEGORIES */}
      <section className="py-14 bg-white border-b border-neutral-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-8">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-primary-600">
                Service Categories
              </h2>
              <h3 className="text-2xl font-extrabold text-neutral-900 tracking-tight mt-1">
                Choose a service to post your request
              </h3>
            </div>
            <span className="text-xs text-neutral-500">
              Click any category to post your request with pre-filled estimates.
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {MOCK_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                onClick={() => navigate(`/customer/book-service?cat=${cat.slug}`)}
                className="group p-4 rounded-2xl border border-neutral-200/90 bg-neutral-50/50 hover:bg-white hover:border-primary-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center mb-3 group-hover:border-primary-300 shadow-xs">
                    {iconMap[cat.iconName] || <Zap className="w-5 h-5 text-primary-600" />}
                  </div>
                  <h4 className="font-bold text-sm text-neutral-900 group-hover:text-primary-600 transition-colors">
                    {cat.name}
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-200/60 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-neutral-400 font-semibold uppercase">From ₹{cat.basePrice}</span>
                  <span className="text-primary-600 font-bold group-hover:translate-x-0.5 transition-transform">
                    Post →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary-600">
              Simple Workflow
            </h2>
            <h3 className="text-2xl font-extrabold text-neutral-900 tracking-tight mt-1">
              How ServiceHub Works
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((st) => (
              <div
                key={st.num}
                className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs space-y-2"
              >
                <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary-700 font-extrabold text-sm flex items-center justify-center border border-primary-100">
                  {st.num}
                </div>
                <h4 className="font-bold text-sm text-neutral-900">{st.title}</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION BAR */}
      <section className="py-12 bg-neutral-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Have something that needs repair?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto">
            Post your service request now. Nearby verified professionals are ready to help.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate('/customer/book-service')}
              leftIcon={<Plus className="w-5 h-5 stroke-[2.5]" />}
              className="w-full sm:w-auto font-bold"
            >
              Post a Request Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/become-provider')}
              className="w-full sm:w-auto border-neutral-700 text-neutral-200 hover:bg-neutral-800"
            >
              Join as a Professional
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
