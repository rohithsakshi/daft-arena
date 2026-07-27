'use client';

import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DashboardView } from './DashboardView';
import { MatchesView } from './MatchesView';
import { CourtsView } from './CourtsView';
import { OfficialsView } from './OfficialsView';

export function OperationsTabsClient({ tournamentId }: { tournamentId: string }) {
  return (
    <Tabs defaultValue="dashboard" className="w-full">
      <TabsList className="mb-6 bg-gray-800 border border-gray-700">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="matches">Matches</TabsTrigger>
        <TabsTrigger value="courts">Courts</TabsTrigger>
        <TabsTrigger value="officials">Officials</TabsTrigger>
      </TabsList>
      
      <TabsContent value="dashboard">
        <DashboardView tournamentId={tournamentId} />
      </TabsContent>
      
      <TabsContent value="matches">
        <MatchesView tournamentId={tournamentId} />
      </TabsContent>
      
      <TabsContent value="courts">
        <CourtsView tournamentId={tournamentId} />
      </TabsContent>
      
      <TabsContent value="officials">
        <OfficialsView tournamentId={tournamentId} />
      </TabsContent>
    </Tabs>
  );
}
