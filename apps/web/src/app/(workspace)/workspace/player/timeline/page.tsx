// @ts-nocheck
import React from 'react';
import { PlayerService } from '@/modules/player/services/player.client.service';
import { MOCK_USER_ID } from '@/modules/player/constants';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { ActivityTimeline } from '@/modules/player/components/ActivityTimeline';
import { Activity } from 'lucide-react';

export const metadata = {
  title: 'Competitor Activity Timeline | DAFT Arena',
  description: 'Chronological feed of your tournament registrations, matches, payments, and points.',
};

export default async function TimelinePage() {
  const events = await PlayerService.getTimeline(MOCK_USER_ID);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 max-w-2xl">
      <SectionHeader
        title="Activity Timeline"
        description="Chronological feed of your tournament registrations, payments, drafts, and standing updates."
        icon={Activity}
        titleSize="xl"
      />

      <ActivityTimeline events={events} />
    </div>
  );
}
