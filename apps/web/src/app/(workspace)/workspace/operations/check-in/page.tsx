// @ts-nocheck
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { QrCode, Search, UserCheck } from 'lucide-react';
import { ICheckIn } from '@/modules/operations/models';
import { Input } from '@/components/ui/input';

export default function CheckInCenterPage() {
  const [checkIns, setCheckIns] = useState<ICheckIn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/operations/check-ins?tournamentId=current')
      .then(res => res.json())
      .then(data => {
        if (data.success) setCheckIns(data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Check-In Center</h2>
          <p className="text-muted-foreground">Manage player arrivals and verify identities.</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline"><QrCode className="mr-2 h-4 w-4" /> Scan Pass</Button>
          <Button><UserCheck className="mr-2 h-4 w-4" /> Manual Check-in</Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Today&apos;s Arrivals</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search player..." className="pl-8" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-muted-foreground">Loading check-ins...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Player Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Check-In Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {checkIns.map(checkIn => (
                  <TableRow key={checkIn.id}>
                    <TableCell className="font-medium">{checkIn.participantName}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        checkIn.status === 'CheckedIn' ? 'bg-green-500/20 text-green-400' :
                        checkIn.status === 'Late' ? 'bg-orange-500/20 text-orange-400' :
                        checkIn.status === 'NoShow' ? 'bg-red-500/20 text-red-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {checkIn.status}
                      </span>
                    </TableCell>
                    <TableCell>{checkIn.checkInTime ? new Date(checkIn.checkInTime).toLocaleTimeString() : '--'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" disabled={checkIn.status === 'CheckedIn'}>
                        {checkIn.status === 'CheckedIn' ? 'Verified' : 'Verify'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {checkIns.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No check-ins today.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
