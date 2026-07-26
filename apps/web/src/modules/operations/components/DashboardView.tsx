'use client';
import React, { useEffect, useState } from 'react';

export function DashboardView({ tournamentId }: { tournamentId: string }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/operations/dashboard?tournamentId=${tournamentId}`)
      .then(r => r.json())
      .then(setData);
  }, [tournamentId]);

  if (!data) return <div className="text-white">Loading Operations Dashboard...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Live Matches" value={data.liveMatchesCount} />
      <StatCard title="Delayed Matches" value={data.delayedMatchesCount} />
      <StatCard title="Open Incidents" value={data.openIncidentsCount} />
      <StatCard title="Players Checked In" value={data.checkedInPlayersCount} />
    </div>
  );
}

function StatCard({ title, value }: { title: string, value: number }) {
  return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700 shadow-lg">
      <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold text-white mt-2">{value}</p>
    </div>
  );
}
