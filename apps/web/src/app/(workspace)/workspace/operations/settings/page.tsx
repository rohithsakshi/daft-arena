// @ts-nocheck
'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Operations Settings</h2>
          <p className="text-muted-foreground">Configure tournament operations rules.</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Check-in Rules</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Late threshold (minutes before match)</Label>
            <Input defaultValue="15" type="number" className="max-w-xs" />
          </div>
          <div className="space-y-2">
            <Label>Walkover threshold (minutes after match start)</Label>
            <Input defaultValue="10" type="number" className="max-w-xs" />
          </div>
          <Button>Save Check-in Rules</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Emergency Broadcast Channel ID</Label>
            <Input defaultValue="#general-broadcast" className="max-w-xs" />
          </div>
          <Button>Save Notification Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
}
