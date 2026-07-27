'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function OfficialsView({ tournamentId }: { tournamentId: string }) {
  const [officials, setOfficials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/operations/officials?tournamentId=${tournamentId}`)
      .then(res => res.json())
      .then(response => {
        setOfficials(response.data || []);
        setLoading(false);
      });
  }, [tournamentId]);

  if (loading) return <div className="text-white p-4">Loading officials...</div>;
  if (!officials.length) return <div className="text-white p-4">No officials assigned to this tournament.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {officials.map((official: any) => (
        <Card key={official.id} className="bg-gray-800 border-gray-700">
          <CardHeader className="py-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg text-white font-medium">{official.name}</CardTitle>
              <span className={`text-xs px-2 py-1 rounded-full ${
                official.status === 'Active' ? 'bg-green-600/20 text-green-400' :
                official.status === 'Assigned' ? 'bg-blue-600/20 text-blue-400' :
                'bg-gray-600/20 text-gray-400'
              }`}>
                {official.status}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <p className="text-gray-400 mb-1">Role</p>
              <p className="text-white font-semibold">{official.role}</p>
            </div>
            
            {official.currentAssignmentId && (
              <div className="text-sm mt-3 border-t border-gray-700 pt-3">
                <p className="text-gray-400 mb-1">Current Assignment</p>
                <p className="text-white font-semibold">Match ID: {official.currentAssignmentId}</p>
              </div>
            )}
            
            {official.rating && (
              <div className="text-sm mt-3 border-t border-gray-700 pt-3 flex justify-between">
                <span className="text-gray-400">Rating</span>
                <span className="text-yellow-400 font-bold">★ {official.rating}</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
