import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  MapPin,
  Star,
  CheckCircle2,
  X,
  SlidersHorizontal,
  ChevronDown,
  ArrowUpDown,
  Building2,
  CalendarCheck2
} from 'lucide-react';
import { providerService, serviceCategoryService } from '../../services/api';
import { Provider, ServiceCategory, ProviderFilters } from '../../types';
import { ProviderCard } from '../../components/cards/ProviderCard';
import { ProviderCardSkeleton } from '../../components/common/Skeletons';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/ui/Button';

export const ServiceDiscoveryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [providers, setProviders] = useState<Provider[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileFilterDrawer, setShowMobileFilterDrawer] = useState(false);

  // Filters State
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('cat') || 'all');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [area, setArea] = useState(searchParams.get('area') || '');
  const [pincode, setPincode] = useState(searchParams.get('pincode') || '');
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'price_asc' | 'price_desc'>('recommended');

  useEffect(() => {
    const fetchCats = async () => {
      const list = await serviceCategoryService.getCategories();
      setCategories(list);
    };
    fetchCats();
  }, []);

  const fetchProviders = async () => {
    setIsLoading(true);
    try {
      const filters: ProviderFilters = {
        search: search.trim() || undefined,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        city: city.trim() || undefined,
        area: area.trim() || undefined,
        pincode: pincode.trim() || undefined,
        minRating,
        maxPrice,
        sortBy,
      };
      const results = await providerService.searchProviders(filters);
      setProviders(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [selectedCategory, city, area, pincode, minRating, maxPrice, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProviders();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setCity('');
    setArea('');
    setPincode('');
    setMinRating(undefined);
    setMaxPrice(undefined);
    setSortBy('recommended');
    setSearchParams({});
  };

  const activeFilterCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (city ? 1 : 0) +
    (area ? 1 : 0) +
    (pincode ? 1 : 0) +
    (minRating ? 1 : 0) +
    (maxPrice ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* Top Banner & Search */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-5 sm:p-6 shadow-subtle space-y-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
            Find Verified Local Service Providers
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Matching is calculated using service category, city, area, pincode, and verified credentials.
          </p>
        </div>

        {/* Search Bar + Controls */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search technician name, electrical, plumbing, AC, area..."
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button type="submit" variant="primary" size="md">
              Search
            </Button>
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setShowMobileFilterDrawer(!showMobileFilterDrawer)}
              className="lg:hidden flex items-center gap-1.5"
            >
              <Filter className="w-4 h-4" />
              <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
            </Button>
          </div>
        </form>

        {/* Quick Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-primary-600 text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80'
            }`}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategory(c.slug)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === c.slug
                  ? 'bg-primary-600 text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout: Desktop Sidebar Filters + Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Desktop Filter Panel */}
        <div className="hidden lg:block bg-white rounded-3xl border border-neutral-200/90 p-5 shadow-subtle space-y-5 sticky top-20">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <h3 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-primary-600" />
              Filter Providers
            </h3>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-primary-600 hover:text-primary-700 font-semibold"
              >
                Reset ({activeFilterCount})
              </button>
            )}
          </div>

          {/* City Filter */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">City</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-neutral-300 focus:border-primary-500 outline-none bg-white"
            >
              <option value="">All Cities</option>
              <option value="Mathura">Mathura</option>
              <option value="Vrindavan">Vrindavan</option>
              <option value="Agra">Agra</option>
              <option value="Delhi">Delhi</option>
            </select>
          </div>

          {/* Area Filter */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Area / Colony</label>
            <input
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="e.g. Krishna Nagar, Sanjay Place"
              className="w-full text-xs p-2.5 rounded-xl border border-neutral-300 focus:border-primary-500 outline-none"
            />
          </div>

          {/* Pincode Filter */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Pincode</label>
            <input
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="e.g. 281001"
              maxLength={6}
              className="w-full text-xs p-2.5 rounded-xl border border-neutral-300 focus:border-primary-500 outline-none"
            />
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Minimum Rating</label>
            <div className="space-y-1.5">
              {[
                { label: 'Any Rating', val: undefined },
                { label: '4.5 ★ & above', val: 4.5 },
                { label: '4.0 ★ & above', val: 4.0 },
              ].map((r, i) => (
                <label key={i} className="flex items-center gap-2 text-xs text-neutral-600 cursor-pointer">
                  <input
                    type="radio"
                    name="minRating"
                    checked={minRating === r.val}
                    onChange={() => setMinRating(r.val)}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span>{r.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Max Price Filter */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Max Starting Price</label>
            <select
              value={maxPrice || ''}
              onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full text-xs p-2.5 rounded-xl border border-neutral-300 focus:border-primary-500 outline-none bg-white"
            >
              <option value="">Any Starting Price</option>
              <option value="500">Under ₹500</option>
              <option value="800">Under ₹800</option>
              <option value="1200">Under ₹1,200</option>
            </select>
          </div>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-3 space-y-4">
          {/* Header Count + Sort Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-subtle">
            <div className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{providers.length} verified providers available</span>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs text-neutral-500 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs font-semibold p-1.5 px-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-800 outline-none cursor-pointer"
              >
                <option value="recommended">Recommended</option>
                <option value="rating">Highest Rated</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Provider Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <ProviderCardSkeleton key={i} />
              ))}
            </div>
          ) : providers.length === 0 ? (
            <EmptyState
              title="No providers found"
              description="No verified providers matched your search or location filters. Try resetting your area or category filter."
              actionLabel="Reset Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {providers.map((p) => (
                <ProviderCard key={p.id} provider={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
