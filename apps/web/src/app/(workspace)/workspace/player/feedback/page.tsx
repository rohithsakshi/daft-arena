import React from 'react';
import { PlayerService } from '@/modules/player/services/player.service';
import { MOCK_USER_ID } from '@/modules/player/constants';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { FeedbackFormClient } from './FeedbackFormClient';
import { MessageSquare } from 'lucide-react';

export const metadata = {
  title: 'Tournament & Venue Reviews | DAFT Arena',
  description: 'Rate tourneys, rate officials, rate venues and submit recommendations.',
};

export default async function PlayerFeedbackPage() {
  const [tournaments, pastFeedbacks] = await Promise.all([
    PlayerService.getMyTournaments(MOCK_USER_ID),
    PlayerService.getSubmittedFeedback(MOCK_USER_ID),
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <SectionHeader
        title="Ratings & Feedback"
        description="Rate tournaments, venues, officials and track your submitted feedback histories."
        icon={MessageSquare}
        titleSize="xl"
      />

      <FeedbackFormClient tournaments={tournaments} pastFeedbacks={pastFeedbacks} />
    </div>
  );
}
