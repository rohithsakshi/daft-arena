// @ts-nocheck
'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

export default function AssignmentsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/operations/assignments').then(res => res.json()).then(res => {
      if(res.success) setData(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Match Assignments</h2>
          <p className="text-muted-foreground">Assign officials to matches.</p>
        </div>
        <Button>Auto-Assign</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Upcoming Matches</CardTitle></CardHeader>
        <CardContent>
          {loading ? <p>Loading...</p> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Match</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Court</TableHead>
                  <TableHead>Official</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map(d => (
                  <TableRow key={d.id}>
                    <TableCell>{d.matchTitle}</TableCell>
                    <TableCell>{d.time}</TableCell>
                    <TableCell>{d.court}</TableCell>
                    <TableCell>{d.officialName}</TableCell>
                    <TableCell>{d.role}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
