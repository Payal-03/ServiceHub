import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  IndianRupee,
  ArrowRight,
  AlertCircle,
  Briefcase,
  Filter,
  Tag,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import { requestApi } from '../../services/api';
import { ServiceRequest } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { STANDARD_CATEGORIES } from '../../data/categories';

export const ElectricianJobsPage: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<ServiceRequest[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [localityFilter, setLocalityFilter] = useState('');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const filters: {
        category?: string;
        city?: string;
        locality?: string;
        minPrice?: number;
        maxPrice?: number;
      } = {};

      if (categoryFilter.trim()) filters.category = categoryFilter.trim();
      if (cityFilter.trim()) filters.city = cityFilter.trim();
      if (localityFilter.trim()) filters.locality = localityFilter.trim();
      if (minPrice !== '' && !isNaN(Number(minPrice))) filters.minPrice = Number(minPrice);
      if (maxPrice !== '' && !isNaN(Number(maxPrice))) filters.maxPrice = Number(maxPrice);

      const data = await requestApi.getAvailable(filters);
      setJobs(data);
    } catch (err: any) {
      console.error(err);
      setError('Could not load open requests. Please ensure backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleResetFilters = () => {
    setCategoryFilter('');
    setCityFilter('');
    setLocalityFilter('');
    setMinPrice('');
    setMaxPrice('');
    setIsLoading(true);
    requestApi
      .getAvailable({})
      .then((data) => setJobs(data))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  };

  const hasActiveFilters = Boolean(
    categoryFilter || cityFilter || localityFilter || minPrice !== '' || maxPrice !== ''
  );

  return (
    <div className="space-y-6 py-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
          Open Electrical Jobs
        </h1>
        <p className="text-sm text-neutral-500">
          Browse open electrical requests from customers, apply to jobs, and get hired.
        </p>
      </div>

      {/* Filter Bar with Category, City, Locality, and Price */}
      <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
          <div className="flex items-center gap-2 text-sm font-bold text-neutral-800">
            <SlidersHorizontal className="w-4 h-4 text-primary-600" />
            Filter Open Jobs
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
            </button>
          )}
        </div>

        <form onSubmit={handleFilterSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 1. Service Category */}
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-neutral-400" /> Service Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs sm:text-sm bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Categories</option>
                {STANDARD_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. City */}
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" /> City
              </label>
              <input
                type="text"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                placeholder="e.g. Mathura"
                className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* 3. Locality */}
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-neutral-400" /> Locality / Area
              </label>
              <input
                type="text"
                value={localityFilter}
                onChange={(e) => setLocalityFilter(e.target.value)}
                placeholder="e.g. Krishna Nagar"
                className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* 4. Price Range */}
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1 flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-neutral-400" /> Budget Range (₹)
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={0}
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Min ₹"
                  className="w-1/2 px-2.5 py-2 border border-neutral-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <span className="text-neutral-400 text-xs">-</span>
                <input
                  type="number"
                  min={0}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Max ₹"
                  className="w-1/2 px-2.5 py-2 border border-neutral-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-neutral-500">
              Found <strong className="text-neutral-900 font-bold">{jobs.length}</strong> matching electrical jobs
            </span>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <Button type="button" variant="outline" size="sm" onClick={handleResetFilters}>
                  Clear
                </Button>
              )}
              <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
                Apply Filters
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Jobs List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-neutral-100 animate-pulse" />
          ))}
        </div>
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              onClick={() => navigate(`/requests/${job.id}`)}
              className="bg-white p-5 rounded-2xl border border-neutral-200/90 hover:border-primary-500 hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="success">Open for Applications</Badge>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 font-medium">
                    {job.serviceCategory}
                  </span>
                  <span className="text-xs text-neutral-400">
                    Posted by {job.customerName || 'Customer'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-neutral-900 hover:text-primary-600 transition-colors">
                  {job.title}
                </h3>

                <p className="text-xs text-neutral-500 line-clamp-2">
                  {job.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 pt-1">
                  <span className="flex items-center gap-1 font-semibold text-neutral-900">
                    <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                    Customer Budget: ₹{job.budget}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    {job.locality}, {job.city}
                  </span>
                  <span className="text-primary-600 font-medium">
                    {job.interestedCount || job.interestedProviders?.length || 0} Applications Received
                  </span>
                </div>
              </div>

              <div className="flex items-center sm:border-l sm:border-neutral-100 sm:pl-4">
                <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Apply
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-neutral-200 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-500 mx-auto flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-neutral-900">No open jobs found</h3>
          <p className="text-sm text-neutral-500 max-w-sm mx-auto">
            There are currently no active open electrical requests matching your filter. Try clearing filters or check back shortly.
          </p>
        </div>
      )}
    </div>
  );
};
