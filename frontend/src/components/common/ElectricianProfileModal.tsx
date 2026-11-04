import React, { useEffect, useState } from 'react';
import {
  Phone,
  Mail,
  MessageCircle,
  Star,
  MapPin,
  Wrench,
  Award,
  CheckCircle2,
  Calendar,
  IndianRupee,
  ShieldCheck,
  User,
  Clock,
  Briefcase,
  ThumbsUp,
  FileText,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { StarRating } from '../ui/StarRating';
import { Rating, ElectricianProfile, Interest, ElectricianWorkHistory } from '../../types';
import { electricianApi, ratingApi } from '../../services/api';

interface ElectricianProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  electricianId: number | string | null;
  applicant?: Interest;
  jobTitle?: string;
  onSelectElectrician?: (electricianId: number | string) => void;
  isSelecting?: boolean;
}

export const ElectricianProfileModal: React.FC<ElectricianProfileModalProps> = ({
  isOpen,
  onClose,
  electricianId,
  applicant,
  jobTitle,
  onSelectElectrician,
  isSelecting = false,
}) => {
  const [profile, setProfile] = useState<ElectricianProfile | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [workHistory, setWorkHistory] = useState<ElectricianWorkHistory[]>([]);
  const [activeTab, setActiveTab] = useState<'history' | 'reviews' | 'about'>('history');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !electricianId) return;

    setLoading(true);
    // Fetch profile, ratings, and completed work history concurrently
    Promise.allSettled([
      electricianApi.getById(electricianId),
      ratingApi.getByElectrician(electricianId),
      electricianApi.getWorkHistory(electricianId),
    ]).then(([profileRes, ratingsRes, historyRes]) => {
      if (profileRes.status === 'fulfilled') {
        setProfile(profileRes.value);
      }
      if (ratingsRes.status === 'fulfilled') {
        setRatings(ratingsRes.value);
      }
      if (historyRes.status === 'fulfilled') {
        setWorkHistory(historyRes.value);
      }
      setLoading(false);
    });
  }, [isOpen, electricianId]);

  if (!isOpen) return null;

  const name = profile?.name || applicant?.electricianName || 'Electrician';
  const phone = profile?.phone || applicant?.electricianPhone || '';
  const email = profile?.email || applicant?.electricianEmail || '';
  const cleanPhone = phone.replace(/\D/g, '');
  const expYears = profile?.experienceYears ?? applicant?.electricianExperienceYears ?? 0;
  const ratingScore = profile?.rating ?? applicant?.electricianRating ?? 5.0;
  const completedJobsCount = workHistory.length > 0 ? workHistory.length : (profile?.jobCount ?? 0);
  const skillsList = (profile?.skills || applicant?.skills || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const bio = profile?.description || applicant?.description || '';
  const city = profile?.serviceCity || applicant?.serviceCity || '';
  const locality = profile?.serviceLocality || applicant?.serviceLocality || '';

  const whatsappUrl = cleanPhone
    ? `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
        `Hi ${name}, I saw your application on ServiceHub for my job "${jobTitle || 'Electrical Work'}". I'd like to discuss the details.`
      )}`
    : '';

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-1">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center font-extrabold text-2xl shadow-md border-2 border-white flex-shrink-0">
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-neutral-900">{name}</h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Pro
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-neutral-500">
                <span className="flex items-center gap-1 font-semibold text-neutral-800">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {ratingScore > 0 ? ratingScore.toFixed(1) : 'New'}
                  <span className="text-neutral-400 font-normal">
                    ({ratings.length || profile?.ratingCount || 0} reviews)
                  </span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium text-neutral-700">
                  <Award className="w-3.5 h-3.5 text-primary-600" />
                  {expYears} {expYears === 1 ? 'Year' : 'Years'} Exp
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  <Briefcase className="w-3.5 h-3.5" />
                  {completedJobsCount} {completedJobsCount === 1 ? 'Job Completed' : 'Jobs Completed'}
                </span>
              </div>
            </div>
          </div>

          {/* Quoted Price Badge if applicant */}
          {applicant && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-2 text-right self-stretch sm:self-auto">
              <span className="text-[11px] text-emerald-700 font-semibold block uppercase tracking-wider">
                Quoted Offer
              </span>
              <span className="text-2xl font-black text-emerald-800 flex items-center justify-start sm:justify-end">
                <IndianRupee className="w-5 h-5" />
                {applicant.bidAmount}
              </span>
            </div>
          )}
        </div>

        {/* Contact Action Bar (Call, WhatsApp, Email) */}
        <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 space-y-2">
          <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
            Direct Contact Options
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            {phone ? (
              <a
                href={`tel:${phone}`}
                className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-neutral-200 text-neutral-800 font-semibold text-xs hover:bg-neutral-100 hover:border-neutral-300 transition-colors shadow-xs"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Call ({phone})</span>
              </a>
            ) : (
              <div className="text-xs text-neutral-400 p-2">Phone not available</div>
            )}

            {cleanPhone ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            ) : null}

            {email ? (
              <a
                href={`mailto:${email}?subject=${encodeURIComponent(
                  `ServiceHub Job: ${jobTitle || 'Electrical Service'}`
                )}`}
                className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-neutral-200 text-neutral-800 font-semibold text-xs hover:bg-neutral-100 hover:border-neutral-300 transition-colors shadow-xs"
              >
                <Mail className="w-4 h-4 text-primary-600" />
                <span>Email Pro</span>
              </a>
            ) : null}
          </div>
        </div>

        {/* Application Note / Message */}
        {applicant?.message && (
          <div className="p-4 rounded-2xl bg-primary-50/70 border border-primary-100 space-y-1">
            <span className="text-xs font-bold text-primary-800 uppercase tracking-wider block">
              Application Note from {name}
            </span>
            <p className="text-sm text-neutral-700 italic">"{applicant.message}"</p>
          </div>
        )}

        {/* Navigation Tabs: Work History vs Reviews vs About */}
        <div className="border-b border-neutral-200">
          <div className="flex items-center gap-2 overflow-x-auto text-sm pb-px">
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold text-xs tracking-wide transition-all border-b-2 ${
                activeTab === 'history'
                  ? 'border-primary-600 text-primary-700 bg-primary-50/50'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Work History &amp; Completed Jobs</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-200/80 text-neutral-700">
                {workHistory.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold text-xs tracking-wide transition-all border-b-2 ${
                activeTab === 'reviews'
                  ? 'border-primary-600 text-primary-700 bg-primary-50/50'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              <Star className="w-4 h-4" />
              <span>Customer Reviews</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-200/80 text-neutral-700">
                {ratings.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('about')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold text-xs tracking-wide transition-all border-b-2 ${
                activeTab === 'about'
                  ? 'border-primary-600 text-primary-700 bg-primary-50/50'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>Skills &amp; Bio</span>
            </button>
          </div>
        </div>

        {/* TAB 1: Work History & Completed Jobs */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-emerald-600" />
                  Previously Completed Electrical Jobs ({workHistory.length})
                </h4>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Review work details, scope of repair, and customer ratings for past jobs.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Verified Service History
              </span>
            </div>

            {loading ? (
              <div className="space-y-3">
                <div className="h-24 rounded-2xl bg-neutral-100 animate-pulse" />
                <div className="h-24 rounded-2xl bg-neutral-100 animate-pulse" />
              </div>
            ) : workHistory.length > 0 ? (
              <div className="space-y-3.5 max-h-80 overflow-y-auto pr-1">
                {workHistory.map((job) => (
                  <div
                    key={job.id || job.requestId}
                    className="p-4 rounded-2xl bg-neutral-50/90 border border-neutral-200 hover:border-neutral-300 transition-all space-y-3"
                  >
                    {/* Top Row: Job Title, Category, Budget & Completed Badge */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-1">
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
                        <h5 className="text-sm font-bold text-neutral-900">{job.title}</h5>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-semibold">
                          Job Amount
                        </span>
                        <span className="text-base font-extrabold text-neutral-900 flex items-center sm:justify-end gap-0.5">
                          <IndianRupee className="w-4 h-4 text-emerald-600" />
                          {job.budget}
                        </span>
                      </div>
                    </div>

                    {/* Work Details & Problem Description */}
                    {job.description && (
                      <p className="text-xs text-neutral-600 bg-white p-3 rounded-xl border border-neutral-200/70 leading-relaxed">
                        <strong className="text-neutral-700 block mb-0.5">Work Details:</strong>
                        {job.description}
                      </p>
                    )}

                    {/* Meta: Location, Date, Customer */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500 pt-1">
                      {(job.locality || job.city) && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                          {[job.locality, job.city].filter(Boolean).join(', ')}
                        </span>
                      )}
                      {job.completedAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                          Completed: {new Date(job.completedAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      )}
                      {job.customerName && (
                        <span className="flex items-center gap-1 text-neutral-600">
                          <User className="w-3.5 h-3.5 text-neutral-400" />
                          Client: {job.customerName}
                        </span>
                      )}
                    </div>

                    {/* Customer Rating & Review for THIS specific job */}
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
                        {job.ratingReview ? (
                          <p className="text-neutral-700 italic pt-0.5">"{job.ratingReview}"</p>
                        ) : (
                          <p className="text-neutral-400 italic">5-star rating without written review.</p>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 pt-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Completed electrical service verified on ServiceHub</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-400 mx-auto flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h5 className="font-bold text-neutral-800 text-sm">No completed jobs on ServiceHub yet</h5>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  {name} is ready for their first job on ServiceHub. You can be the first to hire them and leave a review!
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: All Customer Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                  All Customer Reviews &amp; Ratings ({ratings.length})
                </h4>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Feedback from verified customers who previously hired {name}.
                </p>
              </div>

              {ratingScore > 0 && (
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <StarRating rating={ratingScore} size="sm" showValue />
                  </div>
                  <span className="text-[11px] text-neutral-400">
                    Average from {ratings.length || profile?.ratingCount || 0} reviews
                  </span>
                </div>
              )}
            </div>

            {loading ? (
              <div className="space-y-2">
                <div className="h-16 rounded-xl bg-neutral-100 animate-pulse" />
                <div className="h-16 rounded-xl bg-neutral-100 animate-pulse" />
              </div>
            ) : ratings.length > 0 ? (
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {ratings.map((rev) => (
                  <div
                    key={rev.id || rev.ratingId}
                    className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-neutral-900">
                          {rev.reviewerName || 'Customer'}
                        </span>
                        <StarRating rating={rev.score} size="sm" />
                      </div>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : ''}
                      </span>
                    </div>
                    {rev.review ? (
                      <p className="text-xs text-neutral-700 italic bg-white p-2.5 rounded-lg border border-neutral-200/60">
                        "{rev.review}"
                      </p>
                    ) : (
                      <p className="text-[11px] text-neutral-400 italic">No written comment provided.</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-400 mx-auto flex items-center justify-center">
                  <Star className="w-5 h-5" />
                </div>
                <h5 className="font-bold text-neutral-800 text-sm">No customer reviews yet</h5>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Once this electrician completes jobs on ServiceHub, customer feedback will appear here.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Skills & Bio Overview */}
        {activeTab === 'about' && (
          <div className="space-y-4">
            {/* Professional Details: Skills & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-2">
                <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-primary-600" /> Skills &amp; Expertise
                </span>
                {skillsList.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {skillsList.map((skill, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-800 font-medium border border-neutral-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-400">General Household Electrical Work</p>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-2">
                <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary-600" /> Service Location
                </span>
                <div className="pt-1 text-xs text-neutral-600 space-y-1">
                  <p>
                    <strong className="text-neutral-800">City:</strong> {city || 'Mathura & Surrounding'}
                  </p>
                  {locality && (
                    <p>
                      <strong className="text-neutral-800">Localities:</strong> {locality}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Bio / Experience Summary */}
            {bio ? (
              <div className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-1.5">
                <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
                  About This Electrician
                </span>
                <p className="text-sm text-neutral-600 leading-relaxed">{bio}</p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-neutral-50 text-xs text-neutral-500 italic">
                No detailed bio provided yet. Contact the electrician directly using the contact options above.
              </div>
            )}
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>

          {onSelectElectrician && electricianId && (
            <Button
              variant="primary"
              size="md"
              onClick={() => onSelectElectrician(electricianId)}
              isLoading={isSelecting}
              rightIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Select &amp; Hire {name}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
