// @ts-nocheck
import React from 'react';
import { PlayerService } from '@/modules/player/services/player.client.service';
import { RegistrationWizard } from '@/modules/player/components/RegistrationWizard';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Trophy, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Tournament Entry Registration | DAFT Arena',
  description: 'Select events and upload credentials for registration.',
};

// Wizard Client Wrapper
import { RegistrationWizardClient } from '@/app/(workspace)/workspace/player/tournaments/[id]/register/RegistrationWizardClient';

export default async function TournamentRegistrationPage({
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
          title="Registration"
          description="Register for tournament category drafts."
          titleSize="xl"
        />
        <EmptyState
          icon={AlertCircle}
          title="Tournament Not Found"
          description="We couldn't find the tournament details for registration."
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
        title="Tournament Entry Registration"
        description={`Secure your entry slot for ${tournament.title}`}
        icon={Trophy}
        titleSize="xl"
      />

      <RegistrationWizardClient tournament={tournament} />
    </div>
  );
}
