// @ts-nocheck
'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ReportsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">Export operations data.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Daily Operations Report</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Comprehensive summary of check-ins, matches, and incidents for the day.</p>
            <div className="flex space-x-2">
              <Button>Export PDF</Button>
              <Button variant="outline">Export Excel</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader><CardTitle>Official Attendance</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Shift logs, assignments, and check-out times for all staff.</p>
            <div className="flex space-x-2">
              <Button>Export PDF</Button>
              <Button variant="outline">Export Excel</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
