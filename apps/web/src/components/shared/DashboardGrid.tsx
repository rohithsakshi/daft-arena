import React from 'react';
import { cn } from '@/lib/utils';

interface DashboardGridProps {
  cols?: 1 | 2 | 3 | 4 | 'sidebar';
  children: React.ReactNode;
  className?: string;
}

export function DashboardGrid({ cols = 3, children, className }: DashboardGridProps) {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
    sidebar: 'grid-cols-1 lg:grid-cols-3 gap-8',
  };

  return (
    <div className={cn('grid gap-6 w-full', colClasses[cols], className)}>
      {children}
    </div>
  );
}
