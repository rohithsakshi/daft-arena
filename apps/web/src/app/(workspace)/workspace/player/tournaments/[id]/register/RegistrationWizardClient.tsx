// @ts-nocheck
'use client';

import React from 'react';
import { TournamentDetail } from '@/modules/player/types';
import { RegistrationWizard } from '@/modules/player/components/RegistrationWizard';
import { useRouter } from 'next/navigation';

export function RegistrationWizardClient({ tournament }: { tournament: TournamentDetail }) {
  const router = useRouter();

  const handleSubmit = (data: { selectedEvents: string[]; partnerId?: string; docUrl?: string }) => {
    // Calculate total using per-event fees if available
    const totalAmount = data.selectedEvents.reduce((sum, eventId) => {
      const ev = tournament.events?.find(e => e.id === eventId);
      return sum + (ev?.entryFee ?? tournament.baseEntryFee ?? 0);
    }, 0);

    // Save draft registration details in sessionStorage
    const registrationDraft = {
      tournamentId: tournament.id,
      selectedEvents: data.selectedEvents,
      partnerId: data.partnerId,
      docUrl: data.docUrl,
      baseFee: tournament.baseEntryFee,
      currency: tournament.currency,
      totalAmount
    };
    sessionStorage.setItem(`registration_draft_${tournament.id}`, JSON.stringify(registrationDraft));
    
    // Redirect to checkout payment screen
    router.push(`/workspace/player/tournaments/${tournament.id}/register/payment`);
  };

  const handleCancel = () => {
    router.push(`/workspace/player/tournaments/${tournament.id}`);
  };

  return (
    <RegistrationWizard
      tournament={tournament}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}
