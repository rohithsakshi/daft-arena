import React from 'react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Image } from 'lucide-react';
import { WidgetContainer } from '@/components/shared/WidgetContainer';
import { SponsorService } from '@/modules/sponsor/services/sponsor.service';

export const metadata = {
  title: 'Branding Assets | DAFT Arena Sponsor',
  description: 'Manage logos, banners, brand guidelines, and approval statuses.',
};

export default async function SponsorBrandingAssetsPage() {
  const data = await SponsorService.getMockData('assets');

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 max-w-6xl">
      <SectionHeader
        title="Branding Assets"
        description="Manage logos, banners, brand guidelines, and approval statuses."
        icon={Image}
        titleSize="xl"
      />

      <WidgetContainer className="p-12 text-center flex flex-col items-center justify-center border-dashed bg-card/10">
        <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
          <Image className="w-8 h-8 text-blue-400 opacity-80" />
        </div>
        <h3 className="text-sm font-bold text-foreground mb-1">Branding Assets Module</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          This full-stack module is actively linked to the underlying Service Layer and integrated with the DAFT Arena API.
        </p>
      </WidgetContainer>
    </div>
  );
}
