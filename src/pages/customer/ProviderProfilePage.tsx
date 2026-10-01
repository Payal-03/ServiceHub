import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Star,
  MapPin,
  Calendar,
  Clock,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  Phone,
  Mail,
  User,
  AlertCircle
} from 'lucide-react';
import { providerService, reviewService } from '../../services/api';
import { Provider, Review } from '../../types';
import { Button } from '../../components/ui/Button';
import { StarRating } from '../../components/ui/StarRating';
import { ErrorState } from '../../components/common/ErrorState';

export const ProviderProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [provider, setProvider] = useState<Provider | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProvider = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const data = await providerService.getProviderById(id);
        setProvider(data);
        const revs = await reviewService.getReviewsByProvider(data.id);
        setReviews(revs);
      } catch (err: any) {
        setError(err.message || 'Provider not found');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProvider();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !provider) {
    return (
      <ErrorState
        type="not_found"
        title="Provider Not Found"
        message="The requested provider profile does not exist or has been removed."
        actionText="Browse Providers"
        onRetry={() => navigate('/customer/services')}
      />
    );
  }

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. Provider Header Card */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 shadow-card relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-neutral-100">
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="relative">
              <img
                src={provider.avatar}
                alt={provider.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-neutral-200 shadow-md"
              />
              {provider.verified && (
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 border-2 border-white shadow-xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
                  {provider.name}
                </h1>
                {provider.verified && (
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Provider
                  </span>
                )}
              </div>

              <p className="text-xs font-semibold text-primary-600 uppercase tracking-wider">
                {provider.primaryCategory} Expert
              </p>

              <div className="flex items-center gap-3 pt-1 text-xs text-neutral-600">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-neutral-900">{provider.rating.toFixed(1)}</span>
                  <span className="text-neutral-400">({reviews.length} reviews)</span>
                </div>
                <span>•</span>
                <span className="font-medium">{provider.jobCount} completed jobs</span>
                <span>•</span>
                <span className="font-medium">{provider.experienceYears} yrs experience</span>
              </div>
            </div>
          </div>

          {/* Direct CTA */}
          <div className="w-full sm:w-auto flex flex-col items-end gap-2">
            <div className="text-right">
              <span className="text-[10px] text-neutral-400 block uppercase font-medium">Starting from</span>
              <span className="text-2xl font-black text-neutral-900">₹{provider.startingPrice}</span>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate(`/customer/book-service/${provider.id}`)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto font-bold shadow-md shadow-primary-600/20"
            >
              Request Service
            </Button>
          </div>
        </div>

        {/* Bio */}
        <div className="pt-6">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
            About the Professional
          </h3>
          <p className="text-sm text-neutral-600 leading-relaxed max-w-3xl">
            {provider.bio}
          </p>
        </div>
      </div>

      {/* 2. Grid: Services Offered & Service Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Services List (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-subtle space-y-4">
          <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary-600" />
            Services & Transparent Pricing
          </h3>

          <div className="divide-y divide-neutral-100">
            {provider.services.map((svc) => (
              <div key={svc.id} className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-bold text-sm text-neutral-900">{svc.title}</h4>
                  <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">{svc.description}</p>
                  <span className="inline-block mt-2 text-[10px] bg-neutral-100 text-neutral-600 font-semibold px-2 py-0.5 rounded-md">
                    {svc.categoryName}
                  </span>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-sm font-extrabold text-neutral-900 block">₹{svc.basePrice}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 text-xs"
                    onClick={() => navigate(`/customer/book-service/${provider.id}?service=${svc.id}`)}
                  >
                    Select
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Service Areas (1 col) */}
        <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-subtle space-y-4">
          <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            Covered Service Areas
          </h3>
          <p className="text-xs text-neutral-500">
            Provider accepts bookings in these local jurisdictions & pincodes:
          </p>

          <div className="space-y-2">
            {provider.serviceAreas.map((area) => (
              <div
                key={area.id}
                className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/70 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-neutral-900">{area.area}</span>
                  <span className="text-neutral-500 block text-[11px]">{area.city}</span>
                </div>
                <span className="font-mono text-[11px] bg-white px-2 py-1 rounded-md border border-neutral-200 text-neutral-700">
                  {area.pincode}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Weekly Availability Schedule */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            Weekly Operating Schedule
          </h3>
          <span className="text-xs text-neutral-500">Regular appointment hours</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {daysOfWeek.map((day) => {
            const sched = provider.availability[day];
            return (
              <div
                key={day}
                className={`p-3.5 rounded-2xl border text-center transition-all ${
                  sched?.available
                    ? 'bg-neutral-50 border-neutral-200'
                    : 'bg-neutral-100/60 border-neutral-200/60 opacity-60'
                }`}
              >
                <span className="text-xs font-bold capitalize text-neutral-800 block mb-1">
                  {day}
                </span>
                {sched?.available ? (
                  <div className="text-[11px] font-semibold text-emerald-700">
                    <span>{sched.startTime}</span>
                    <span className="block text-[10px] text-neutral-400">to</span>
                    <span>{sched.endTime}</span>
                  </div>
                ) : (
                  <span className="text-[11px] text-neutral-400 font-medium">Off Day</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Customer Reviews List */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-subtle space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div>
            <h3 className="text-base font-bold text-neutral-900">
              Customer Reviews ({reviews.length})
            </h3>
            <p className="text-xs text-neutral-500">Authentic feedback from verified completed services</p>
          </div>
          <div className="flex items-center gap-2">
            <StarRating rating={provider.rating} showValue />
          </div>
        </div>

        {reviews.length === 0 ? (
          <p className="text-xs text-neutral-400 text-center py-6">
            No reviews submitted yet for this provider.
          </p>
        ) : (
          <div className="divide-y divide-neutral-100 space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="pt-4 first:pt-0 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold text-xs flex items-center justify-center">
                      {rev.customerName.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-xs text-neutral-900">{rev.customerName}</span>
                      <span className="text-[10px] text-neutral-400 ml-2">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <StarRating rating={rev.rating} size="sm" />
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed pl-10">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
