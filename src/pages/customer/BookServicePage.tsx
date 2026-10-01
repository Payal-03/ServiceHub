import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Check,
  Calendar,
  Clock,
  MapPin,
  FileText,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { providerService, bookingService } from '../../services/api';
import { Provider, ProviderOfferedService } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';

export const BookServicePage: React.FC = () => {
  const { providerId } = useParams<{ providerId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [provider, setProvider] = useState<Provider | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [selectedServiceId, setSelectedServiceId] = useState<string>(searchParams.get('service') || '');
  const [description, setDescription] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('10:00');
  const [streetAddress, setStreetAddress] = useState('Flat 402, Radhika Heights, Opp. BSA College Road');
  const [city, setCity] = useState('Mathura');
  const [area, setArea] = useState('Krishna Nagar');
  const [pincode, setPincode] = useState('281001');

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const pId = providerId || 'prov-1';
        const data = await providerService.getProviderById(pId);
        setProvider(data);
        if (!selectedServiceId && data.services.length > 0) {
          setSelectedServiceId(data.services[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProvider();
  }, [providerId]);

  if (isLoading || !provider) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const selectedService =
    provider.services.find((s) => s.id === selectedServiceId) || provider.services[0];

  const handleNext = () => {
    if (currentStep === 1 && !selectedServiceId) {
      showToast('Please select a service', 'warning');
      return;
    }
    if (currentStep === 2 && !description.trim()) {
      showToast('Please describe the problem you are experiencing', 'warning');
      return;
    }
    if (currentStep === 3 && !preferredDate) {
      showToast('Please pick a preferred service date', 'warning');
      return;
    }
    if (currentStep === 5 && (!streetAddress || !city || !area || !pincode)) {
      showToast('Please complete all address fields', 'warning');
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 6));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmitBooking = async () => {
    if (!user) {
      showToast('Please log in to submit a booking', 'error');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      const newBooking = await bookingService.createBooking({
        customerId: user.id,
        customer: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
        },
        providerId: provider.id,
        provider: {
          id: provider.id,
          name: provider.name,
          email: provider.email,
          phone: provider.phone,
          avatar: provider.avatar,
          verified: provider.verified,
          primaryCategory: provider.primaryCategory,
        },
        serviceCategoryId: selectedService?.categoryId || 'cat-1',
        serviceCategory: selectedService?.categoryName || provider.primaryCategory,
        serviceTitle: selectedService?.title || 'General Service',
        description,
        date: preferredDate || new Date().toISOString().split('T')[0],
        time: preferredTime,
        address: {
          street: streetAddress,
          city,
          area,
          pincode,
        },
        estimatedCost: selectedService?.basePrice || provider.startingPrice,
        paymentStatus: 'UNPAID',
        status: 'PENDING',
      });

      showToast('Service request submitted successfully! Provider will confirm slot.', 'success', 'Booking Placed');
      navigate(`/customer/bookings/${newBooking.id}`);
    } catch (err: any) {
      showToast(err.message || 'Failed to submit booking', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepsList = [
    { num: 1, title: 'Service' },
    { num: 2, title: 'Problem' },
    { num: 3, title: 'Date' },
    { num: 4, title: 'Time' },
    { num: 5, title: 'Address' },
    { num: 6, title: 'Estimate' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Breadcrumb & Provider Header */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-5 sm:p-6 shadow-card flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <img
            src={provider.avatar}
            alt={provider.name}
            className="w-12 h-12 rounded-2xl object-cover border border-neutral-200"
          />
          <div>
            <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wider block">
              Booking Service With
            </span>
            <h2 className="text-base font-bold text-neutral-900">{provider.name}</h2>
            <p className="text-xs text-neutral-500">{provider.primaryCategory} · {provider.rating} ★</p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Verified Safe
        </span>
      </div>

      {/* Multi-step progress indicator */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 p-4 shadow-subtle">
        <div className="grid grid-cols-6 gap-2">
          {stepsList.map((s) => (
            <div key={s.num} className="text-center">
              <div
                className={`h-1.5 rounded-full mb-1.5 transition-all ${
                  s.num < currentStep
                    ? 'bg-emerald-500'
                    : s.num === currentStep
                    ? 'bg-primary-600'
                    : 'bg-neutral-200'
                }`}
              />
              <span
                className={`text-[10px] font-bold block truncate ${
                  s.num === currentStep ? 'text-primary-700' : 'text-neutral-400'
                }`}
              >
                {s.num}. {s.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Container Card */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 shadow-card space-y-6">
        {/* STEP 1: SERVICE SELECTION */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-neutral-900">Step 1: Select Offered Service</h3>
              <p className="text-xs text-neutral-500">
                Choose which specific service package you need performed.
              </p>
            </div>

            <div className="space-y-3">
              {provider.services.map((svc) => (
                <label
                  key={svc.id}
                  className={`p-4 rounded-2xl border flex items-start justify-between gap-4 cursor-pointer transition-all ${
                    selectedServiceId === svc.id
                      ? 'border-primary-600 bg-primary-50/40 ring-2 ring-primary-100'
                      : 'border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="serviceOption"
                      checked={selectedServiceId === svc.id}
                      onChange={() => setSelectedServiceId(svc.id)}
                      className="mt-1 text-primary-600 focus:ring-primary-500"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-neutral-900">{svc.title}</h4>
                      <p className="text-xs text-neutral-500 mt-0.5">{svc.description}</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-sm text-neutral-900 whitespace-nowrap">
                    ₹{svc.basePrice}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: PROBLEM DESCRIPTION */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-neutral-900">Step 2: Describe the Issue</h3>
              <p className="text-xs text-neutral-500">
                Provide clear details about what needs inspection, fixing, or replacement.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Problem Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={5}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Split AC is blowing warm air and making a vibration sound since yesterday. Need urgent inspection."
                className="w-full text-sm p-4 rounded-2xl border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none leading-relaxed"
              />
              <span className="text-[11px] text-neutral-400 mt-1 block">
                The technician will review this to bring appropriate diagnostic equipment and spares.
              </span>
            </div>
          </div>
        )}

        {/* STEP 3: PREFERRED DATE */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-neutral-900">Step 3: Preferred Appointment Date</h3>
              <p className="text-xs text-neutral-500">
                Choose which date works best for the technician visit.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Service Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full text-sm p-3.5 rounded-2xl border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-600">
              Provider operates based on weekly verified schedule. Bookings are confirmed upon provider acceptance.
            </div>
          </div>
        )}

        {/* STEP 4: PREFERRED TIME */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-neutral-900">Step 4: Preferred Arrival Time</h3>
              <p className="text-xs text-neutral-500">
                Select your preferred 2-hour window or exact start time.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                '09:00',
                '10:30',
                '12:00',
                '14:00',
                '15:30',
                '17:00',
                '18:30',
              ].map((timeSlot) => (
                <button
                  key={timeSlot}
                  type="button"
                  onClick={() => setPreferredTime(timeSlot)}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    preferredTime === timeSlot
                      ? 'border-primary-600 bg-primary-50 text-primary-700 font-bold ring-2 ring-primary-100'
                      : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                  }`}
                >
                  <Clock className="w-4 h-4 mx-auto mb-1 opacity-70" />
                  <span className="text-xs">{timeSlot}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: ADDRESS */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-neutral-900">Step 5: Service Location & Address</h3>
              <p className="text-xs text-neutral-500">
                Address where the service will be performed.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Street / Flat / House Details <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="e.g. Flat 402, Radhika Heights, Opp. BSA College"
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-neutral-300 focus:border-primary-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Mathura"
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-neutral-300 focus:border-primary-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Area / Locality <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="Krishna Nagar"
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-neutral-300 focus:border-primary-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Pincode <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="281001"
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-neutral-300 focus:border-primary-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: ESTIMATED PRICE & SUMMARY */}
        {currentStep === 6 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-bold text-neutral-900">Step 6: Review & Submit Request</h3>
              <p className="text-xs text-neutral-500">
                Confirm your booking summary and estimated diagnostic cost.
              </p>
            </div>

            <div className="bg-neutral-50 rounded-2xl border border-neutral-200/80 p-5 space-y-3.5 text-xs sm:text-sm">
              <div className="flex justify-between pb-3 border-b border-neutral-200">
                <span className="text-neutral-500">Service Package</span>
                <span className="font-bold text-neutral-900">{selectedService?.title}</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-neutral-200">
                <span className="text-neutral-500">Technician</span>
                <span className="font-bold text-neutral-900">{provider.name}</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-neutral-200">
                <span className="text-neutral-500">Date & Time</span>
                <span className="font-bold text-neutral-900">{preferredDate} at {preferredTime}</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-neutral-200">
                <span className="text-neutral-500">Service Location</span>
                <span className="font-bold text-neutral-900 text-right max-w-xs truncate">
                  {streetAddress}, {area}, {city} - {pincode}
                </span>
              </div>

              {/* Estimated Cost Highlight */}
              <div className="pt-2 flex items-center justify-between text-base">
                <div>
                  <span className="text-xs text-neutral-500 block uppercase font-medium">
                    Estimated Base Cost
                  </span>
                  <span className="font-black text-2xl text-neutral-900">
                    ₹{selectedService?.basePrice || provider.startingPrice}
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full">
                  Pay after completion
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-800 leading-relaxed">
              <strong>Transparent Pricing Guarantee:</strong> You will not be charged anything now. If any spare parts or extra work are required during inspection, the technician must submit a revised final cost for your explicit approval before billing.
            </div>
          </div>
        )}

        {/* Nav Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
          {currentStep > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleBack}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
          ) : (
            <div />
          )}

          {currentStep < 6 ? (
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleNext}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Next Step
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              onClick={handleSubmitBooking}
              className="font-bold shadow-md shadow-primary-600/20"
            >
              Submit Request (Pending)
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
