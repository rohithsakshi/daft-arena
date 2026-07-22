'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BracketServiceAPI } from '@/services/bracket.service';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function BracketViewerClient({ bracketId }: { bracketId: string }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const { data: bracket, isLoading } = useQuery({
    queryKey: ['bracket', bracketId],
    queryFn: () => BracketServiceAPI.getBracket(bracketId)
  });

  if (isLoading) {
    return <Skeleton className="w-full h-full min-h-[500px]" />;
  }

  if (!bracket) {
    return <div>Bracket not found.</div>;
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Toolbar */}
      <div className="absolute top-4 right-4 flex space-x-2 z-10 bg-background/80 p-2 rounded-lg backdrop-blur-md border shadow-sm">
        <Button variant="outline" size="sm" onClick={() => setZoom(z => Math.max(0.2, z - 0.2))}>- Zoom</Button>
        <span className="flex items-center text-sm font-medium">{Math.round(zoom * 100)}%</span>
        <Button variant="outline" size="sm" onClick={() => setZoom(z => Math.min(3, z + 0.2))}>+ Zoom</Button>
      </div>

      {/* Canvas Area */}
      <div className="w-full h-[600px] overflow-hidden cursor-grab active:cursor-grabbing border bg-muted/20 rounded-md">
        <div 
          className="w-full h-full transition-transform origin-top-left"
          style={{ transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)` }}
        >
          {/* Interactive Bracket Tree Placeholder */}
          <div className="p-8">
            <Card className="w-[200px] border-primary/20 shadow-md">
              <CardContent className="p-4 space-y-2">
                <div className="font-semibold text-sm">Round 1</div>
                <div className="bg-muted p-2 rounded text-xs border">Participant A</div>
                <div className="bg-muted p-2 rounded text-xs border">Participant B</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
