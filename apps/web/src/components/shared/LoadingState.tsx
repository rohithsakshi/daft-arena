import React from 'react';
import { cn } from '@/lib/utils';

export interface LoadingStateProps {
  className?: string;
  rows?: number;
  variant?: 'card' | 'list' | 'stat' | 'table';
}

export function LoadingState({ className, rows = 3, variant = 'card' }: LoadingStateProps) {
  if (variant === 'stat') {
    return (
      <div className={cn('p-5 rounded-2xl border border-white/5 bg-card/40 animate-pulse', className)}>
        <div className="flex justify-between mb-4">
          <div className="space-y-2">
            <div className="h-2.5 w-16 bg-white/10 rounded" />
            <div className="h-8 w-24 bg-white/10 rounded" />
          </div>
          <div className="w-10 h-10 bg-white/10 rounded-xl" />
        </div>
        <div className="h-0.5 w-full bg-white/5 rounded" />
        <div className="mt-4 h-3 w-28 bg-white/10 rounded" />
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={cn('space-y-3', className)}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-card/40 animate-pulse">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-white/10 rounded w-3/4" />
              <div className="h-3 bg-white/10 rounded w-1/2" />
            </div>
            <div className="h-3 w-16 bg-white/10 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className={cn('space-y-3 w-full', className)}>
        <div className="h-10 bg-white/10 rounded-xl w-full animate-pulse mb-4" />
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-12 bg-white/5 rounded-xl w-full animate-pulse border border-white/5" />
        ))}
      </div>
    );
  }

  return (
    <div className={cn('p-6 rounded-2xl border border-white/5 bg-card/40 backdrop-blur-md shadow-lg animate-pulse w-full', className)}>
      <div className="h-5 w-1/3 bg-white/10 rounded mb-6" />
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="h-12 w-12 rounded-xl bg-white/10 flex-shrink-0" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-white/10 rounded w-3/4" />
              <div className="h-3 bg-white/10 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReusableCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-2xl border border-white/5 bg-card/40 animate-pulse overflow-hidden', className)}>
      <div className="h-28 bg-white/5" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-white/10 rounded w-2/3" />
        <div className="h-3 bg-white/10 rounded w-1/2" />
        <div className="h-3 bg-white/10 rounded w-3/4" />
        <div className="mt-4 h-9 bg-white/10 rounded-xl" />
      </div>
    </div>
  );
}

export function BaseSpinner({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-12 gap-3', className)}>
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-violet-500/20" />
        <div className="absolute inset-0 rounded-full border-2 border-t-violet-500 animate-spin" />
      </div>
      <p className="text-xs text-muted-foreground">Loading...</p>
    </div>
  );
}
