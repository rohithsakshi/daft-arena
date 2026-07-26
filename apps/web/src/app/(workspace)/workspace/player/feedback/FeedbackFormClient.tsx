// @ts-nocheck
'use client';

import React from 'react';
import { PlayerTournament, PlayerFeedback } from '@/modules/player/types';
import { FeedbackForm } from '@/modules/player/components/FeedbackForm';
import { PlayerService } from '@/modules/player/services/player.client.service';
import { MOCK_USER_ID } from '@/modules/player/constants';

interface FeedbackFormClientProps {
  tournaments: PlayerTournament[];
  pastFeedbacks: PlayerFeedback[];
}

export function FeedbackFormClient({ tournaments, pastFeedbacks }: FeedbackFormClientProps) {
  const handleSubmit = async (data: {
    tournamentId: string;
    tournamentTitle: string;
    ratings: { tournament: number; venue: number; officials: number };
    type: 'FEEDBACK' | 'COMPLAINT' | 'SUGGESTION';
    message: string;
  }) => {
    return PlayerService.submitFeedback(MOCK_USER_ID, data);
  };

  return (
    <FeedbackForm
      tournaments={tournaments}
      pastFeedbacks={pastFeedbacks}
      onSubmit={handleSubmit}
    />
  );
}
