'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function MatchesView({ tournamentId }: { tournamentId: string }) {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/operations/matches?tournamentId=${tournamentId}`)
      .then(res => res.json())
      .then(data => {
        setMatches(data || []);
        setLoading(false);
      });
  }, [tournamentId]);

  if (loading) return <div className="text-white p-4">Loading matches...</div>;
  if (!matches.length) return <div className="text-white p-4">No matches scheduled yet.</div>;

  return (
    <div className="space-y-4">
      {matches.map((match: any) => (
        <Card key={match._id} className="bg-gray-800 border-gray-700">
          <CardHeader className="py-3 px-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-md text-white font-medium">Match {match._id}</CardTitle>
              <span className={`text-xs px-2 py-1 rounded-full ${
                match.status === 'IN_PROGRESS' ? 'bg-green-600/20 text-green-400' :
                match.status === 'COMPLETED' ? 'bg-gray-600/20 text-gray-400' :
                'bg-blue-600/20 text-blue-400'
              }`}>
                {match.status}
              </span>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0">
            <div className="flex justify-between items-center bg-gray-900/50 p-3 rounded-lg border border-gray-700">
              <div className="text-sm text-gray-300 font-semibold truncate flex-1 text-center">
                {match.participants?.[0]?.name || 'TBD'}
              </div>
              <div className="text-sm font-bold text-gray-500 mx-4">VS</div>
              <div className="text-sm text-gray-300 font-semibold truncate flex-1 text-center">
                {match.participants?.[1]?.name || 'TBD'}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
