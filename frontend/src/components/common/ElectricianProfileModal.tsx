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
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { StarRating } from '../ui/StarRating';
import { Rating, ElectricianProfile, Interest } from '../../types';
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !electricianId) return;

    setLoading(true);
    // Fetch profile and ratings concurrently
    Promise.allSettled([
      electricianApi.getById(electricianId),
      ratingApi.getByElectrician(electricianId),
    ]).then(([profileRes, ratingsRes]) => {
      if (profileRes.status === 'fulfilled') {
        setProfile(profileRes.value);
      }
      if (ratingsRes.status === 'fulfilled') {
        setRatings(ratingsRes.value);
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
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="xl">
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-1">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center font-extrabold text-2xl shadow-md border-2 border-white">
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-neutral-900">{name}</h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
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
              </div>
            </div>
          </div>

          {/* Quoted Price Badge if applicant */}
          {applicant && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-2 text-right">
              <span className="text-[11px] text-emerald-700 font-semibold block uppercase tracking-wider">
                Quoted Offer
              </span>
              <span className="text-2xl font-black text-emerald-800 flex items-center justify-end">
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
                <span>Call {phone}</span>
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

        {/* Professional Details: Skills & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-2">
            <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-primary-600" /> Skills & Expertise
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
        {bio && (
          <div className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-1.5">
            <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
              About This Electrician
            </span>
            <p className="text-sm text-neutral-600 leading-relaxed">{bio}</p>
          </div>
        )}

        {/* Customer Reviews Section */}
        <div className="space-y-3 pt-2 border-t border-neutral-100">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              Customer Reviews ({ratings.length})
            </h4>
            <span className="text-xs text-neutral-400">Verified platform ratings</span>
          </div>

          {loading ? (
            <div className="space-y-2">
              <div className="h-16 rounded-xl bg-neutral-100 animate-pulse" />
              <div className="h-16 rounded-xl bg-neutral-100 animate-pulse" />
            </div>
          ) : ratings.length > 0 ? (
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {ratings.map((rev) => (
                <div
                  key={rev.id || rev.ratingId}
                  className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/70 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-800">
                      {rev.reviewerName || 'Customer'}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <StarRating rating={rev.score} />
                  </div>
                  {rev.review && (
                    <p className="text-xs text-neutral-600 italic">"{rev.review}"</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center rounded-xl bg-neutral-50 text-neutral-500 text-xs">
              No customer reviews yet. This electrician is ready to take up jobs!
            </div>
          )}
        </div>

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
              Select & Hire {name}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
