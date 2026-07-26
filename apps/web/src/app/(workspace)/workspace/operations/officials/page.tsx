// @ts-nocheck
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { IOfficial } from '@/modules/operations/models';

export default function OfficialsDirectoryPage() {
  const [officials, setOfficials] = useState<IOfficial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/operations/officials?tournamentId=current')
      .then(res => res.json())
      .then(data => {
        if (data.success) setOfficials(data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Officials Directory</h2>
          <p className="text-muted-foreground">Manage referees, umpires, and tournament staff.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Official
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Staff</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-muted-foreground">Loading officials...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {officials.map(official => (
                  <TableRow key={official.id}>
                    <TableCell className="font-medium">{official.name}</TableCell>
                    <TableCell>{official.role}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        official.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                        official.status === 'Assigned' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {official.status}
                      </span>
                    </TableCell>
                    <TableCell>{official.rating ? `${official.rating} / 5` : 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
                {officials.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No officials found.
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
