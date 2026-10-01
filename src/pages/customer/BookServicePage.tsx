import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Zap,
  Wrench,
  Wind,
  Laptop,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  IndianRupee,
  FileText,
  Upload,
  CheckCircle2,
  ArrowRight,
  Info,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { MOCK_CATEGORIES } from '../../constants/mockData';
import {
  calculateServiceEstimate,
  COMMON_SERVICE_PROBLEMS,
  ServiceProblemOption
} from '../../services/pricingService';
import { jobRequestService } from '../../services/jobRequestService';
import { Button } from '../../components/ui/Button';

export const BookServicePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();

  // Pre-selection from query params
  const paramCategory = searchParams.get('cat') || searchParams.get('category') || 'electrician';
  const paramProblem = searchParams.get('problem') || '';

  // Form State
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>(paramCategory);
  const [selectedProblemId, setSelectedProblemId] = useState<string>(paramProblem);
  const [customProblemTitle, setCustomProblemTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  // Location
  const [city, setCity] = useState<string>('Mathura');
  const [locality, setLocality] = useState<string>('Krishna Nagar');
  const [pincode, setPincode] = useState<string>('281001');
  const [addressDetails, setAddressDetails] = useState<string>('Flat 402, Radhika Heights, Near BSA College Road');

  // Schedule
  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);

  const [preferredDate, setPreferredDate] = useState<string>(tomorrowStr);
  const [preferredTime, setPreferredTime] = useState<string>('11:00');

  // Budget
  const [customerBudget, setCustomerBudget] = useState<number>(650);
  const [optionalNotes, setOptionalNotes] = useState<string>('');
  const [photoName, setPhotoName] = useState<string>('');

  // Submission & Confirmation State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedRequestId, setSubmittedRequestId] = useState<string | null>(null);

  // Active category object
  const activeCategory = useMemo(() => {
    return (
      MOCK_CATEGORIES.find(
        (c) => c.slug === selectedCategorySlug || c.id === selectedCategorySlug
      ) || MOCK_CATEGORIES[0]
    );
  }, [selectedCategorySlug]);

  // Problems available for this category
  const categoryProblems = useMemo(() => {
    return COMMON_SERVICE_PROBLEMS.filter(
      (p) => p.categorySlug === activeCategory.slug || p.categoryId === activeCategory.id
    );
  }, [activeCategory]);

  // Dynamic estimate calculation based on selected category & problem
  const estimation = useMemo(() => {
    return calculateServiceEstimate(activeCategory.slug, selectedProblemId);
  }, [activeCategory, selectedProblemId]);

  // Sync initial budget with estimated typical amount if untouched
  useEffect(() => {
    if (estimation.typicalBudget) {
      setCustomerBudget(estimation.typicalBudget);
    }
  }, [estimation.typicalBudget]);

  const categoryIcons: Record<string, React.ReactNode> = {
    electrician: <Zap className="w-5 h-5 text-amber-500" />,
    plumber: <Wrench className="w-5 h-5 text-blue-500" />,
    'ac-repair': <Wind className="w-5 h-5 text-cyan-500" />,
    'laptop-repair': <Laptop className="w-5 h-5 text-indigo-500" />,
    cleaning: <Sparkles className="w-5 h-5 text-purple-500" />,
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoName(e.target.files[0].name);
      showToast('Photo attached to request', 'info');
    }
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      showToast('Please sign in to post a request', 'warning');
      navigate('/login');
      return;
    }

    if (!description.trim()) {
      showToast('Please describe the problem you need help with', 'warning');
      return;
    }

    if (!locality.trim() || !pincode.trim()) {
      showToast('Please provide your service locality and pincode', 'warning');
      return;
    }

    if (!customerBudget || customerBudget <= 0) {
      showToast('Please specify your budget', 'warning');
      return;
    }

    const problemTitle =
      categoryProblems.find((p) => p.id === selectedProblemId)?.title ||
      customProblemTitle ||
      `${activeCategory.name} General Inspection & Repair`;

    setIsSubmitting(true);
    try {
      const created = await jobRequestService.createRequest({
        customerId: user.id,
        customerName: user.name,
        customerPhone: user.phone || '+91 98765 43210',
        customerEmail: user.email,
        customerAvatar: user.avatar,
        serviceCategory: activeCategory.name,
        serviceCategoryId: activeCategory.id,
        serviceType: problemTitle,
        description: description.trim(),
        city: city.trim(),
        locality: locality.trim(),
        pincode: pincode.trim(),
        addressDetails: addressDetails.trim(),
        preferredDate,
        preferredTime,
        budget: Number(customerBudget),
        estimatedMin: estimation.estimatedMin,
        estimatedMax: estimation.estimatedMax,
        notes: optionalNotes.trim() || undefined,
        photoUrl: photoName ? 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300' : undefined,
        status: 'POSTED',
      });

      setSubmittedRequestId(created.id);
      showToast('Service request posted successfully! Nearby pros notified.', 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to submit request', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ================= POST-SUBMISSION SUCCESS SCREEN =================
  if (submittedRequestId) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-neutral-200/90 p-8 shadow-card text-center space-y-6 animate-in fade-in zoom-in-95 duration-400">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Request Live
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              Your request is live.
            </h1>
            <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
              Nearby verified professionals in <strong className="text-neutral-900">{locality}, {city}</strong> can now view your request and express interest.
            </p>
          </div>

          {/* Quick Recap Box */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-left space-y-2 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-200/60">
              <span className="text-neutral-500">Service Needed</span>
              <span className="font-bold text-neutral-900">{activeCategory.name}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-neutral-200/60">
              <span className="text-neutral-500">Location</span>
              <span className="font-semibold text-neutral-800">{locality}, {city} ({pincode})</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-neutral-200/60">
              <span className="text-neutral-500">Your Budget</span>
              <span className="font-bold text-neutral-900">₹{customerBudget}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-500">Estimated Benchmark</span>
              <span className="text-neutral-700 font-medium">{estimation.formattedRange}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate(`/customer/requests/${submittedRequestId}`)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              View Request & Interested Pros
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                setSubmittedRequestId(null);
                setDescription('');
                setCustomProblemTitle('');
              }}
              className="w-full sm:w-auto"
            >
              Post Another Need
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ================= MAIN REQUEST CREATION FORM =================
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium mb-1">
          <Link to="/customer/dashboard" className="hover:text-primary-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-neutral-700 font-semibold">Post a Service Request</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
          What do you need help with?
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Post what you need. Nearby verified professionals in your locality will review and respond.
        </p>
      </div>

      <form onSubmit={handleSubmitRequest} className="space-y-6">
        {/* SECTION 1: WHAT SERVICE DO YOU NEED? */}
        <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-7 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
            <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold">
              1
            </span>
            <h2 className="text-base font-bold text-neutral-900">What service do you need?</h2>
          </div>

          {/* Category Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {MOCK_CATEGORIES.map((cat) => {
              const isSelected = selectedCategorySlug === cat.slug || selectedCategorySlug === cat.id;
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategorySlug(cat.slug);
                    setSelectedProblemId('');
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-primary-600 bg-primary-50/60 ring-2 ring-primary-500/20 shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-white border border-neutral-200/80 flex items-center justify-center mb-2 shadow-xs">
                    {categoryIcons[cat.slug] || <Wrench className="w-5 h-5 text-neutral-600" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-neutral-900">{cat.name}</h4>
                    <span className="text-[10px] text-neutral-400 block mt-0.5">
                      From ₹{cat.basePrice}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Specific Problem Type */}
          {categoryProblems.length > 0 && (
            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-neutral-700 block">
                Common Problems in {activeCategory.name} (Select one or specify below)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {categoryProblems.map((prob) => {
                  const isProbSelected = selectedProblemId === prob.id;
                  return (
                    <button
                      type="button"
                      key={prob.id}
                      onClick={() => setSelectedProblemId(prob.id)}
                      className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                        isProbSelected
                          ? 'border-primary-600 bg-primary-50/50 font-bold text-primary-900'
                          : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                      }`}
                    >
                      <span>{prob.title}</span>
                      <span className="text-[10px] text-neutral-400 ml-2 whitespace-nowrap">
                        ~{prob.typicalTurnaround}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Description of Work */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold text-neutral-700 block">
              Describe the problem <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Master bedroom wiring trips the MCB whenever AC turns on. Burning smell noticed near switchboard."
              className="w-full text-xs p-3 rounded-2xl border border-neutral-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* SECTION 2: WHERE DO YOU NEED THE SERVICE? */}
        <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-7 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
            <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold">
              2
            </span>
            <h2 className="text-base font-bold text-neutral-900">Where do you need the service?</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-neutral-700 block mb-1">
                City <span className="text-rose-500">*</span>
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none bg-white font-medium"
              >
                <option value="Mathura">Mathura</option>
                <option value="Vrindavan">Vrindavan</option>
                <option value="Agra">Agra</option>
                <option value="Delhi NCR">Delhi NCR</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-700 block mb-1">
                Locality / Area <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                placeholder="e.g. Krishna Nagar, BSA Road"
                className="w-full text-xs p-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-700 block mb-1">
                Pincode <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="e.g. 281001"
                className="w-full text-xs p-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-700 block mb-1">
              Flat / House / Street Details (Kept private until accepted)
            </label>
            <input
              type="text"
              value={addressDetails}
              onChange={(e) => setAddressDetails(e.target.value)}
              placeholder="e.g. Flat 402, Radhika Heights, Opp. BSA College"
              className="w-full text-xs p-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
            />
          </div>
        </div>

        {/* SECTION 3: WHEN DO YOU NEED IT & BUDGET */}
        <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-7 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
            <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold">
              3
            </span>
            <h2 className="text-base font-bold text-neutral-900">Schedule & Your Budget</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-neutral-700 block mb-1">
                Preferred Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="date"
                  value={preferredDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full text-xs pl-10 pr-3 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-700 block mb-1">
                Preferred Time
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full text-xs pl-10 pr-3 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none bg-white font-medium"
                >
                  <option value="09:00">Morning (09:00 AM)</option>
                  <option value="11:00">Morning (11:00 AM)</option>
                  <option value="14:00">Afternoon (02:00 PM)</option>
                  <option value="16:00">Evening (04:00 PM)</option>
                  <option value="18:00">Evening (06:00 PM)</option>
                </select>
              </div>
            </div>
          </div>

          {/* DYNAMIC ESTIMATED COST DISPLAY (Section 2 Requirement) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-primary-50/80 via-white to-secondary-50/80 border border-primary-200/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary-700 block">
                  Estimated Service Benchmark
                </span>
                <span className="text-2xl font-extrabold text-neutral-900 tracking-tight">
                  {estimation.formattedRange}
                </span>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Based on local trade standards. Not a guaranteed final price.
                </p>
              </div>

              {/* Customer Budget Input */}
              <div className="sm:text-right">
                <label className="text-xs font-bold text-neutral-800 block mb-1">
                  Your Offered Budget (₹) <span className="text-rose-500">*</span>
                </label>
                <div className="relative inline-block w-full sm:w-44">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-neutral-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    min={100}
                    step={50}
                    required
                    value={customerBudget}
                    onChange={(e) => setCustomerBudget(Number(e.target.value))}
                    className="w-full text-base font-bold text-neutral-900 pl-8 pr-3 py-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none bg-white text-right"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Optional Attachment */}
          <div className="pt-2">
            <label className="text-xs font-medium text-neutral-700 block mb-1">
              Optional Photo of the Issue (Helps pros diagnose faster)
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 transition-colors">
                <Upload className="w-4 h-4 text-neutral-400" />
                <span>{photoName ? 'Replace Photo' : 'Upload Photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
              {photoName && (
                <span className="text-xs text-emerald-600 font-medium truncate max-w-xs">
                  ✓ {photoName}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* SUBMISSION BAR */}
        <div className="bg-white rounded-3xl border border-neutral-200/90 p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-neutral-500">
            <span>By posting, your request is shared with nearby verified professionals.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="w-1/2 sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-1/2 sm:w-auto shadow-md shadow-primary-600/20"
            >
              {isSubmitting ? 'Posting...' : 'Post Service Request'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
