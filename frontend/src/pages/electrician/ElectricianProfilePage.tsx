import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Wrench, MapPin, Award, Star, AlertCircle, CheckCircle2, Save, FileText, Briefcase, ArrowRight } from 'lucide-react';
import { electricianApi, ratingApi } from '../../services/api';
import { ElectricianProfile, Rating } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { StarRating } from '../../components/ui/StarRating';

export const ElectricianProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [profile, setProfile] = useState<ElectricianProfile | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [skills, setSkills] = useState('');
  const [experienceYears, setExperienceYears] = useState<number | ''>(0);
  const [serviceCity, setServiceCity] = useState('');
  const [serviceLocality, setServiceLocality] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await electricianApi.getMyProfile();
        setProfile(data);
        setSkills(data.skills || '');
        setExperienceYears(data.experienceYears || 0);
        setServiceCity(data.serviceCity || '');
        setServiceLocality(data.serviceLocality || '');
        setDescription(data.description || '');

        // Fetch ratings for this electrician
        try {
          const reviewsData = await ratingApi.getByElectrician(data.id);
          setRatings(reviewsData);
        } catch (rErr) {
          console.warn('Ratings could not be fetched:', rErr);
        }
      } catch (err: any) {
        console.error(err);
        setError('Failed to load electrician profile.');
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setIsSaving(true);
    try {
      const updated = await electricianApi.update(profile.id, {
        skills,
        experienceYears: Number(experienceYears),
        serviceCity,
        serviceLocality,
        description,
      });
      setProfile(updated);
      showToast('Profile updated successfully!', 'success');
    } catch (err: any) {
      console.error(err);
      showToast('Failed to update profile.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <div className="p-6 bg-white rounded-3xl border border-neutral-200 space-y-4">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-neutral-900">Unable to load profile</h2>
          <p className="text-sm text-neutral-500">{error || 'Profile not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Profile Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center font-extrabold text-2xl border border-primary-200">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-neutral-900">{profile.name}</h1>
            <p className="text-sm text-neutral-500">{profile.email} • {profile.phone}</p>
            <div className="flex items-center gap-3 mt-2 text-xs">
              <span className="font-semibold text-neutral-800 flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {profile.rating > 0 ? profile.rating.toFixed(1) : 'No ratings yet'}
              </span>
              <span className="text-neutral-400">
                ({profile.ratingCount || 0} customer {profile.ratingCount === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          </div>
        </div>

        {/* Quick Electrician Actions */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/electrician/my-jobs')}
            leftIcon={<FileText className="w-4 h-4 text-primary-600" />}
          >
            My Applications
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/electrician/jobs')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Apply to Jobs
          </Button>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
          <Wrench className="w-5 h-5 text-primary-600" /> Professional Details
        </h2>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
                Skills / Expertise
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. Fan repair, Wiring, Inverter, Switchboard"
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <span className="text-[11px] text-neutral-400 mt-1 block">
                Comma-separated list of your electrical skills
              </span>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
                Years of Experience
              </label>
              <input
                type="number"
                min={0}
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g. 5"
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
                Service City
              </label>
              <input
                type="text"
                value={serviceCity}
                onChange={(e) => setServiceCity(e.target.value)}
                placeholder="e.g. Mathura"
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
                Service Locality / Areas
              </label>
              <input
                type="text"
                value={serviceLocality}
                onChange={(e) => setServiceLocality(e.target.value)}
                placeholder="e.g. Krishna Nagar, Civil Lines"
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
              Bio / Experience Summary
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell customers about your background, tools, and specialty electrical repair services..."
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSaving}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>

      {/* Customer Reviews Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500 fill-amber-400" /> Customer Ratings & Reviews
        </h2>

        {ratings.length > 0 ? (
          <div className="space-y-3 divide-y divide-neutral-100">
            {ratings.map((rev) => (
              <div key={rev.id || rev.ratingId} className="pt-3 first:pt-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-neutral-900">{rev.reviewerName}</span>
                  <span className="text-xs text-neutral-400 font-mono">
                    {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : ''}
                  </span>
                </div>
                <div className="flex items-center gap-1 mb-1.5">
                  <StarRating rating={rev.score} />
                </div>
                <p className="text-sm text-neutral-600 italic">"{rev.review}"</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-500">
            No customer ratings received yet. Once you complete jobs, customer feedback will appear here.
          </p>
        )}
      </div>
    </div>
  );
};
