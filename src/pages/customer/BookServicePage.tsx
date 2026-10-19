import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Zap,
  ShieldAlert,
  Calendar,
  Clock,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { MOCK_CATEGORIES } from '../../constants/mockData';
import { MockStorage } from '../../services/mockStorage';
import {
  calculateServiceEstimate,
  COMMON_SERVICE_PROBLEMS,
} from '../../services/pricingService';
import { jobRequestService } from '../../services/jobRequestService';
import { Button } from '../../components/ui/Button';

export const BookServicePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();

  // ServiceHub is electrician-only, so there is a single service category.
  const activeCategory = useMemo(() => MockStorage.getCategories()[0] ?? MOCK_CATEGORIES[0], []);

  // Pre-selection from query params (e.g. ?problem=el-fan)
  const paramProblem = searchParams.get('problem') || '';

  // Form State
  const [selectedProblemId, setSelectedProblemId] = useState<string>(paramProblem);
  const [customProblemTitle, setCustomProblemTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  // Location
  const [city, setCity] = useState<string>('Mathura');
  const [locality, setLocality] = useState<string>('');
  const [pincode, setPincode] = useState<string>('');
  const [addressDetails, setAddressDetails] = useState<string>('');

  // Schedule
  const [todayStr] = useState<string>(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 10);
  });
  const [preferredDate, setPreferredDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
  });
  const [preferredTime, setPreferredTime] = useState<string>('11:00');

  // Budget
  const [budgetOverride, setBudgetOverride] = useState<number | null>(null);

  // Submission & Confirmation State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedRequestId, setSubmittedRequestId] = useState<string | null>(null);

  // Common electrical problems
  const categoryProblems = COMMON_SERVICE_PROBLEMS;

  // Dynamic estimate calculation based on selected category & problem
  const estimation = useMemo(() => {
    return calculateServiceEstimate(activeCategory.slug, selectedProblemId);
  }, [activeCategory, selectedProblemId]);

  // Budget follows the estimate until the customer edits it
  const customerBudget = budgetOverride ?? estimation.typicalBudget;
  const setCustomerBudget = (value: number) => setBudgetOverride(value);

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
    if (!/^\d{6}$/.test(pincode)) {
      showToast('Enter a valid 6-digit pincode.', 'warning');
      return;
    }

    if (!customerBudget || customerBudget <= 0) {
      showToast('Please specify your budget', 'warning');
      return;
    }

    const problemTitle =
      categoryProblems.find((p) => p.id === selectedProblemId)?.title ||
      customProblemTitle ||
      `General Electrical Inspection & Repair`;

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
        status: 'POSTED',
      });

      setSubmittedRequestId(created.id);
      showToast('Request posted! Nearby electricians have been notified.', 'success');
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
              Nearby verified electricians in <strong className="text-neutral-900">{locality}, {city}</strong> can now view your request and express interest.
            </p>
          </div>

          {/* Quick Recap Box */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-left space-y-2 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-200/60">
              <span className="text-neutral-500">Service Needed</span>
              <span className="font-bold text-neutral-900">
                {categoryProblems.find((p) => p.id === selectedProblemId)?.title || activeCategory.name}
              </span>
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
              View Request & Interested Electricians
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                setSubmittedRequestId(null);
                setDescription('');
                setCustomProblemTitle('');
                setBudgetOverride(null);
              }}
              className="w-full sm:w-auto"
            >
              Post Another Job
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
          <span className="text-neutral-700 font-semibold">Post an Electrician Request</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
          What electrical work do you need?
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Describe your electrical problem. Verified electricians in your locality will review it and respond with their interest and quote.
        </p>
      </div>

      <form onSubmit={handleSubmitRequest} className="space-y-6">
        {/* SECTION 1: WHAT SERVICE DO YOU NEED? */}
        <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-7 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
            <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold">
              1
            </span>
            <h2 className="text-base font-bold text-neutral-900">What is the problem?</h2>
          </div>

          {/* Electrician service banner */}
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
            <div className="w-10 h-10 rounded-xl bg-white border border-amber-200 flex items-center justify-center shadow-xs shrink-0">
              <Zap className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-neutral-900">Electrician at your doorstep</h4>
              <span className="text-[11px] text-neutral-500 block mt-0.5">
                Wiring, MCB, fans, geysers, inverters, lighting &amp; safety checks · From ₹{activeCategory.basePrice}
              </span>
            </div>
          </div>

          {/* Safety notice */}
          <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/80 text-[11px] text-rose-800 leading-relaxed">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <strong>Safety first:</strong> if you smell burning, see sparks or feel a shock from any switch or appliance,
              turn off the main supply and do not touch the fault until an electrician arrives.
            </span>
          </div>

          {/* Specific Problem Type */}
          {categoryProblems.length > 0 && (
            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-neutral-700 block">
                Common electrical problems (select one or describe below)
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
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
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
                  min={todayStr}
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

          <p className="pt-2 text-xs text-neutral-500">
            Photo uploads are not available yet. Add any useful visual details to your problem description.
          </p>
        </div>

        {/* SUBMISSION BAR */}
        <div className="bg-white rounded-3xl border border-neutral-200/90 p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-neutral-500">
            <span>By posting, your request is shared with nearby verified electricians.</span>
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
              {isSubmitting ? 'Posting...' : 'Post Electrician Request'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
