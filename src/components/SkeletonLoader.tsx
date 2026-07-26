import React from 'react';

export const PetCardSkeleton = () => (
  <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="w-full h-48 bg-neutral-200 dark:bg-zinc-800" />
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-4 bg-neutral-200 dark:bg-zinc-800 rounded w-1/2" />
        <div className="h-4 bg-neutral-200 dark:bg-zinc-800 rounded w-1/4" />
      </div>
      <div className="h-6 bg-neutral-200 dark:bg-zinc-800 rounded w-3/4" />
      <div className="space-y-2">
        <div className="h-4 bg-neutral-200 dark:bg-zinc-800 rounded w-full" />
        <div className="h-4 bg-neutral-200 dark:bg-zinc-800 rounded w-5/6" />
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-neutral-100 dark:border-zinc-800">
        <div className="h-8 bg-neutral-200 dark:bg-zinc-800 rounded w-1/3" />
        <div className="h-8 bg-neutral-200 dark:bg-zinc-800 rounded w-1/3" />
      </div>
    </div>
  </div>
);

export const DashboardStatSkeleton = () => (
  <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-neutral-100 dark:border-zinc-800 animate-pulse">
    <div className="flex justify-between items-start">
      <div className="space-y-3">
        <div className="h-4 bg-neutral-200 dark:bg-zinc-800 rounded w-24" />
        <div className="h-8 bg-neutral-200 dark:bg-zinc-800 rounded w-16" />
      </div>
      <div className="w-12 h-12 rounded-lg bg-neutral-200 dark:bg-zinc-800" />
    </div>
  </div>
);
