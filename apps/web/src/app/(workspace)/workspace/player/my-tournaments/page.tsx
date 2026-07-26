// @ts-nocheck
import React from 'react';
import { PlayerService } from '@/modules/player/services/player.client.service';
import { MyTournamentCard } from '@/modules/player/components/MyTournamentCard';
import { EmptyState } from '@/modules/player/components/EmptyState';
import { MOCK_USER_ID } from '@/modules/player/constants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { DashboardGrid } from '@/components/shared/DashboardGrid';
import { DataList } from '@/components/shared/DataList';
import { Trophy, Search } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'My Tournaments | DAFT Arena',
  description: 'Manage your tournament registrations and history.',
};

export default async function MyTournamentsPage() {
  const tournaments = await PlayerService.getMyTournaments(MOCK_USER_ID);

  const upcoming = tournaments.filter(
    (t) => t.status === 'REGISTERED' || t.status === 'PENDING_PAYMENT'
  );
  const completed = tournaments.filter((t) => t.status === 'COMPLETED');
  const cancelled = tournaments.filter((t) => t.status === 'CANCELLED');

  const TabGrid = ({ items }: { items: typeof tournaments }) => (
    <DataList
      items={items}
      gridCols={3}
      layout="grid"
      emptyTitle="No tournaments here"
      emptyDescription="Nothing to show for this filter."
      emptyIcon={Trophy}
      renderItem={(t) => (
        <MyTournamentCard key={t.id} tournament={t} />
      )}
    />
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Header */}
      <SectionHeader
        title="My Tournaments"
        description="Manage your registrations and review your history."
        icon={Trophy}
        titleSize="xl"
        action={
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                {tournaments.length}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Entries</p>
            </div>
            <Link
              href="/workspace/player/tournaments"
              className="flex items-center gap-2 h-10 px-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-violet-500/20 transition-colors"
              aria-label="Find new tournaments"
            >
              <Search className="w-4 h-4" />
              Find More
            </Link>
          </div>
        }
      />

      {/* Pending payment alert */}
      {tournaments.some((t) => t.status === 'PENDING_PAYMENT') && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0 animate-pulse" />
          <div>
            <p className="font-semibold text-amber-400 mb-0.5">Payment Required</p>
            <p className="text-amber-400/80 text-xs">
              You have {tournaments.filter((t) => t.status === 'PENDING_PAYMENT').length} registration(s) pending payment.
              Complete payment to confirm your spot.
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-card/60 backdrop-blur-md border border-white/5 mb-6 h-10">
          <TabsTrigger value="all" className="text-xs font-semibold">
            All
            <span className="ml-1.5 text-[10px] bg-white/10 px-1.5 py-0.5 rounded-md">
              {tournaments.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="text-xs font-semibold">
            Active
            <span className="ml-1.5 text-[10px] bg-violet-500/20 text-violet-400 px-1.5 py-0.5 rounded-md">
              {upcoming.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-xs font-semibold">
            Completed
            <span className="ml-1.5 text-[10px] bg-white/10 px-1.5 py-0.5 rounded-md">
              {completed.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="text-xs font-semibold">
            Cancelled
            <span className="ml-1.5 text-[10px] bg-white/10 px-1.5 py-0.5 rounded-md">
              {cancelled.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <TabGrid items={tournaments} />
        </TabsContent>
        <TabsContent value="upcoming" className="mt-0">
          <TabGrid items={upcoming} />
        </TabsContent>
        <TabsContent value="completed" className="mt-0">
          <TabGrid items={completed} />
        </TabsContent>
        <TabsContent value="cancelled" className="mt-0">
          <TabGrid items={cancelled} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
