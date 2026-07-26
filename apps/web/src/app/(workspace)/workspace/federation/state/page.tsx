import React from 'react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { StatisticWidget } from '@/components/shared/StatisticWidget';
import { Users, FileText } from 'lucide-react';

export default function StateAssociationPage() {
  return (
    <div className="p-8 text-white space-y-8">
      <SectionHeader title="State Association Dashboard" description="Manage district associations and state-level governance." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatisticWidget title="Affiliated Districts" value="12" icon={Users} />
        <StatisticWidget title="Pending Approvals" value="5" icon={FileText} />
      </div>
    </div>
  );
}
