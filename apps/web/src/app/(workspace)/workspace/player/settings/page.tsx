// @ts-nocheck
import React from 'react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { SettingsSection } from '@/modules/player/components/SettingsSection';
import { Settings } from 'lucide-react';

export const metadata = {
  title: 'Settings | DAFT Arena',
  description: 'Manage your player preferences and account settings.',
};

export default function PlayerSettingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 max-w-4xl">
      <SectionHeader
        title="Player Settings"
        description="Configure your account preferences, theme modes, notifications and danger targets."
        icon={Settings}
        titleSize="xl"
      />

      <SettingsSection />
    </div>
  );
}
