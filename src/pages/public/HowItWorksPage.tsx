import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const HowItWorksPage: React.FC = () => {
  const navigate = useNavigate();

  const steps = [
    {
      step: '1',
      title: 'Describe Your Electrical Problem',
      description:
        'Pick the issue (MCB tripping, fan fitting, wiring fault, inverter setup, lighting and more), add your locality and pincode, and set your budget.',
      details: [
        'Clear benchmark estimate for every problem type',
        'Optional photo of the fault helps electricians diagnose faster',
        'No hidden diagnosis fees',
      ],
    },
    {
      step: '2',
      title: 'Verified Electricians Respond',
      description:
        'Your request is matched by city, area and pincode. Verified electricians in your locality express interest and share their quote.',
      details: [
        'Only background-verified electricians appear',
        'View ratings, completed job counts and experience',
        'Compare quotes and distance side by side',
      ],
    },
    {
      step: '3',
      title: 'Accept Your Electrician',
      description:
        'Choose the electrician you trust. Your preferred date and time are locked and contact details are shared once you accept.',
      details: [
        'Instant notification to the electrician',
        'Preferred date and time slot confirmed',
        'Zero upfront deposit required',
      ],
    },
    {
      step: '4',
      title: 'Transparent Pricing On Site',
      description:
        'If extra parts such as a new MCB, socket or wiring are needed, the electrician proposes a revised cost with the reason, and you approve or reject it.',
      details: [
        'No work beyond the agreed scope without your approval',
        'Itemised reason for any change in cost',
        'Full right to reject a revised price',
      ],
    },
    {
      step: '5',
      title: 'Confirm Completion, Pay & Review',
      description:
        'The electrician marks the job done and you confirm. Settle the amount directly, record the payment in-system, and leave a review.',
      details: [
        'Digital payment record and receipt',
        'Verified reviews shape every electrician\'s rating',
        'Dedicated support for resolving any complaint',
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
            We replaced random phone calls and uncertain pricing with a transparent, 5-stage on-demand workflow for electrical work, designed for customer safety and electrician efficiency.
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
          <h3 className="text-2xl font-bold">Ready to fix your electrical problem?</h3>
          <p className="text-neutral-400 text-sm max-w-lg mx-auto">
            Post your request and hear back from verified electricians in your neighbourhood today.
          </p>
          <div className="pt-2">
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate('/customer/book-service')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Post an Electrician Request
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
