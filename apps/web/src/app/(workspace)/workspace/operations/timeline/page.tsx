// @ts-nocheck
'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TimelinePage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/operations/timeline').then(res => res.json()).then(res => {
      if(res.success) setData(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Operations Timeline</h2>
          <p className="text-muted-foreground">Live feed of tournament events.</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Today's Log</CardTitle></CardHeader>
        <CardContent>
          {loading ? <p>Loading...</p> : (
            <div className="space-y-4 border-l-2 border-primary pl-4 ml-2">
              {data.map(d => (
                <div key={d.id} className="relative">
                  <div className="absolute -left-[23px] top-1 h-3 w-3 rounded-full bg-primary" />
                  <p className="text-sm font-bold">{d.time}</p>
                  <p className="text-muted-foreground">{d.event}</p>
                  <span className="text-xs text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full inline-block mt-1">{d.type}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
