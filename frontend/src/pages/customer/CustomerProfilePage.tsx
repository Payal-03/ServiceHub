import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User as UserIcon,
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Save,
  AlertCircle,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { customerApi } from '../../services/api';
import { CustomerProfile } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { StarRating } from '../../components/ui/StarRating';

export const CustomerProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form editable states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [defaultCity, setDefaultCity] = useState('');
  const [defaultLocality, setDefaultLocality] = useState('');
  const [defaultAddress, setDefaultAddress] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await customerApi.getProfile();
      setProfile(data);
      setFullName(data.fullName || user?.name || '');
      setPhone(data.phone || user?.phone || '');
      setDefaultCity(data.defaultCity || '');
      setDefaultLocality(data.defaultLocality || '');
      setDefaultAddress(data.defaultAddress || '');
    } catch (err: any) {
      console.error('Failed to load customer profile:', err);
      setError('Could not load profile details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await customerApi.updateProfile({
        fullName,
        phone,
        defaultCity,
        defaultLocality,
        defaultAddress,
      });
      setProfile(updated);
      showToast('Profile and preferences updated successfully!', 'success');
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      showToast('Failed to update profile. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <div className="w-9 h-9 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-neutral-500 font-medium">Loading customer profile & ratings...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <div className="p-8 bg-white rounded-3xl border border-neutral-200 shadow-sm space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-neutral-900">Unable to Load Profile</h2>
          <p className="text-sm text-neutral-500">{error || 'Profile not found.'}</p>
          <Button variant="primary" onClick={loadProfile}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const ratings = profile.ratings || [];
  const avgRating = profile.averageRating !== null && profile.averageRating !== undefined
    ? Number(profile.averageRating)
    : null;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Top Banner / Customer Summary Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-600 text-white flex items-center justify-center font-extrabold text-3xl shadow-md shadow-primary-500/20">
            {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'C'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                {profile.fullName || user?.name || 'Customer'}
              </h1>
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary-50 text-primary-700 border border-primary-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-primary-600" />
                Verified Customer
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs sm:text-sm text-neutral-500 pt-0.5">
              <span className="flex items-center gap-1">
                <Mail className="w-4 h-4 text-neutral-400" /> {profile.email}
              </span>
              {profile.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4 text-neutral-400" /> {profile.phone}
                </span>
              )}
              {profile.memberSince && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-neutral-400" /> Member since {new Date(profile.memberSince).getFullYear()}
                </span>
              )}
            </div>
          </div>
        </div>

        <Link to="/customer/create-request">
          <Button variant="primary" size="md">
            + Post New Job
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Rating Card */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50/40 p-6 rounded-3xl border border-amber-200/80 shadow-sm flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
            <Star className="w-7 h-7 fill-current" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-800/80">
              Customer Rating
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-black text-neutral-900">
                {avgRating !== null ? avgRating.toFixed(1) : 'New'}
              </span>
              {avgRating !== null && (
                <span className="text-xs font-semibold text-neutral-500">/ 5.0</span>
              )}
            </div>
            <div className="text-xs text-neutral-500 mt-0.5">
              {profile.totalRatingsCount} {profile.totalRatingsCount === 1 ? 'review received' : 'reviews received'}
            </div>
          </div>
        </div>

        {/* Requests Posted Card */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center border border-primary-200">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Total Jobs Posted
            </div>
            <div className="text-3xl font-black text-neutral-900 mt-0.5">
              {profile.totalRequestsCount}
            </div>
            <div className="text-xs text-neutral-500 mt-0.5">
              <Link to="/customer/requests" className="text-primary-600 hover:underline font-medium">
                View all requests &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Default City/Location Card */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-200">
            <MapPin className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Service Location
            </div>
            <div className="text-lg font-bold text-neutral-900 mt-0.5 truncate max-w-[180px]">
              {profile.defaultCity || 'Not configured'}
            </div>
            <div className="text-xs text-neutral-500 mt-0.5 truncate max-w-[180px]">
              {profile.defaultLocality || 'Add locality in settings'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Ratings (Left / Top) & Profile Settings (Right / Bottom) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Customer Ratings & Reviews */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div>
                <h2 className="text-xl font-extrabold text-neutral-900 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                  Your Customer Ratings & Reviews
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                  Reviews given by verified electricians after completing your service requests.
                </p>
              </div>

              {avgRating !== null && (
                <div className="hidden sm:flex flex-col items-end">
                  <div className="flex items-center gap-1.5">
                    <StarRating rating={avgRating} size="md" />
                  </div>
                  <span className="text-xs text-neutral-500 mt-1 font-semibold">
                    {profile.totalRatingsCount} total
                  </span>
                </div>
              )}
            </div>

            {ratings.length > 0 ? (
              <div className="space-y-4">
                {ratings.map((rev) => (
                  <div
                    key={rev.id || rev.ratingId}
                    className="p-5 rounded-2xl bg-neutral-50/70 border border-neutral-200/70 hover:border-neutral-300 transition-colors space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 font-bold text-sm flex items-center justify-center">
                          {rev.reviewerName ? rev.reviewerName.charAt(0).toUpperCase() : 'E'}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-neutral-900 flex items-center gap-1.5">
                            {rev.reviewerName || 'Electrician'}
                            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                              Verified Pro
                            </span>
                          </div>
                          <div className="text-xs text-neutral-400">
                            Service Request #{rev.requestId}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center justify-end">
                          <StarRating rating={rev.score} size="sm" showValue />
                        </div>
                        <span className="text-[11px] text-neutral-400">
                          {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : ''}
                        </span>
                      </div>
                    </div>

                    {rev.review ? (
                      <p className="text-sm text-neutral-700 italic bg-white p-3.5 rounded-xl border border-neutral-200/60">
                        "{rev.review}"
                      </p>
                    ) : (
                      <p className="text-xs text-neutral-400 italic">No written comment left.</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 px-4 text-center space-y-3 bg-neutral-50/60 rounded-2xl border border-dashed border-neutral-200">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-neutral-800">No ratings yet</h3>
                <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
                  Once an electrician finishes a job request for you and both of you confirm completion,
                  their feedback and rating on punctuality and communication will appear here!
                </p>
                <div className="pt-2">
                  <Link to="/customer/create-request">
                    <Button variant="outline" size="sm">
                      Post a Service Request
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Customer Profile & Saved Location Preferences */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-neutral-900 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-primary-600" />
                Profile & Saved Address
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                Your default details will auto-fill whenever you post new service requests.
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-xl text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={profile.email}
                  className="w-full px-3.5 py-2.5 bg-neutral-100 border border-neutral-200 rounded-xl text-neutral-500 text-sm cursor-not-allowed"
                />
                <span className="text-[11px] text-neutral-400 mt-1 block">
                  Email cannot be changed as it is your account login.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-xl text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                    Default City
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Delhi, Mumbai"
                    value={defaultCity}
                    onChange={(e) => setDefaultCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-xl text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                    Default Locality
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rohini Sector 7"
                    value={defaultLocality}
                    onChange={(e) => setDefaultLocality(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-xl text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                  Default Street Address
                </label>
                <textarea
                  rows={2}
                  placeholder="Flat / House No., Landmark..."
                  value={defaultAddress}
                  onChange={(e) => setDefaultAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-xl text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  isLoading={isSaving}
                  leftIcon={<Save className="w-4 h-4" />}
                >
                  Save Profile Settings
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
