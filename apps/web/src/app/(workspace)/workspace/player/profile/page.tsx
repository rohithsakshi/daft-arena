// @ts-nocheck
import React from 'react';
import { PlayerService } from '@/modules/player/services/player.client.service';
import { MOCK_USER_ID } from '@/modules/player/constants';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { ProfileEditorClient } from './ProfileEditorClient';

export const metadata = {
  title: 'My Profile | DAFT Arena',
  description: 'Manage your player identity and view your lifetime stats.',
};

export default async function PlayerProfilePage() {
  const [profile, rankings] = await Promise.all([
    PlayerService.getProfile(MOCK_USER_ID),
    PlayerService.getRankings(MOCK_USER_ID),
  ]);

  const topRanking = rankings.sort(
    (a: any, b: any) => (a.districtRank ?? 9999) - (b.districtRank ?? 9999)
  )[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Page title */}
      <SectionHeader
        title="My Profile Settings"
        description="Manage details, emergency contacts, medical records and documents."
        titleSize="xl"
      />

      <ProfileEditorClient initialProfile={profile} topRanking={topRanking} />
    </div>
  );
}
