// @ts-nocheck
import React from 'react';
import { PlayerService } from '@/modules/player/services/player.client.service';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Registration Success | DAFT Arena',
  description: 'Your category entries have been secured and invoice processed.',
};

// Success Page Client Wrapper
import { SuccessConfirmationClient } from '@/app/(workspace)/workspace/player/tournaments/[id]/register/success/SuccessConfirmationClient';

export default async function TournamentSuccessPage({
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
          title="Registration Success"
          description="Tournament pass and receipt logs."
          titleSize="xl"
        />
        <EmptyState
          icon={AlertCircle}
          title="Tournament Detail Error"
          description="We couldn't retrieve the tournament details for this receipt."
          action={
            <Link
              href="/workspace/player/tournaments"
              className="inline-flex items-center gap-2 h-10 px-5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              Browse Tournaments
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <SectionHeader
        title="Registration Completed"
        description={`Confirmation receipt and entry pass for ${tournament.title}`}
        icon={ShieldCheck}
        titleSize="xl"
      />

      <SuccessConfirmationClient tournament={tournament} />
    </div>
  );
}
