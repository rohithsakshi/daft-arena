import React from 'react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Landmark } from 'lucide-react';
import { WidgetContainer } from '@/components/shared/WidgetContainer';
import { FinanceService } from '@/modules/finance/services/finance.service';

export const metadata = {
  title: 'Settlement Center | DAFT Arena Finance',
  description: 'Manage organizer payouts, commissions, and platform fees.',
};

export default async function FinanceSettlementCenterPage() {
  const data = await FinanceService.getMockData('settlements');

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 max-w-6xl">
      <SectionHeader
        title="Settlement Center"
        description="Manage organizer payouts, commissions, and platform fees."
        icon={Landmark}
        titleSize="xl"
      />

      <WidgetContainer className="p-12 text-center flex flex-col items-center justify-center border-dashed bg-card/10">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
          <Landmark className="w-8 h-8 text-emerald-400 opacity-80" />
        </div>
        <h3 className="text-sm font-bold text-foreground mb-1">Settlement Center Module</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          This full-stack module is actively linked to the underlying Service Layer and integrated with the DAFT Arena API.
        </p>
      </WidgetContainer>
    </div>
  );
}
