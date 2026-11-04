import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Wrench,
  MapPin,
  Award,
  Star,
  AlertCircle,
  CheckCircle2,
  Save,
  FileText,
  Briefcase,
  ArrowRight,
  IndianRupee,
  Calendar,
} from 'lucide-react';
import { electricianApi, ratingApi } from '../../services/api';
import { ElectricianProfile, Rating, ElectricianWorkHistory } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { StarRating } from '../../components/ui/StarRating';

export const ElectricianProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [profile, setProfile] = useState<ElectricianProfile | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [workHistory, setWorkHistory] = useState<ElectricianWorkHistory[]>([]);
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

        // Fetch ratings and completed work history for this electrician
        try {
          const [reviewsData, historyData] = await Promise.all([
            ratingApi.getByElectrician(data.id),
            electricianApi.getWorkHistory(data.id),
          ]);
          setRatings(reviewsData);
          setWorkHistory(historyData);
        } catch (rErr) {
          console.warn('Ratings or work history could not be fetched:', rErr);
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
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
              <StarRating
                rating={profile.rating || 0}
                size="sm"
                showValue={true}
                reviewCount={profile.ratingCount || 0}
              />
              <span>•</span>
              <span className="flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                {workHistory.length || profile.jobCount || 0} Jobs Completed
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

      {/* Electrician Work History Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-600" /> Completed Work History ({workHistory.length})
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Your completed electrical jobs, work scope, and client reviews as seen by customers.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Verified Completed
          </span>
        </div>

        {workHistory.length > 0 ? (
          <div className="space-y-3.5">
            {workHistory.map((job) => (
              <div
                key={job.id || job.requestId}
                className="p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200 hover:border-neutral-300 transition-all space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Completed
                      </span>
                      {job.serviceCategory && (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-neutral-200/80 text-neutral-700">
                          {job.serviceCategory}
                        </span>
                      )}
                      <span className="text-[11px] font-mono text-neutral-400">
                        #{job.requestNumber || job.requestId}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-neutral-900 mt-1">{job.title}</h3>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-semibold">
                      Payment
                    </span>
                    <span className="text-base font-extrabold text-neutral-900 flex items-center sm:justify-end gap-0.5">
                      <IndianRupee className="w-4 h-4 text-emerald-600" />
                      {job.budget}
                    </span>
                  </div>
                </div>

                {job.description && (
                  <p className="text-xs text-neutral-600 bg-white p-3 rounded-xl border border-neutral-200/70 leading-relaxed">
                    <strong className="text-neutral-700 block mb-0.5">Work Details:</strong>
                    {job.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500 pt-0.5">
                  {(job.locality || job.city) && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                      {[job.locality, job.city].filter(Boolean).join(', ')}
                    </span>
                  )}
                  {job.completedAt && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      Completed: {new Date(job.completedAt).toLocaleDateString()}
                    </span>
                  )}
                  {job.customerName && (
                    <span className="flex items-center gap-1 text-neutral-600">
                      <User className="w-3.5 h-3.5 text-neutral-400" />
                      Client: {job.customerName}
                    </span>
                  )}
                </div>

                {job.isRated && job.ratingScore ? (
                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <StarRating rating={job.ratingScore} size="sm" showValue />
                        <span className="text-neutral-700 font-bold">
                          {job.reviewerName ? `${job.reviewerName}'s Feedback:` : 'Customer Feedback:'}
                        </span>
                      </div>
                      {job.ratedAt && (
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {new Date(job.ratedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {job.ratingReview && (
                      <p className="text-neutral-700 italic pt-0.5">"{job.ratingReview}"</p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Completed electrical service verified on ServiceHub</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-500">
            No completed jobs recorded on ServiceHub yet. Jobs you complete will automatically appear here.
          </p>
        )}
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
