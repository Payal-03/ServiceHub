import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Zap, IndianRupee, MapPin, AlertCircle, ArrowLeft, Send } from 'lucide-react';
import { categoryApi, requestApi } from '../../services/api';
import { ServiceCategory } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { DEFAULT_SERVICE_CATEGORIES } from '../../data/categories';

export const CreateRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [categories, setCategories] = useState<ServiceCategory[]>(DEFAULT_SERVICE_CATEGORIES);
  const [categoryId, setCategoryId] = useState<number | ''>(DEFAULT_SERVICE_CATEGORIES[0]?.id || 1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('Mathura');
  const [locality, setLocality] = useState('');
  const [address, setAddress] = useState('');
  const [expectedBudget, setExpectedBudget] = useState<number | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Check if category passed via location state
    const stateCatName = (location.state as any)?.categoryName;
    const stateCatId = (location.state as any)?.categoryId;

    categoryApi
      .getAll()
      .then((data) => {
        if (data && data.length > 0) {
          setCategories(data);
          if (stateCatName) {
            const matched = data.find((c) => c.name.toLowerCase() === stateCatName.toLowerCase());
            if (matched) {
              setCategoryId(matched.id);
              return;
            }
          }
          if (stateCatId) {
            setCategoryId(Number(stateCatId));
            return;
          }
          setCategoryId(data[0].id);
        }
      })
      .catch((err) => {
        console.warn('Using default categories:', err);
        if (stateCatName) {
          const matched = DEFAULT_SERVICE_CATEGORIES.find((c) => c.name.toLowerCase() === stateCatName.toLowerCase());
          if (matched) {
            setCategoryId(matched.id);
          }
        }
      });
  }, [location.state]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!categoryId || !title.trim() || !description.trim() || !city.trim() || !locality.trim() || !address.trim() || !expectedBudget) {
      setErrorMessage('Please complete all fields with valid information.');
      return;
    }

    if (Number(expectedBudget) < 50) {
      setErrorMessage('Expected budget must be at least ₹50.');
      return;
    }

    setIsLoading(true);
    try {
      const created = await requestApi.create({
        categoryId: Number(categoryId),
        title: title.trim(),
        description: description.trim(),
        city: city.trim(),
        locality: locality.trim(),
        address: address.trim(),
        expectedBudget: Number(expectedBudget),
      });

      showToast('Electrical job posted successfully! Electricians can now submit quotes.', 'success');
      navigate(`/requests/${created.id}`);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to post job. Please try again.';
      setErrorMessage(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
          Post an Electrical Job
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Provide job details. Nearby electricians will review and quote their price.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-sm">
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
              Service Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              required
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            >
              <option value="" disabled>
                Select category
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Job Title */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
              Job Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Ceiling fan not spinning and humming noise"
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
          </div>

          {/* Problem Description */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
              Detailed Description
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the problem in detail (e.g. age of the appliance, any burnt smell, switch status, etc.)"
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
          </div>

          {/* Location Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
                City
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Mathura"
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
                Locality / Area
              </label>
              <input
                type="text"
                required
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                placeholder="e.g. Krishna Nagar"
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>
          </div>

          {/* Full Address */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
              Exact Address / House No.
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. House No. 42, Near Temple Road"
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
            <span className="text-[11px] text-neutral-400 mt-1 block">
              Exact address is shared only with the selected electrician.
            </span>
          </div>

          {/* Expected Budget */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
              Expected Budget (₹)
            </label>
            <div className="relative">
              <IndianRupee className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="number"
                min={50}
                required
                value={expectedBudget}
                onChange={(e) => setExpectedBudget(e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g. 500"
                className="w-full pl-11 pr-4 py-2.5 border border-neutral-300 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>
            <span className="text-[11px] text-neutral-400 mt-1 block">
              Electricians can quote higher or lower based on work scope.
            </span>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-4"
            isLoading={isLoading}
            rightIcon={<Send className="w-4 h-4" />}
          >
            Post Electrical Job
          </Button>
        </form>
      </div>
    </div>
  );
};
