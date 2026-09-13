import React from 'react';

export const PageSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse" aria-label="Loading content...">
      {/* Header skeleton */}
      <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-slate-200/60 dark:border-slate-800">
        <div className="space-y-2">
          <div className="h-7 w-44 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-4 w-64 bg-slate-100 dark:bg-slate-850 rounded-lg" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-9 w-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>

      {/* KPI Cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1.5">
                <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded-md" />
                <div className="h-6 w-28 bg-slate-300 dark:bg-slate-700 rounded-md" />
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="h-3 w-32 bg-slate-100 dark:bg-slate-850 rounded-md" />
          </div>
        ))}
      </div>

      {/* Content Chart / Table Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="h-5 w-36 bg-slate-200 dark:bg-slate-800 rounded-md" />
          <div className="h-56 bg-slate-100 dark:bg-slate-850 rounded-xl" />
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="h-5 w-36 bg-slate-200 dark:bg-slate-800 rounded-md" />
          <div className="h-56 bg-slate-100 dark:bg-slate-850 rounded-xl" />
        </div>
      </div>
    </div>
  );
};
