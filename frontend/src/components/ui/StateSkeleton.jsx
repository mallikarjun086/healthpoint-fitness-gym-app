import React from 'react';

export const ShimmerCard = ({ className = '', children }) => (
  <div className={`relative overflow-hidden bg-surface-elevated/60 border border-border rounded-2xl p-5 ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
    {children}
  </div>
);

export const SkeletonLine = ({ className = 'h-4 w-full', rounded = 'rounded-md' }) => (
  <div className={`bg-surface-elevated/80 border border-border/40 ${rounded} ${className} relative overflow-hidden`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
  </div>
);

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <ShimmerCard key={i} className="space-y-3">
            <div className="flex justify-between items-center">
              <SkeletonLine className="h-3 w-20" />
              <SkeletonLine className="h-8 w-8 rounded-xl" />
            </div>
            <SkeletonLine className="h-7 w-28" />
            <SkeletonLine className="h-3 w-36" />
          </ShimmerCard>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ShimmerCard className="lg:col-span-2 space-y-4 min-h-[300px]">
          <SkeletonLine className="h-5 w-48" />
          <SkeletonLine className="h-48 w-full rounded-2xl" />
          <div className="grid grid-cols-3 gap-3">
            <SkeletonLine className="h-12 w-full" />
            <SkeletonLine className="h-12 w-full" />
            <SkeletonLine className="h-12 w-full" />
          </div>
        </ShimmerCard>

        <ShimmerCard className="space-y-4 min-h-[300px]">
          <SkeletonLine className="h-5 w-32" />
          <SkeletonLine className="h-12 w-full" />
          <SkeletonLine className="h-12 w-full" />
          <SkeletonLine className="h-12 w-full" />
          <SkeletonLine className="h-10 w-full rounded-xl" />
        </ShimmerCard>
      </div>
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="p-5 rounded-2xl bg-surface border border-border space-y-4">
      <div className="flex justify-between items-center pb-3 border-b border-border">
        <SkeletonLine className="h-5 w-40" />
        <SkeletonLine className="h-8 w-24 rounded-lg" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex gap-4 items-center">
            {Array.from({ length: cols }).map((_, c) => (
              <SkeletonLine key={c} className={`h-4 ${c === 0 ? 'w-12' : c === 1 ? 'flex-1' : 'w-24'}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const RouteLoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center relative shadow-lg shadow-primary/10">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <div className="space-y-1">
          <div className="text-xs uppercase font-bold tracking-widest text-primary">HealthPoint Biometrics</div>
          <div className="text-sm font-semibold text-text-primary">Loading Performance Workspace...</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
