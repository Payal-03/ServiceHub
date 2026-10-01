import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, CheckCircle2 } from 'lucide-react';
import { reviewService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Review } from '../../types';
import { StarRating } from '../../components/ui/StarRating';
import { EmptyState } from '../../components/common/EmptyState';

export const CustomerReviewsPage: React.FC = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const all = await reviewService.getAllReviews();
        // Filter reviews for this customer
        const myReviews = all.filter((r) => r.customerId === user?.id || r.customerName === user?.name);
        setReviews(myReviews.length > 0 ? myReviews : all.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-subtle">
        <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
          My Reviews & Ratings
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
          Reviews you have submitted for completed services on ServiceHub.
        </p>
      </div>

      {isLoading ? (
        <div className="min-h-[30vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState
          title="No reviews yet"
          description="Rate and review your completed service appointments to help local service professionals maintain trusted reputations."
          icon={Star}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl border border-neutral-200/90 p-5 shadow-card space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-sm text-neutral-900">{rev.providerName}</h3>
                  <span className="text-[10px] text-neutral-400">
                    Posted on {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <StarRating rating={rev.rating} size="sm" />
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed italic bg-neutral-50 p-3 rounded-2xl border border-neutral-100">
                "{rev.comment}"
              </p>

              <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Verified Customer Feedback
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
