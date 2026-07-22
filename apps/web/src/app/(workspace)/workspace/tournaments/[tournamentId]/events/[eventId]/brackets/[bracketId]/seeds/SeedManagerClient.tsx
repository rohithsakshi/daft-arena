'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function SeedManagerClient({ bracketId }: { bracketId: string }) {
  // Placeholder for react-beautiful-dnd or dnd-kit integration
  const seeds = [
    { id: '1', participantName: 'Player One', seed: 1 },
    { id: '2', participantName: 'Player Two', seed: 2 },
    { id: '3', participantName: 'Player Three', seed: 3 },
    { id: '4', participantName: 'Player Four', seed: 4 },
  ];

  const handleSave = () => {
    toast.success("Seeds saved successfully!");
  };

  return (
    <Card className="max-w-3xl mx-auto mt-8 border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Seed Manager
        </CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">Randomize</Button>
          <Button size="sm" onClick={handleSave}>Save Seeds</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {seeds.map((s) => (
            <div key={s.id} className="flex items-center p-3 bg-muted/30 rounded-lg border border-border cursor-grab hover:bg-muted/50 transition-colors">
              <div className="w-8 font-mono font-bold text-muted-foreground">#{s.seed}</div>
              <div className="flex-1 font-medium">{s.participantName}</div>
              <div className="text-xs px-2 py-1 bg-background rounded border">Drag to reorder</div>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-6 text-center">
          Drag and drop participants to manually adjust seeding before generating the draw.
        </p>
      </CardContent>
    </Card>
  );
}
