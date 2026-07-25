import React from 'react';
import { PlayerService } from '@/modules/player/services/player.service';
import { DiscoverTournamentsClient } from '@/modules/player/components/DiscoverTournamentsClient';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Search } from 'lucide-react';

export const metadata = {
  title: 'Discover Tournaments | DAFT Arena',
  description: 'Browse and find upcoming tournaments to register for.',
};

export default async function DiscoverTournamentsPage() {
  const tournaments = await PlayerService.discoverTournaments();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <SectionHeader
        title="Discover Tournaments"
        description="Browse upcoming events and find your next competition."
        icon={Search}
        titleSize="xl"
        action={
          <div className="text-right flex items-center gap-3">
            <div>
              <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                {tournaments.length}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Open Tournaments</p>
            </div>
          </div>
        }
      />

      {/* Client-side filterable list */}
      <DiscoverTournamentsClient initialTournaments={tournaments} />
    </div>
  );
}
