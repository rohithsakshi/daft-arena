import React from 'react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { StatisticWidget } from '@/components/shared/StatisticWidget';
import { Users, ShieldAlert, FileText, Trophy } from 'lucide-react';

export default function NationalFederationPage() {
  return (
    <div className="p-8 text-white space-y-8">
      <SectionHeader title="National Federation Dashboard" description="Manage all affiliated states, national rankings, and policies." />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatisticWidget title="Affiliated States" value="28" icon={Users} />
        <StatisticWidget title="Active Workflows" value="14" icon={FileText} />
        <StatisticWidget title="Open Incidents" value="3" icon={ShieldAlert} />
        <StatisticWidget title="Ranked Players" value="1,245" icon={Trophy} />
      </div>
    </div>
  );
}
