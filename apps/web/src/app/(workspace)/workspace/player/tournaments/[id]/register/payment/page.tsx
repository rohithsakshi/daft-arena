import React from 'react';
import { PlayerService } from '@/modules/player/services/player.service';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { CreditCard, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Secure checkout Payment | DAFT Arena',
  description: 'Complete registration fees transacting details.',
};

// Checkout Client Wrapper
import { PaymentCheckoutClient } from '@/app/(workspace)/workspace/player/tournaments/[id]/register/payment/PaymentCheckoutClient';

export default async function TournamentPaymentPage({
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
          title="Payment Checkout"
          description="Complete entry fee payment transaction."
          titleSize="xl"
        />
        <EmptyState
          icon={AlertCircle}
          title="Registration Not Found"
          description="We couldn't retrieve the tournament details for this checkout."
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
        title="Secure Payment Checkout"
        description={`Checkout transaction for ${tournament.title}`}
        icon={CreditCard}
        titleSize="xl"
      />

      <PaymentCheckoutClient tournamentId={tournament.id} />
    </div>
  );
}
