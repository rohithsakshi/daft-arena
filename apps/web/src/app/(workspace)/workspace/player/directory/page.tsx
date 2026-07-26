// @ts-nocheck
import React from 'react';
import { PlayerService } from '@/modules/player/services/player.client.service';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { PlayerDirectoryClient } from './PlayerDirectoryClient';
import { Search } from 'lucide-react';

export const metadata = {
  title: 'Competitors Directory Search | DAFT Arena',
  description: 'Search competitors, check states rankings and affiliated clubs.',
};

export default async function PlayerDirectoryPage() {
  const initialPlayers = await PlayerService.searchAllPlayers();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <SectionHeader
        title="Player Directory"
        description="Search active competitors in the DAFT Arena network. Inspect club affiliations and standings."
        icon={Search}
        titleSize="xl"
      />

      <PlayerDirectoryClient initialPlayers={initialPlayers} />
    </div>
  );
}
