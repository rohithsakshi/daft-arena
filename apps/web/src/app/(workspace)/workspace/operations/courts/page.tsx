// @ts-nocheck
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ICourtStatus } from '@/modules/operations/models';

export default function CourtsPage() {
  const [courts, setCourts] = useState<ICourtStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/operations/courts?tournamentId=current')
      .then(res => res.json())
      .then(data => {
        if (data.success) setCourts(data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Court Operations</h2>
          <p className="text-muted-foreground">Monitor and manage playing areas in real-time.</p>
        </div>
      </div>

      {loading ? (
        <div className="py-8 text-center text-muted-foreground">Loading courts...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courts.map(court => (
            <Card key={court.id} className="relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-full h-1 ${
                court.status === 'Occupied' ? 'bg-green-500' :
                court.status === 'Available' ? 'bg-blue-500' :
                court.status === 'Maintenance' ? 'bg-yellow-500' :
                court.status === 'Delayed' ? 'bg-red-500' : 'bg-gray-500'
              }`} />
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{court.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-normal ${
                    court.status === 'Occupied' ? 'bg-green-500/20 text-green-400' :
                    court.status === 'Available' ? 'bg-blue-500/20 text-blue-400' :
                    court.status === 'Maintenance' ? 'bg-yellow-500/20 text-yellow-400' :
                    court.status === 'Delayed' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {court.status}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {court.currentMatchTitle ? (
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Current Match</p>
                      <p className="font-medium text-sm mt-1">{court.currentMatchTitle}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Status</p>
                      <p className="text-sm mt-1">Ready for next assignment</p>
                    </div>
                  )}
                  {court.nextMatchTime && (
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Next Match</p>
                      <p className="text-sm mt-1">{court.nextMatchTime}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
