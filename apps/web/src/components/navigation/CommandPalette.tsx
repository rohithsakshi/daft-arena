'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Trophy, Users, MapPin, Calendar, Search, Home, Settings,
  CreditCard, Medal, User, BarChart3, FileText, Shield, Loader2,
  ArrowRight
} from 'lucide-react';

interface SearchResult {
  id: string;
  label: string;
  description?: string;
  href: string;
  icon: React.ElementType;
  category: string;
}

const QUICK_LINKS: SearchResult[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/workspace', icon: Home, category: 'Navigation' },
  { id: 'tournaments', label: 'Tournaments', description: 'Browse all tournaments', href: '/workspace/tournaments', icon: Trophy, category: 'Navigation' },
  { id: 'player-dashboard', label: 'Player Dashboard', href: '/workspace/player', icon: User, category: 'Navigation' },
  { id: 'rankings', label: 'Rankings', href: '/workspace/player/rankings', icon: Medal, category: 'Navigation' },
  { id: 'sponsor-dashboard', label: 'Sponsor Dashboard', href: '/workspace/sponsor', icon: BarChart3, category: 'Navigation' },
  { id: 'finance', label: 'Finance', href: '/workspace/finance', icon: CreditCard, category: 'Navigation' },
  { id: 'operations', label: 'Operations', href: '/workspace/operations', icon: MapPin, category: 'Navigation' },
  { id: 'organizations', label: 'Organizations', href: '/workspace/organizations/demo-club', icon: Shield, category: 'Navigation' },
  { id: 'settings', label: 'Settings', href: '/workspace/admin/settings', icon: Settings, category: 'Navigation' },
  { id: 'new-tournament', label: 'Create Tournament', description: 'Start a new tournament', href: '/workspace/tournaments/new', icon: Trophy, category: 'Actions' },
  { id: 'profile', label: 'My Profile', href: '/workspace/player/profile', icon: User, category: 'Actions' },
  { id: 'documents', label: 'Documents', href: '/workspace/player/documents', icon: FileText, category: 'Actions' },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const closePalette = useCallback(() => {
    setOpen(false);
    setQuery('');
    setResults([]);
    setSelectedIndex(0);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        closePalette();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [closePalette]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      const q = query.toLowerCase();
      const filtered = QUICK_LINKS.filter(
        (item) =>
          item.label.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
      setResults(filtered);
      setIsSearching(false);
      setSelectedIndex(0);
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = useCallback(
    (href: string) => {
      closePalette();
      router.push(href);
    },
    [closePalette, router]
  );

  const displayItems = query.trim() ? results : QUICK_LINKS;

  useEffect(() => {
    const handleArrowKeys = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, displayItems.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && displayItems[selectedIndex]) {
        e.preventDefault();
        handleSelect(displayItems[selectedIndex].href);
      }
    };
    document.addEventListener('keydown', handleArrowKeys);
    return () => document.removeEventListener('keydown', handleArrowKeys);
  }, [open, displayItems, selectedIndex, handleSelect]);

  if (!open) return null;

  // Group items by category
  const grouped = displayItems.reduce(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, SearchResult[]>
  );

  let globalIndex = 0;

  return (
    <div
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
      onClick={closePalette}
    >
      <div
        className="fixed left-[50%] top-[15%] z-50 w-full max-w-xl translate-x-[-50%] border border-border/50 bg-card shadow-2xl sm:rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center border-b border-border px-4 py-3 gap-3">
          <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <input
            ref={inputRef}
            className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground/60 text-foreground"
            placeholder="Search or jump to..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {isSearching && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto p-2">
          {displayItems.length === 0 && query.trim() && !isSearching ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="mb-2">
                <div className="px-2 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {category}
                </div>
                {items.map((item) => {
                  const currentIndex = globalIndex++;
                  const Icon = item.icon;
                  const isSelected = currentIndex === selectedIndex;

                  return (
                    <button
                      key={item.id}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                        isSelected
                          ? 'bg-violet-600/10 text-violet-500'
                          : 'text-foreground hover:bg-muted'
                      }`}
                      onClick={() => handleSelect(item.href)}
                      onMouseEnter={() => setSelectedIndex(currentIndex)}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <span className="font-medium">{item.label}</span>
                        {item.description && (
                          <span className="ml-2 text-xs text-muted-foreground">{item.description}</span>
                        )}
                      </div>
                      {isSelected && <ArrowRight className="h-3.5 w-3.5 text-violet-500 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div className="border-t border-border px-4 py-2 flex items-center gap-4 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1"><kbd className="rounded border bg-muted px-1 py-0.5 font-mono text-[10px]">↑↓</kbd> navigate</span>
          <span className="flex items-center gap-1"><kbd className="rounded border bg-muted px-1 py-0.5 font-mono text-[10px]">↵</kbd> select</span>
          <span className="flex items-center gap-1"><kbd className="rounded border bg-muted px-1 py-0.5 font-mono text-[10px]">ESC</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
