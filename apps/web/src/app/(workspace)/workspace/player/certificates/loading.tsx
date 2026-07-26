// @ts-nocheck
import React from 'react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Award } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { WidgetContainer } from '@/components/shared/WidgetContainer';

export default function CertificatesLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <SectionHeader
        title="My Certificates"
        description="Official sanctioned tournament winner, runner-up, and participation certificates."
        icon={Award}
        titleSize="xl"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-3">
          <Skeleton className="h-4 w-32 mb-1" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-4 w-32 mb-1" />
          <WidgetContainer className="p-8 md:p-12 h-[500px] border-2 border-double border-violet-500/10 bg-card/10 rounded-3xl relative overflow-hidden flex items-center justify-center">
            <div className="space-y-4 w-full max-w-sm flex flex-col items-center">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-10 w-64 mt-4" />
              <Skeleton className="h-4 w-full mt-8" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </WidgetContainer>

          <div className="flex items-center gap-3 justify-end">
            <Skeleton className="h-9 w-40 rounded-xl" />
            <Skeleton className="h-9 w-24 rounded-xl" />
            <Skeleton className="h-9 w-32 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
