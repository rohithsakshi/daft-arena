'use client';

import React, { useEffect, useState } from 'react';
import { Bell, Search, Moon, Sun, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import Link from 'next/link';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [notifications] = useState(2); // TODO: real notification count

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleCommandPalette = () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }));
  };

  return (
    <header className="h-16 bg-card/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40">
      <div className="flex items-center flex-1">
        <div className="max-w-md w-full relative hidden sm:block">
          <button
            className="w-full bg-muted/50 border border-border rounded-lg pl-9 pr-16 py-2 text-sm text-left text-muted-foreground hover:bg-muted/80 transition-colors cursor-pointer flex items-center gap-2"
            onClick={toggleCommandPalette}
            title="Open command palette (Ctrl+K)"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            Search tournaments, players, matches...
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
              <span className="text-xs">Ctrl</span>K
            </kbd>
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {/* Notifications */}
        <Link href="/workspace/player/notifications" title="Notifications">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-muted-foreground" />
            {notifications > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
            )}
          </Button>
        </Link>

        {/* Theme Toggle */}
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Moon className="h-5 w-5 text-muted-foreground" />
            )}
          </Button>
        )}
      </div>
    </header>
  );
}
