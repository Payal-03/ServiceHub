import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, CheckCircle2, MessageSquare } from 'lucide-react';
import { reviewService, providerService } from '../../services/api';
import { Review, Provider } from '../../types';
import { StarRating } from '../../components/ui/StarRating';
import { EmptyState } from '../../components/common/EmptyState';

export const ProviderReviewsPage: React.FC = () => {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const prov = await providerService.getProviderById('prov-1');
        setProvider(prov);
        const revs = await reviewService.getReviewsByProvider('prov-1');
        setReviews(revs);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalReviews = reviews.length;
  const avgRating = provider?.rating || 4.8;

  // Rating Distribution Calculation (5★ to 1★)
  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => Math.round(r.rating) === stars).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { stars, count, percentage };
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-subtle">
        <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
          Customer Ratings & Reviews
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
          Verified feedback directly submitted by customers following completed bookings.
        </p>
      </div>

      {/* Ratings Overview Card with Distribution (Requirement 26) */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 shadow-card grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left: Overall score */}
        <div className="md:col-span-4 text-center md:text-left space-y-2">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
            Overall Rating
          </span>
          <div className="text-5xl font-black text-neutral-900">{avgRating.toFixed(1)}</div>
          <StarRating rating={avgRating} size="lg" />
          <p className="text-xs text-neutral-500 pt-1">
            Based on <strong className="text-neutral-800">{provider?.jobCount || totalReviews}</strong> completed jobs
          </p>
        </div>

        {/* Right: Distribution Bars */}
        <div className="md:col-span-8 space-y-2">
          {distribution.map(({ stars, count, percentage }) => (
            <div key={stars} className="flex items-center gap-3 text-xs">
              <span className="font-bold text-neutral-700 w-6 flex items-center gap-0.5">
                {stars} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              </span>
              <div className="flex-1 h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-neutral-400 w-10 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review Cards List */}
      <div className="space-y-4">
        <h3 className="font-bold text-base text-neutral-900">Recent Customer Feedback</h3>

        {reviews.length === 0 ? (
          <EmptyState
            title="No reviews yet"
            description="Reviews submitted by clients after completed jobs will appear here."
            icon={MessageSquare}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-3xl border border-neutral-200/90 p-5 shadow-card space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold text-xs flex items-center justify-center">
                      {rev.customerName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-neutral-900">{rev.customerName}</h4>
                      <span className="text-[10px] text-neutral-400">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <StarRating rating={rev.rating} size="sm" />
                </div>

                <p className="text-xs text-neutral-700 italic bg-neutral-50 p-3 rounded-2xl border border-neutral-100 leading-relaxed">
                  "{rev.comment}"
                </p>

                <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Completion
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
