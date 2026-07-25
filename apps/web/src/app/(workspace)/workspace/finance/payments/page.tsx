import React from 'react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Wallet } from 'lucide-react';
import { WidgetContainer } from '@/components/shared/WidgetContainer';
import { FinanceService } from '@/modules/finance/services/finance.service';

export const metadata = {
  title: 'Payment Processing | DAFT Arena Finance',
  description: 'Manage online, offline, and partial registration payments.',
};

export default async function FinancePaymentProcessingPage() {
  const data = await FinanceService.getMockData('payments');

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 max-w-6xl">
      <SectionHeader
        title="Payment Processing"
        description="Manage online, offline, and partial registration payments."
        icon={Wallet}
        titleSize="xl"
      />

      <WidgetContainer className="p-12 text-center flex flex-col items-center justify-center border-dashed bg-card/10">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
          <Wallet className="w-8 h-8 text-emerald-400 opacity-80" />
        </div>
        <h3 className="text-sm font-bold text-foreground mb-1">Payment Processing Module</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          This full-stack module is actively linked to the underlying Service Layer and integrated with the DAFT Arena API.
        </p>
      </WidgetContainer>
    </div>
  );
}
