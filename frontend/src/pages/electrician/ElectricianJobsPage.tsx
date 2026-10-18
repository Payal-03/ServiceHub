import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, IndianRupee, Clock, ArrowRight, AlertCircle, Briefcase, Filter } from 'lucide-react';
import { requestApi } from '../../services/api';
import { ServiceRequest } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const ElectricianJobsPage: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<ServiceRequest[]>([]);
  const [cityFilter, setCityFilter] = useState('');
  const [localityFilter, setLocalityFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const filters: { city?: string; locality?: string } = {};
      if (cityFilter.trim()) filters.city = cityFilter.trim();
      if (localityFilter.trim()) filters.locality = localityFilter.trim();

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

  return (
    <div className="space-y-6 py-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
          Open Electrical Jobs
        </h1>
        <p className="text-sm text-neutral-500">
          Browse open electrical requests from customers, submit your bid quotes, and get hired.
        </p>
      </div>

      {/* Filter Bar */}
      <form
        onSubmit={handleFilterSubmit}
        className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs flex flex-col sm:flex-row items-center gap-3"
      >
        <div className="relative flex-1 w-full">
          <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            placeholder="Filter by City (e.g. Mathura)"
            className="w-full pl-9 pr-3 py-2 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="relative flex-1 w-full">
          <Filter className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={localityFilter}
            onChange={(e) => setLocalityFilter(e.target.value)}
            placeholder="Filter by Locality (e.g. Krishna Nagar)"
            className="w-full pl-9 pr-3 py-2 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <Button type="submit" variant="primary" size="md" className="w-full sm:w-auto">
          Filter Jobs
        </Button>
      </form>

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
                  <Badge variant="success">Open for Bidding</Badge>
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
                    {job.interestedCount || job.interestedProviders?.length || 0} Quotes Received
                  </span>
                </div>
              </div>

              <div className="flex items-center sm:border-l sm:border-neutral-100 sm:pl-4">
                <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Quote Bid
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
