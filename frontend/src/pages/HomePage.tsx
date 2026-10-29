import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Wrench,
  ChevronRight,
} from 'lucide-react';
import { categoryApi } from '../services/api';
import { ServiceCategory } from '../types';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { STANDARD_CATEGORIES } from '../data/categories';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [dbCategories, setDbCategories] = useState<ServiceCategory[]>([]);

  useEffect(() => {
    categoryApi
      .getAll()
      .then((data) => {
        if (data && data.length > 0) {
          setDbCategories(data);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch categories from backend, using defaults:', err);
      });
  }, []);

  const handlePostJobClick = () => {
    if (role === 'ELECTRICIAN') {
      navigate('/electrician/jobs');
    } else {
      navigate('/customer/create-request');
    }
  };

  const handleCategorySelect = (categoryName: string) => {
    if (role === 'ELECTRICIAN') {
      navigate('/electrician/jobs');
      return;
    }
    // Match with database category if available
    const matched = dbCategories.find(
      (c) => c.name.toLowerCase() === categoryName.toLowerCase()
    );
    navigate('/customer/create-request', {
      state: {
        categoryName,
        categoryId: matched ? matched.id : undefined,
      },
    });
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
            Post your job, receive applications directly from skilled electricians, and hire the best professional.
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
              Direct Electrician Applications
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

      {/* 2. Standard Service Categories Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Certified Services
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
              Electrical Categories
            </h2>
            <p className="text-sm text-neutral-500">
              Choose your electrical requirement to get quick quotes from verified electricians
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {STANDARD_CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => handleCategorySelect(cat.name)}
                className="group relative p-5 rounded-2xl border border-neutral-200 bg-white hover:border-primary-500 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 text-primary-600 flex items-center justify-center border border-primary-200/50 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white transition-all shadow-xs">
                      <Icon className="w-6 h-6 transition-colors" />
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">
                      {cat.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-neutral-900 group-hover:text-primary-600 transition-colors text-base mb-1.5 flex items-center justify-between">
                    <span>
                      <span className="text-xs text-primary-500 font-mono mr-1.5">0{idx + 1}.</span>
                      {cat.name}
                    </span>
                  </h3>

                  <p className="text-xs text-neutral-500 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-primary-600">
                  <span>Post Job in this category</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
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
            <h3 className="text-lg font-bold text-neutral-900">Electricians Apply</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Local electricians browse open jobs in their area and apply with their pricing quote and custom message.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary-600 text-white font-bold flex items-center justify-center">
              3
            </div>
            <h3 className="text-lg font-bold text-neutral-900">Pick, Complete & Rate</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Accept the best applicant, confirm job completion together, and leave genuine reviews to build community trust.
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
            Sign up as an Electrician on ServiceHub. Browse open requests in your city, apply for jobs, and get hired directly.
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

