import React from 'react';

export const ProviderCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 animate-pulse shadow-subtle">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-2xl bg-neutral-200 flex-shrink-0" />
        <div className="flex-1 space-y-2.5">
          <div className="h-4 bg-neutral-200 rounded-md w-3/4" />
          <div className="h-3 bg-neutral-200 rounded-md w-1/2" />
          <div className="h-3 bg-neutral-200 rounded-md w-1/3" />
        </div>
      </div>
      <div className="mt-4 pt-3.5 border-t border-neutral-100 flex items-center justify-between">
        <div className="h-4 bg-neutral-200 rounded w-20" />
        <div className="h-8 bg-neutral-200 rounded-xl w-24" />
      </div>
    </div>
  );
};

export const BookingCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 animate-pulse shadow-subtle space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-neutral-200 rounded w-28" />
        <div className="h-5 bg-neutral-200 rounded-full w-20" />
      </div>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-neutral-200" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-neutral-200 rounded w-1/2" />
          <div className="h-3 bg-neutral-200 rounded w-1/3" />
        </div>
      </div>
      <div className="h-10 bg-neutral-100 rounded-xl w-full" />
    </div>
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Greeting Banner Skeleton */}
      <div className="h-28 bg-neutral-200 rounded-2xl w-full" />
      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-white rounded-2xl border border-neutral-200 p-4 space-y-2">
            <div className="h-3 bg-neutral-200 rounded w-1/2" />
            <div className="h-6 bg-neutral-200 rounded w-3/4" />
          </div>
        ))}
      </div>
      {/* Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-72 bg-white rounded-2xl border border-neutral-200" />
        <div className="h-72 bg-white rounded-2xl border border-neutral-200" />
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 overflow-hidden shadow-subtle animate-pulse">
      <div className="h-12 bg-neutral-100 border-b border-neutral-200" />
      <div className="divide-y divide-neutral-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center justify-between gap-4">
            <div className="h-4 bg-neutral-200 rounded w-1/4" />
            <div className="h-4 bg-neutral-200 rounded w-1/5" />
            <div className="h-4 bg-neutral-200 rounded w-1/6" />
            <div className="h-6 bg-neutral-200 rounded-full w-20" />
            <div className="h-8 bg-neutral-200 rounded-lg w-16" />
          </div>
        ))}
      </div>
    </div>
  );
};
