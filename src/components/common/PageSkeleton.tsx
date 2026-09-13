import React from 'react';

export const PageSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200" aria-label="Refreshing content...">
      {/* Top Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 sm:pb-6 border-b border-slate-200/60 dark:border-slate-800">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-slate-200/80 dark:bg-slate-800 rounded-xl shimmer-effect" />
          <div className="h-4 w-72 bg-slate-200/60 dark:bg-slate-800/60 rounded-lg shimmer-effect" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-32 bg-slate-200/80 dark:bg-slate-800 rounded-xl shimmer-effect" />
          <div className="h-9 w-36 bg-blue-600/20 rounded-xl shimmer-effect" />
        </div>
      </div>

      {/* KPI Stat Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-xs"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <div className="h-3 w-24 bg-slate-200/80 dark:bg-slate-800 rounded-md shimmer-effect" />
                <div className="h-7 w-32 bg-slate-300/80 dark:bg-slate-700/80 rounded-lg shimmer-effect" />
              </div>
              <div className="w-11 h-11 rounded-xl bg-slate-200/80 dark:bg-slate-800 shimmer-effect shrink-0 ml-3" />
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex justify-between">
              <div className="h-3 w-28 bg-slate-200/60 dark:bg-slate-800/60 rounded-md shimmer-effect" />
              <div className="h-3 w-12 bg-slate-200/60 dark:bg-slate-800/60 rounded-md shimmer-effect" />
            </div>
          </div>
        ))}
      </div>

      {/* Dual Column Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Chart Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
          <div className="flex justify-between items-center">
            <div className="space-y-1.5">
              <div className="h-4 w-36 bg-slate-200/80 dark:bg-slate-800 rounded-md shimmer-effect" />
              <div className="h-3 w-48 bg-slate-200/60 dark:bg-slate-800/60 rounded-md shimmer-effect" />
            </div>
            <div className="h-6 w-20 bg-slate-200/80 dark:bg-slate-800 rounded-lg shimmer-effect" />
          </div>
          <div className="h-64 rounded-xl bg-slate-100/80 dark:bg-slate-800/40 p-4 flex items-end justify-between gap-2 shimmer-effect">
            {[35, 55, 40, 75, 50, 65, 80, 45, 90, 60, 70, 85].map((height, i) => (
              <div
                key={i}
                style={{ height: `${height}%` }}
                className="w-full bg-slate-200 dark:bg-slate-700/60 rounded-t-md opacity-60"
              />
            ))}
          </div>
        </div>

        {/* Right List Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
          <div className="flex justify-between items-center">
            <div className="space-y-1.5">
              <div className="h-4 w-40 bg-slate-200/80 dark:bg-slate-800 rounded-md shimmer-effect" />
              <div className="h-3 w-52 bg-slate-200/60 dark:bg-slate-800/60 rounded-md shimmer-effect" />
            </div>
            <div className="h-4 w-16 bg-blue-600/20 rounded-md shimmer-effect" />
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-200/80 dark:bg-slate-800 shimmer-effect shrink-0" />
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-32 bg-slate-200/80 dark:bg-slate-800 rounded-md shimmer-effect" />
                    <div className="h-2.5 w-20 bg-slate-200/60 dark:bg-slate-800/60 rounded-md shimmer-effect" />
                  </div>
                </div>
                <div className="h-4 w-16 bg-slate-200/80 dark:bg-slate-800 rounded-md shimmer-effect" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
