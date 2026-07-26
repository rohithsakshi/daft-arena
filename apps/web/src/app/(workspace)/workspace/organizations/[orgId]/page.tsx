import React from 'react';
import { OrgDashboard } from '@/modules/organizations/components/OrgDashboard';

export default function OrganizationPage({ params }: { params: { orgId: string } }) {
  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
        Organization Dashboard
      </h1>
      <OrgDashboard orgId={params.orgId} />
    </div>
  );
}
