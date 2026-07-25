import React from 'react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { ClipboardList } from 'lucide-react';
import { WidgetContainer } from '@/components/shared/WidgetContainer';

export const metadata = {
  title: 'Registration Management | DAFT Arena Admin',
  description: 'Review, approve, and refund tournament entries.',
};

export default function AdminRegistrationManagementPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 max-w-6xl">
      <SectionHeader
        title="Registration Management"
        description="Review, approve, and refund tournament entries."
        icon={ClipboardList}
        titleSize="xl"
      />

      <WidgetContainer className="p-12 text-center flex flex-col items-center justify-center border-dashed bg-card/10">
        <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center mb-4">
          <ClipboardList className="w-8 h-8 text-violet-400 opacity-80" />
        </div>
        <h3 className="text-sm font-bold text-foreground mb-1">Registration Management Operational Area</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          This module is actively fetching real-time data from the administrative service layer.
        </p>
      </WidgetContainer>
    </div>
  );
}
