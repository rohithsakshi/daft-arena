// @ts-nocheck
import React from 'react';
import { PlayerService } from '@/modules/player/services/player.client.service';
import { MOCK_USER_ID } from '@/modules/player/constants';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { CareerStatistics } from '@/modules/player/components/CareerStatistics';
import { Trophy } from 'lucide-react';

export const metadata = {
  title: 'Career Achievements & Accolades | DAFT Arena',
  description: 'Your career standings medals talleys, win streaks, and attendance stats.',
};

export default async function AchievementsPage() {
  const profile = await PlayerService.getProfile(MOCK_USER_ID);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <SectionHeader
        title="Achievements & Statistics"
        description="Your competitor medals tally, win ratios, streaks, and attendance stats."
        icon={Trophy}
        titleSize="xl"
      />

      <CareerStatistics
        stats={profile.stats}
        medals={profile.stats?.medals || { gold: 0, silver: 0, bronze: 0 }}
        winStreak={4}
      />
    </div>
  );
}
