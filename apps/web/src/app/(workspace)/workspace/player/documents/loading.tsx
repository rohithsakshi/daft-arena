// @ts-nocheck
import React from 'react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { FileText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { WidgetContainer } from '@/components/shared/WidgetContainer';

export default function DocumentsLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <SectionHeader
        title="Document Center"
        description="Upload and check verification statuses of your driver license, fitness certificates, and consent waivers."
        icon={FileText}
        titleSize="xl"
      />

      <div className="grid grid-cols-1 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <WidgetContainer key={i} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white/5 bg-black/15">
            <div className="flex items-start gap-3 min-w-0">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div className="space-y-2 mt-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-64" />
              </div>
            </div>
            <div className="flex items-center gap-2 self-start md:self-center">
              <Skeleton className="h-8 w-28 rounded-xl" />
            </div>
          </WidgetContainer>
        ))}
      </div>
    </div>
  );
}
