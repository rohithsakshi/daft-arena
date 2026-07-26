// @ts-nocheck
import React from 'react';
import { PlayerService } from '@/modules/player/services/player.client.service';
import { UpcomingMatchCard } from '@/modules/player/components/UpcomingMatchCard';
import { MOCK_USER_ID } from '@/modules/player/constants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { DataList } from '@/components/shared/DataList';
import { Calendar, Radio, CheckCircle, Search } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Matches | DAFT Arena',
  description: 'Your match schedule and results.',
};

export default async function MatchesPage() {
  const matches = await PlayerService.getMyMatches(MOCK_USER_ID);

  const upcoming = matches.filter((m) => m.status === 'UPCOMING');
  const live = matches.filter((m) => m.status === 'LIVE');
  const completed = matches.filter((m) => m.status === 'COMPLETED');

  const wins = completed.filter((m) => m.result === 'WIN').length;
  const losses = completed.filter((m) => m.result === 'LOSS').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Header */}
      <SectionHeader
        title="Matches"
        description="Your schedule, live matches, and results."
        icon={Calendar}
        titleSize="xl"
        action={
          completed.length > 0 && (
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-xl font-black text-emerald-400">{wins}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Wins</p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <p className="text-xl font-black text-red-400">{losses}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Losses</p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <p className="text-xl font-black text-foreground">{completed.length}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total</p>
              </div>
            </div>
          )
        }
      />

      {/* Live banner */}
      {live.length > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/10">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-400 animate-ping absolute" />
            <div className="w-2 h-2 rounded-full bg-red-400" />
          </div>
          <p className="text-sm font-bold text-red-400">
            {live.length} match{live.length > 1 ? 'es' : ''} live right now!
          </p>
        </div>
      )}

      <Tabs defaultValue={live.length > 0 ? 'live' : 'upcoming'} className="w-full">
        <TabsList className="bg-card/60 backdrop-blur-md border border-white/5 mb-6 h-10">
          <TabsTrigger value="upcoming" className="text-xs font-semibold gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Upcoming
            {upcoming.length > 0 && (
              <span className="text-[10px] bg-violet-500/20 text-violet-400 px-1.5 py-0.5 rounded-md">
                {upcoming.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="live" className="text-xs font-semibold gap-1.5">
            <Radio className="w-3.5 h-3.5" />
            Live
            {live.length > 0 && (
              <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-md animate-pulse">
                {live.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-xs font-semibold gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            History
            {completed.length > 0 && (
              <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded-md">
                {completed.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-0">
          <DataList
            items={upcoming}
            gridCols={3}
            layout="grid"
            emptyTitle="No Upcoming Matches"
            emptyDescription="You don't have any scheduled matches. Register for a tournament to get on the schedule."
            emptyIcon={Calendar}
            emptyAction={
              <Link
                href="/workspace/player/tournaments"
                className="inline-flex items-center gap-2 h-9 px-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                <Search className="w-4 h-4" /> Find Tournaments
              </Link>
            }
            renderItem={(match: any) => (
              <UpcomingMatchCard key={match.id} match={match} />
            )}
          />
        </TabsContent>

        <TabsContent value="live" className="mt-0">
          <DataList
            items={live}
            gridCols={3}
            layout="grid"
            emptyTitle="No Live Matches"
            emptyDescription="You don't have any matches currently in progress."
            emptyIcon={Radio}
            renderItem={(match: any) => (
              <UpcomingMatchCard key={match.id} match={match} />
            )}
          />
        </TabsContent>

        <TabsContent value="completed" className="mt-0">
          <DataList
            items={completed}
            gridCols={3}
            layout="grid"
            emptyTitle="No Match History"
            emptyDescription="Your results will appear here once you complete matches."
            emptyIcon={CheckCircle}
            renderItem={(match: any) => (
              <UpcomingMatchCard key={match.id} match={match} />
            )}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
