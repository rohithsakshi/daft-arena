import React from 'react';
import { PlayerService } from '@/modules/player/services/player.service';
import { MOCK_USER_ID } from '@/modules/player/constants';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { WithdrawalFormClient } from './WithdrawalFormClient';
import { ShieldAlert } from 'lucide-react';

export const metadata = {
  title: 'Withdrawals & Refunds Management | DAFT Arena',
  description: 'Manage category withdrawals, cancellation claims, and refund history logs.',
};

export default async function PlayerWithdrawalsPage() {
  const [tournaments, withdrawals] = await Promise.all([
    PlayerService.getMyTournaments(MOCK_USER_ID),
    PlayerService.getWithdrawals(MOCK_USER_ID),
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <SectionHeader
        title="Withdrawals & Refunds"
        description="Submit tournament cancellation claims and review payment refund tracking lists."
        icon={ShieldAlert}
        titleSize="xl"
      />

      <WithdrawalFormClient tournaments={tournaments} pastWithdrawals={withdrawals} />
    </div>
  );
}
