import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Star, MapPin, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { Provider } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface ProviderCardProps {
  provider: Provider;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({ provider }) => {
  const navigate = useNavigate();

  // Find primary area
  const primaryArea = provider.serviceAreas[0]
    ? `${provider.serviceAreas[0].city} · ${provider.serviceAreas[0].pincode}`
    : 'Local Area';

  // Check today's availability
  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
  const todayKey = daysOfWeek[new Date().getDay()];
  const isAvailableToday = provider.availability[todayKey]?.available ?? true;

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 hover:border-primary-300 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Top Header: Avatar + Info */}
        <div className="flex items-start gap-3.5">
          <div className="relative flex-shrink-0">
            <img
              src={provider.avatar}
              alt={provider.name}
              className="w-14 h-14 rounded-2xl object-cover border border-neutral-200 shadow-xs"
            />
            {provider.verified && (
              <div
                className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 border-2 border-white shadow-xs"
                title="Verified Service Provider"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link
                to={`/customer/providers/${provider.id}`}
                className="font-bold text-neutral-900 hover:text-primary-600 transition-colors text-base truncate"
              >
                {provider.name}
              </Link>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-primary-50 text-primary-700">
                {provider.primaryCategory}
              </span>
              {provider.verified && (
                <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-2 text-xs text-neutral-500">
              <div className="flex items-center gap-1 font-semibold text-neutral-800">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{provider.rating.toFixed(1)}</span>
              </div>
              <span>•</span>
              <span>{provider.jobCount} jobs completed</span>
            </div>
          </div>
        </div>

        {/* Location & Availability Chips */}
        <div className="mt-4 pt-3.5 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-neutral-600">
            <MapPin className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
            <span className="truncate">{primaryArea}</span>
          </div>

          <div className="flex items-center gap-1">
            <span
              className={`w-2 h-2 rounded-full ${
                isAvailableToday ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-300'
              }`}
            />
            <span className={`font-medium ${isAvailableToday ? 'text-emerald-700' : 'text-neutral-500'}`}>
              {isAvailableToday ? 'Available today' : 'Unavailable today'}
            </span>
          </div>
        </div>

        {/* Short Bio */}
        <p className="mt-3 text-xs text-neutral-600 line-clamp-2 leading-relaxed">
          {provider.bio}
        </p>
      </div>

      {/* Footer: Price + CTAs */}
      <div className="mt-5 pt-3.5 border-t border-neutral-100 flex items-center justify-between gap-2">
        <div>
          <span className="text-[11px] text-neutral-400 block uppercase tracking-wider font-medium">Starting at</span>
          <div className="text-base font-extrabold text-neutral-900">
            ₹{provider.startingPrice}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/customer/providers/${provider.id}`)}
          >
            View Profile
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/customer/book-service/${provider.id}`)}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Request
          </Button>
        </div>
      </div>
    </div>
  );
};
