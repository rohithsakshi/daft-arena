import React from 'react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Activity } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function TimelineLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 max-w-2xl">
      <SectionHeader
        title="Activity Timeline"
        description="Chronological feed of your tournament registrations, payments, drafts, and standing updates."
        icon={Activity}
        titleSize="xl"
      />

      <div className="relative pl-6 space-y-6 border-l border-white/5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="relative">
            <span className="absolute -left-[37px] top-0 p-3 rounded-full border bg-card/20 flex items-center justify-center shadow-sm">
              <Skeleton className="w-3.5 h-3.5 rounded-full" />
            </span>
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between gap-3">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-3 w-full max-w-md" />
              <Skeleton className="h-3 w-3/4 max-w-sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
