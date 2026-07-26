// @ts-nocheck
import React from 'react';
import { PlayerService } from '@/modules/player/services/player.client.service';
import { MOCK_USER_ID } from '@/modules/player/constants';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { DocumentCenter } from '@/modules/player/components/DocumentCenter';
import { FileText } from 'lucide-react';

export const metadata = {
  title: 'Documents Center | DAFT Arena',
  description: 'Manage and upload your eligibility verification documents.',
};

export default async function PlayerDocumentsPage() {
  const profile = await PlayerService.getProfile(MOCK_USER_ID);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <SectionHeader
        title="Document Center"
        description="Upload and check verification statuses of your driver license, fitness certificates, and consent waivers."
        icon={FileText}
        titleSize="xl"
      />

      <DocumentCenter initialDocuments={profile.documents || []} />
    </div>
  );
}
