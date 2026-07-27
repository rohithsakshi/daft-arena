import React from 'react';
import { PlatformSettingsService } from '@/modules/settings/services/PlatformSettingsService';
import { RoleToggles } from './RoleToggles';
import { Shield } from 'lucide-react';

export const metadata = {
  title: 'Platform Role Settings | DAFT Arena',
};

export default async function AdminRolesSettingsPage() {
  const enabledRoles = await PlatformSettingsService.getEnabledRoles();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20">
          <Shield className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-xs font-semibold text-violet-400 tracking-wide">PLATFORM SECURITY</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Role Feature Flags</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Dynamically enable or disable platform roles. Changes are applied instantly across the entire platform. Users with disabled roles will see a temporary maintenance message instead of their dashboard.
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <RoleToggles initialEnabled={enabledRoles} />
      </div>
    </div>
  );
}
