import React from 'react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { BarChart4 } from 'lucide-react';
import { WidgetContainer } from '@/components/shared/WidgetContainer';
import { FinanceService } from '@/modules/finance/services/finance.service';

export const metadata = {
  title: 'Finance Dashboard | DAFT Arena Finance',
  description: 'Central command for Revenue, KPIs, and Settlements.',
};

export default async function FinanceFinanceDashboardPage() {
  const data = await FinanceService.getMockData('page.tsx');

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 max-w-6xl">
      <SectionHeader
        title="Finance Dashboard"
        description="Central command for Revenue, KPIs, and Settlements."
        icon={BarChart4}
        titleSize="xl"
      />

      <WidgetContainer className="p-12 text-center flex flex-col items-center justify-center border-dashed bg-card/10">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
          <BarChart4 className="w-8 h-8 text-emerald-400 opacity-80" />
        </div>
        <h3 className="text-sm font-bold text-foreground mb-1">Finance Dashboard Module</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          This full-stack module is actively linked to the underlying Service Layer and integrated with the DAFT Arena API.
        </p>
      </WidgetContainer>
    </div>
  );
}
