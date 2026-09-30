import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  ShieldCheck,
  Calendar,
  Clock,
  CreditCard,
  Star,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const HowItWorksPage: React.FC = () => {
  const navigate = useNavigate();

  const steps = [
    {
      step: '1',
      title: 'Choose Your Service Category',
      description:
        'Select from verified home and office maintenance services: Electrical, Plumbing, AC servicing, Laptop repairs, or deep sanitization.',
      details: [
        'Clear upfront base prices for all categories',
        'Transparent scope of standard work vs. replacement parts',
        'No hidden diagnosis fees',
      ],
    },
    {
      step: '2',
      title: 'Provider Discovery & Area Matching',
      description:
        'Our matching engine checks your city, neighborhood area, and pincode against registered verified providers with active weekly availability.',
      details: [
        'Only 100% background-verified professionals appear',
        'View customer ratings, completed job counts, and bios',
        'Check day-by-day availability slots',
      ],
    },
    {
      step: '3',
      title: 'Instant Booking Request',
      description:
        'Specify your problem details, choose your preferred appointment date and time slot, and submit your request directly to the provider.',
      details: [
        'Instant notification to provider dispatch',
        'Scheduled date and time lock',
        'Zero upfront deposit required to book',
      ],
    },
    {
      step: '4',
      title: 'Structured State Tracking',
      description:
        'Watch your booking move through a verified lifecycle. When the provider departs, they mark "On The Way". When inspecting, they mark "In Progress".',
      details: [
        'No guessing if someone is arriving',
        'Provider submits final itemized cost if spare parts are required',
        'Customer has full right to approve or reject cost changes',
      ],
    },
    {
      step: '5',
      title: 'Service Completion, Payment & Review',
      description:
        'Once work is complete, confirm the final cost, settle the amount directly with the provider, record the payment in-system, and write a 5-star review.',
      details: [
        'Official digital payment recording and receipt',
        'Verified customer feedback directly affects provider rating',
        'Dedicated customer support for resolution of any complaints',
      ],
    },
  ];

  return (
    <div className="py-12 sm:py-16 bg-neutral-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-2 block">
            End-To-End Process
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            How ServiceHub Works
          </h1>
          <p className="text-base text-neutral-600 mt-3 leading-relaxed">
            We replaced random phone calls and uncertain pricing with a transparent, 5-stage on-demand workflow designed for customer safety and provider efficiency.
          </p>
        </div>

        {/* Step Cards */}
        <div className="space-y-8">
          {steps.map((s, idx) => (
            <div
              key={s.step}
              className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 shadow-card flex flex-col md:flex-row gap-6 md:gap-8 items-start"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary-600 text-white flex items-center justify-center font-extrabold text-xl flex-shrink-0 shadow-md shadow-primary-600/20">
                0{s.step}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-neutral-900 mb-2">{s.title}</h3>
                <p className="text-neutral-600 text-sm leading-relaxed mb-4">{s.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-neutral-100">
                  {s.details.map((d, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-neutral-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 p-8 rounded-3xl bg-neutral-900 text-white text-center space-y-4 shadow-xl">
          <h3 className="text-2xl font-bold">Ready to book your first service?</h3>
          <p className="text-neutral-400 text-sm max-w-lg mx-auto">
            Discover verified electricians, AC mechanics, plumbers, laptop specialists and cleaners in your neighborhood today.
          </p>
          <div className="pt-2">
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate('/customer/services')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Explore Verified Services
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
