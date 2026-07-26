import React from 'react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { StatisticWidget } from '@/components/shared/StatisticWidget';
import { Users, FileText } from 'lucide-react';

export default function DistrictAssociationPage() {
  return (
    <div className="p-8 text-white space-y-8">
      <SectionHeader title="District Association Dashboard" description="Manage clubs, academies, and local events." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatisticWidget title="Affiliated Clubs" value="45" icon={Users} />
        <StatisticWidget title="Local Events" value="8" icon={FileText} />
      </div>
    </div>
  );
}
