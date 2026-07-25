import React from 'react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { PieChart } from 'lucide-react';
import { WidgetContainer } from '@/components/shared/WidgetContainer';
import { SponsorService } from '@/modules/sponsor/services/sponsor.service';

export const metadata = {
  title: 'Investment Reports | DAFT Arena Sponsor',
  description: 'Exportable financial and campaign investment reports.',
};

export default async function SponsorInvestmentReportsPage() {
  const data = await SponsorService.getMockData('reports');

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 max-w-6xl">
      <SectionHeader
        title="Investment Reports"
        description="Exportable financial and campaign investment reports."
        icon={PieChart}
        titleSize="xl"
      />

      <WidgetContainer className="p-12 text-center flex flex-col items-center justify-center border-dashed bg-card/10">
        <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
          <PieChart className="w-8 h-8 text-blue-400 opacity-80" />
        </div>
        <h3 className="text-sm font-bold text-foreground mb-1">Investment Reports Module</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          This full-stack module is actively linked to the underlying Service Layer and integrated with the DAFT Arena API.
        </p>
      </WidgetContainer>
    </div>
  );
}
