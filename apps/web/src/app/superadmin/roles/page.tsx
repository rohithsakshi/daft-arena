import React from 'react';
import RolesClient from './RolesClient';
import connectToDatabase from '@/lib/db/mongoose';
import { PlatformSettingsModel } from '@/modules/settings/models/PlatformSettings';

export const dynamic = 'force-dynamic';

export default async function RolesPage() {
  await connectToDatabase();
  
  const settings = await PlatformSettingsModel.findOne().lean();
  let enabledRoles = ['PLAYER', 'TOURNAMENT_ADMIN', 'SPONSOR']; // defaults
  
  if (settings && Array.isArray(settings.enabledRoles)) {
    enabledRoles = settings.enabledRoles;
  }

  return <RolesClient initialEnabledRoles={enabledRoles} />;
}
