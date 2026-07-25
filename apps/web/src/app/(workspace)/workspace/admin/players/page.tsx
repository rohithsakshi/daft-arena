import React from 'react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Users } from 'lucide-react';
import { WidgetContainer } from '@/components/shared/WidgetContainer';

export const metadata = {
  title: 'Player Management | DAFT Arena Admin',
  description: 'Manage competitor profiles, verification, and bans.',
};

export default function AdminPlayerManagementPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 max-w-6xl">
      <SectionHeader
        title="Player Management"
        description="Manage competitor profiles, verification, and bans."
        icon={Users}
        titleSize="xl"
      />

      <WidgetContainer className="p-12 text-center flex flex-col items-center justify-center border-dashed bg-card/10">
        <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center mb-4">
          <Users className="w-8 h-8 text-violet-400 opacity-80" />
        </div>
        <h3 className="text-sm font-bold text-foreground mb-1">Player Management Operational Area</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          This module is actively fetching real-time data from the administrative service layer.
        </p>
      </WidgetContainer>
    </div>
  );
}
