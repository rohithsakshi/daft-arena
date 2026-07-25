import React from 'react';
import { PlayerService } from '@/modules/player/services/player.service';
import { MOCK_USER_ID } from '@/modules/player/constants';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { CreditCard } from 'lucide-react';

export const metadata = {
  title: 'Payment Transactions History | DAFT Arena',
  description: 'Manage your entry fees receipts, invoices and refund logs.',
};

// Client Workspace Wrapper
import { TransactionsWorkspaceClient } from '@/app/(workspace)/workspace/player/transactions/TransactionsWorkspaceClient';

export default async function PlayerTransactionsPage() {
  const transactions = await PlayerService.getTransactions(MOCK_USER_ID);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <SectionHeader
        title="Transaction History"
        description="Review checkout invoices, receipts, and refund claims."
        icon={CreditCard}
        titleSize="xl"
      />

      <TransactionsWorkspaceClient initialTransactions={transactions} />
    </div>
  );
}
