import React from 'react';
import { PlayerService } from '@/modules/player/services/player.service';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Trophy, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Registered Tournament Details | DAFT Arena',
  description: 'Manage details, view bracket sheets, schedules and entry codes.',
};

// Client Tabs Component
import { RegisteredTournamentClient } from '@/app/(workspace)/workspace/player/my-tournaments/[id]/RegisteredTournamentClient';

export default async function RegisteredTournamentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tournament = await PlayerService.getTournamentDetail(id);

  if (!tournament) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500 pb-10">
        <SectionHeader
          title="My Tournament details"
          description="View draws and schedules."
          titleSize="xl"
        />
        <EmptyState
          icon={AlertCircle}
          title="Tournament Not Found"
          description="This tournament record could not be found."
          action={
            <Link
              href="/workspace/player/my-tournaments"
              className="inline-flex items-center gap-2 h-10 px-5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              Back to My Tournaments
            </Link>
          }
        />
      </div>
    );
  }

  // Fetch bracket tree and scheduling timeline data
  const [bracketData, scheduleTimeline] = await Promise.all([
    PlayerService.getBracketData(id),
    PlayerService.getScheduleTimeline(id),
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <SectionHeader
        title="Registered Tournament details"
        titleSize="sm"
        className="mb-4"
        action={
          <Link
            href="/workspace/player/my-tournaments"
            className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to My Tournaments
          </Link>
        }
      />

      <RegisteredTournamentClient
        tournament={tournament}
        bracket={bracketData}
        schedule={scheduleTimeline}
      />
    </div>
  );
}
