import React from 'react';
import { PlayerService } from '@/modules/player/services/player.service';
import { MOCK_USER_ID } from '@/modules/player/constants';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { CertificateViewer } from '@/modules/player/components/CertificateViewer';
import { Award } from 'lucide-react';

export const metadata = {
  title: 'Accolade Certificates | DAFT Arena',
  description: 'View, download, and share your tournament participation and champion certificates.',
};

export default async function CertificatesPage() {
  const certificates = await PlayerService.getCertificates(MOCK_USER_ID);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <SectionHeader
        title="My Certificates"
        description="Official sanctioned tournament winner, runner-up, and participation certificates."
        icon={Award}
        titleSize="xl"
      />

      <CertificateViewer certificates={certificates} />
    </div>
  );
}
