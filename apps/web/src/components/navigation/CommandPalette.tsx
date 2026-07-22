'use client';

import React, { useEffect, useState } from 'react';
import { Trophy, Users, MapPin, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  if (!open) return null;

  // Render a basic backdrop and modal for now to prevent importing cmdk library if not yet in package.json
  // In a real execution, this would heavily wrap `cmdk` library.
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div className="fixed left-[50%] top-[20%] z-50 grid w-full max-w-lg translate-x-[-50%] gap-4 border bg-card p-0 shadow-lg sm:rounded-xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center border-b px-3">
          <input 
            className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Type a command or search..."
            autoFocus
          />
        </div>
        <div className="max-h-[300px] overflow-y-auto p-2">
          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Suggestions</div>
          <div 
            className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            onClick={() => { router.push('/tournaments'); setOpen(false); }}
          >
            <Trophy className="mr-2 h-4 w-4" />
            Tournaments
          </div>
          <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground">
            <Users className="mr-2 h-4 w-4" />
            Participants
          </div>
          <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            Schedules
          </div>
          <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground">
            <MapPin className="mr-2 h-4 w-4" />
            Venues
          </div>
        </div>
      </div>
    </div>
  );
}
