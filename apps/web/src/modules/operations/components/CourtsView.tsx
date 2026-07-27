'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function CourtsView({ tournamentId }: { tournamentId: string }) {
  const [courts, setCourts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/operations/courts?tournamentId=${tournamentId}`)
      .then(res => res.json())
      .then(data => {
        setCourts(data || []);
        setLoading(false);
      });
  }, [tournamentId]);

  if (loading) return <div className="text-white p-4">Loading courts...</div>;
  if (!courts.length) return <div className="text-white p-4">No courts found. Ensure venues are attached to this tournament.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courts.map((court: any) => (
        <Card key={court.id} className="bg-gray-800 border-gray-700">
          <CardHeader className="py-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg text-white font-medium">{court.name}</CardTitle>
              <span className={`text-xs px-2 py-1 rounded-full ${
                court.status === 'Occupied' ? 'bg-red-600/20 text-red-400' :
                court.status === 'Available' ? 'bg-green-600/20 text-green-400' :
                'bg-yellow-600/20 text-yellow-400'
              }`}>
                {court.status}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            {court.currentMatchId ? (
              <div className="text-sm">
                <p className="text-gray-400 mb-1">Current Match</p>
                <p className="text-white font-semibold">{court.currentMatchTitle}</p>
              </div>
            ) : (
              <div className="text-sm text-gray-500 italic">No active match</div>
            )}
            
            {court.nextMatchTime && (
              <div className="text-sm mt-3 border-t border-gray-700 pt-3">
                <p className="text-gray-400 mb-1">Next Scheduled Match</p>
                <p className="text-white font-semibold">{court.nextMatchTime}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
