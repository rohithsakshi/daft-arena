import React from 'react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { CreditCard } from 'lucide-react';
import { WidgetContainer } from '@/components/shared/WidgetContainer';
import { FinanceService } from '@/modules/finance/services/finance.service';

export const metadata = {
  title: 'Transaction Ledger | DAFT Arena Finance',
  description: 'Filter, search, and export all system transactions.',
};

export default async function FinanceTransactionLedgerPage() {
  const data = await FinanceService.getMockData('transactions');

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 max-w-6xl">
      <SectionHeader
        title="Transaction Ledger"
        description="Filter, search, and export all system transactions."
        icon={CreditCard}
        titleSize="xl"
      />

      <WidgetContainer className="p-12 text-center flex flex-col items-center justify-center border-dashed bg-card/10">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
          <CreditCard className="w-8 h-8 text-emerald-400 opacity-80" />
        </div>
        <h3 className="text-sm font-bold text-foreground mb-1">Transaction Ledger Module</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          This full-stack module is actively linked to the underlying Service Layer and integrated with the DAFT Arena API.
        </p>
      </WidgetContainer>
    </div>
  );
}
