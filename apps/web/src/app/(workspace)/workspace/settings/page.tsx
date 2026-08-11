import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account and preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            The settings module is currently under development. Please check back later for account configuration, notifications, and privacy options.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 rounded-xl border border-dashed border-white/20 bg-white/5">
            <p className="text-muted-foreground text-sm max-w-md">
              We're building a comprehensive settings panel to give you full control over your DAFT Arena experience.
            </p>
            <Button variant="outline" disabled>Settings Unavailable</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
