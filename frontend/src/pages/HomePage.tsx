import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Star,
  Users,
  Wrench,
  Sparkles,
} from 'lucide-react';
import { categoryApi } from '../services/api';
import { ServiceCategory } from '../types';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    categoryApi
      .getAll()
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => {
        console.error('Could not fetch categories:', err);
      })
      .finally(() => {
        setLoadingCategories(false);
      });
  }, []);

  const handlePostJobClick = () => {
    if (role === 'ELECTRICIAN') {
      navigate('/electrician/jobs');
    } else {
      navigate('/customer/create-request');
    }
  };

  return (
    <div className="space-y-16 py-8">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 via-primary-950 to-neutral-900 text-white px-6 py-16 sm:px-12 sm:py-20 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/20 text-primary-300 text-xs font-semibold uppercase tracking-wider border border-primary-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            Fast & Reliable Electrical Services
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Household Electrical Work Done Right by Verified Local Electricians.
          </h1>

          <p className="text-neutral-300 text-base sm:text-lg leading-relaxed">
            Need a fan installed, wiring repaired, switchboard fixed, or inverter serviced?
            Post your job, receive bids directly from skilled electricians, and choose the best quote.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={handlePostJobClick}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Post a Job Now
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="bg-transparent text-white border-neutral-700 hover:bg-neutral-800"
              onClick={() => navigate('/electrician/jobs')}
            >
              Browse Open Jobs
            </Button>
          </div>

          {/* Quick trust metrics */}
          <div className="pt-6 border-t border-neutral-800/80 grid grid-cols-3 gap-4 text-xs text-neutral-400">
            <div>
              <span className="block text-xl font-bold text-white">100%</span>
              Direct Electrician Bids
            </div>
            <div>
              <span className="block text-xl font-bold text-white">0%</span>
              Hidden Middleman Fees
            </div>
            <div>
              <span className="block text-xl font-bold text-white">Mutual</span>
              Customer & Pro Ratings
            </div>
          </div>
        </div>
      </section>

      {/* 2. Popular Categories */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">Electrical Categories</h2>
            <p className="text-sm text-neutral-500">Pick a service to post your requirement</p>
          </div>
        </div>

        {loadingCategories ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 rounded-2xl bg-neutral-100 animate-pulse" />
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={handlePostJobClick}
                className="group p-5 rounded-2xl border border-neutral-200 bg-white hover:border-primary-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                    {cat.description || 'Reliable local repair & setup'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-neutral-500 bg-neutral-50 rounded-2xl border border-neutral-200">
            Categories will load once the backend server is active.
          </div>
        )}
      </section>

      {/* 3. How It Works */}
      <section className="space-y-8 bg-neutral-100/70 p-8 sm:p-12 rounded-3xl border border-neutral-200">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">How ServiceHub Works</h2>
          <p className="text-sm text-neutral-600">
            A simple 3-step transparent process connecting customers and electricians directly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary-600 text-white font-bold flex items-center justify-center">
              1
            </div>
            <h3 className="text-lg font-bold text-neutral-900">Customer Posts Job</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Describe your electrical issue (fan, wiring, switchboard), add your location, and set an expected budget.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary-600 text-white font-bold flex items-center justify-center">
              2
            </div>
            <h3 className="text-lg font-bold text-neutral-900">Electricians Quote Bids</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Local electricians browse open jobs in their area and submit competitive bids with their custom pricing and message.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary-600 text-white font-bold flex items-center justify-center">
              3
            </div>
            <h3 className="text-lg font-bold text-neutral-900">Pick, Complete & Rate</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Accept the best bid, confirm job completion together, and leave genuine reviews to build community trust.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Electrician CTA Banner */}
      <section className="bg-primary-50 border border-primary-200 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-700 uppercase tracking-wider">
            <Wrench className="w-4 h-4" /> For Skilled Electricians
          </div>
          <h3 className="text-2xl font-bold text-neutral-900">
            Want to grow your electrical repair business?
          </h3>
          <p className="text-sm text-neutral-600">
            Sign up as an Electrician on ServiceHub. Browse open requests in your city, submit your bid quotes, and get hired directly.
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate('/register?role=electrician')}
        >
          Join as an Electrician
        </Button>
      </section>
    </div>
  );
};
