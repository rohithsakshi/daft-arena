// @ts-nocheck
'use client';

import React from 'react';
import { PlayerTournament, WithdrawalRequest } from '@/modules/player/types';
import { WithdrawalDialog } from '@/modules/player/components/WithdrawalDialog';
import { PlayerService } from '@/modules/player/services/player.client.service';
import { MOCK_USER_ID } from '@/modules/player/constants';

interface WithdrawalFormClientProps {
  tournaments: PlayerTournament[];
  pastWithdrawals: WithdrawalRequest[];
}

export function WithdrawalFormClient({ tournaments, pastWithdrawals }: WithdrawalFormClientProps) {
  const handleSubmit = async (data: {
    registrationId: string;
    tournamentTitle: string;
    reason: string;
    details?: string;
  }) => {
    return PlayerService.submitWithdrawal(MOCK_USER_ID, data);
  };

  return (
    <WithdrawalDialog
      tournaments={tournaments}
      pastWithdrawals={pastWithdrawals}
      onSubmit={handleSubmit}
    />
  );
}
