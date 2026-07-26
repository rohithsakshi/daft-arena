// @ts-nocheck
import React from 'react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Swords } from 'lucide-react';
import { WidgetContainer } from '@/components/shared/WidgetContainer';

export const metadata = {
  title: 'Match Management | DAFT Arena Admin',
  description: 'Override scores, manage walkovers, and adjudicate disputes.',
};

export default function AdminMatchManagementPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 max-w-6xl">
      <SectionHeader
        title="Match Management"
        description="Override scores, manage walkovers, and adjudicate disputes."
        icon={Swords}
        titleSize="xl"
      />

      <WidgetContainer className="p-12 text-center flex flex-col items-center justify-center border-dashed bg-card/10">
        <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center mb-4">
          <Swords className="w-8 h-8 text-violet-400 opacity-80" />
        </div>
        <h3 className="text-sm font-bold text-foreground mb-1">Match Management Operational Area</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          This module is actively fetching real-time data from the administrative service layer.
        </p>
      </WidgetContainer>
    </div>
  );
}
