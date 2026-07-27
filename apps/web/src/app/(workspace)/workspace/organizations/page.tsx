import React from 'react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Shield } from 'lucide-react';
import { WidgetContainer } from '@/components/shared/WidgetContainer';

export const metadata = {
  title: 'Organizations | DAFT Arena',
  description: 'Manage organizations and their members.',
};

export default function OrganizationsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 max-w-6xl">
      <SectionHeader
        title="Organizations"
        description="Manage connected clubs, academies, and internal structures."
        icon={Shield}
      />

      <WidgetContainer className="p-12 text-center flex flex-col items-center justify-center border-dashed bg-card/10">
        <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center mb-4">
          <Shield className="w-8 h-8 text-violet-400 opacity-80" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-1">Organizations Center</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
          You currently have no organizations linked. Add a new organization to start managing members and roles.
        </p>
        <button className="px-6 py-2 bg-violet-500 hover:bg-violet-600 text-white font-medium rounded-xl transition-colors">
          Add Organization
        </button>
      </WidgetContainer>
    </div>
  );
}
