// @ts-nocheck
import React from 'react';
import { PlayerService } from '@/modules/player/services/player.client.service';
import { MOCK_USER_ID } from '@/modules/player/constants';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { DigitalIdCard } from '@/modules/player/components/DigitalIdCard';
import { Shield } from 'lucide-react';

export const metadata = {
  title: 'Digital Player ID | DAFT Arena',
  description: 'Your official competitor membership ID card and QR gate pass.',
};

export default async function DigitalIdPage() {
  const profile = await PlayerService.getProfile(MOCK_USER_ID);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <SectionHeader
        title="Digital Player ID"
        description="Your official sanctioned competitor membership ID card and check-in QR code."
        icon={Shield}
        titleSize="xl"
      />

      <DigitalIdCard profile={profile} />
    </div>
  );
}
