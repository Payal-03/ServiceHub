import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  Fan,
  Plug,
  PlugZap,
  Lightbulb,
  BatteryCharging,
  ShieldCheck,
  ToggleRight,
  Droplets,
  CircuitBoard,
  ArrowRight,
  CheckCircle2,
  Clock,
  Plus,
  IndianRupee,
  BadgeCheck,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { COMMON_SERVICE_PROBLEMS, calculateServiceEstimate } from '../../services/pricingService';

const PROBLEM_ICONS: Record<string, React.ReactNode> = {
  'el-wiring': <Zap className="w-5 h-5 text-amber-500" />,
  'el-mcb': <PlugZap className="w-5 h-5 text-rose-500" />,
  'el-fan': <Fan className="w-5 h-5 text-sky-500" />,
  'el-inverter': <BatteryCharging className="w-5 h-5 text-emerald-500" />,
  'el-geyser': <Droplets className="w-5 h-5 text-blue-500" />,
  'el-ac-point': <Plug className="w-5 h-5 text-cyan-500" />,
  'el-lighting': <Lightbulb className="w-5 h-5 text-yellow-500" />,
  'el-smart': <ToggleRight className="w-5 h-5 text-violet-500" />,
  'el-pump': <CircuitBoard className="w-5 h-5 text-indigo-500" />,
  'el-safety': <ShieldCheck className="w-5 h-5 text-teal-500" />,
};

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const steps = [
    {
      num: '1',
      title: 'Describe the electrical problem',
      desc: 'Pick the issue, add your locality and budget, and see an instant, transparent price estimate.',
    },
    {
      num: '2',
      title: 'Verified electricians respond',
      desc: 'Screened electricians in your area review your request and send their interest and quote.',
    },
    {
      num: '3',
      title: 'Choose your electrician',
      desc: 'Compare ratings, experience and distance. Accept the one you trust with a single click.',
    },
    {
      num: '4',
      title: 'Approve cost & confirm',
      desc: 'The electrician marks the job done and you confirm. Any change in price needs your approval first.',
    },
  ];

  const promises = [
    {
      icon: <BadgeCheck className="w-5 h-5 text-emerald-600" />,
      title: 'Licence & ID verified',
      desc: 'Every electrician is screened by our admin team before they can see a single request.',
    },
    {
      icon: <IndianRupee className="w-5 h-5 text-primary-600" />,
      title: 'No surprise bills',
      desc: 'Benchmark estimates up front. If the final cost changes, you approve it before paying.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-amber-600" />,
      title: 'Safety-first work',
      desc: 'ISI-marked wires, MCBs and fittings, with earthing and load checks on every job.',
    },
  ];

  const featuredProblems = COMMON_SERVICE_PROBLEMS.slice(0, 8);

  return (
    <div className="bg-neutral-50 text-neutral-900">
      {/* 1. HERO SECTION */}
      <section className="pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-neutral-200/80 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            Electricians on demand · Mathura, Vrindavan, Agra &amp; Delhi NCR
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-neutral-900 tracking-tight leading-[1.12]">
            Electrical problem? <br className="hidden sm:inline" />
            <span className="text-primary-600">Get a verified electrician.</span>
          </h1>

          <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Tripping MCB, flickering lights, a new fan or inverter to fit? Describe the problem and verified local
            electricians in your area will respond with a transparent quote.
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
              Post an Electrician Request
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/services')}
              className="w-full sm:w-auto"
            >
              Browse Electricians
            </Button>
          </div>

          {/* Trust Guarantees Strip */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-500 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Verified Local Electricians</span>
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

      {/* 2. WHAT WE FIX */}
      <section className="py-14 bg-white border-b border-neutral-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-8">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-primary-600">
                What we fix
              </h2>
              <h3 className="text-2xl font-extrabold text-neutral-900 tracking-tight mt-1">
                Choose your electrical problem
              </h3>
            </div>
            <span className="text-xs text-neutral-500">
              Tap a problem to post your request with a pre-filled estimate.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {featuredProblems.map((prob) => {
              const estimate = calculateServiceEstimate(prob.categorySlug, prob.id);
              return (
                <div
                  key={prob.id}
                  onClick={() => navigate(`/customer/book-service?problem=${prob.id}`)}
                  className="group p-4 rounded-2xl border border-neutral-200/90 bg-neutral-50/50 hover:bg-white hover:border-primary-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center mb-3 group-hover:border-primary-300 shadow-xs">
                      {PROBLEM_ICONS[prob.id] || <Zap className="w-5 h-5 text-primary-600" />}
                    </div>
                    <h4 className="font-bold text-sm text-neutral-900 group-hover:text-primary-600 transition-colors leading-snug">
                      {prob.title}
                    </h4>
                    <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-neutral-500">
                      <Clock className="w-3 h-3" />
                      {prob.typicalTurnaround}
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-200/60 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-neutral-700 font-bold">{estimate.formattedRange}</span>
                    <span className="text-primary-600 font-bold group-hover:translate-x-0.5 transition-transform">
                      Post →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. WHY SERVICEHUB */}
      <section className="py-14 bg-neutral-50 border-b border-neutral-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary-600">
              Why ServiceHub
            </h2>
            <h3 className="text-2xl font-extrabold text-neutral-900 tracking-tight mt-1">
              Electrical work you can trust
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {promises.map((p) => (
              <div
                key={p.title}
                className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs space-y-2"
              >
                <div className="w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-center">
                  {p.icon}
                </div>
                <h4 className="font-bold text-sm text-neutral-900">{p.title}</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="py-16 bg-white">
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
                className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200/80 shadow-xs space-y-2"
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

      {/* 5. CALL TO ACTION BAR */}
      <section className="py-12 bg-neutral-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Need an electrician today?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto">
            Post your request now. Nearby verified electricians are ready to help.
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
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto border-neutral-700 text-neutral-200 hover:bg-neutral-800"
            >
              Join as an Electrician
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
