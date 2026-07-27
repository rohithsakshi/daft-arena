import React from 'react';
import { OperationsTabsClient } from '@/modules/operations/components/OperationsTabsClient';

export default function OperationsPage({ params }: { params: { tournamentId: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
        Tournament Operations
      </h1>
      <OperationsTabsClient tournamentId={params.tournamentId} />
    </div>
  );
}
