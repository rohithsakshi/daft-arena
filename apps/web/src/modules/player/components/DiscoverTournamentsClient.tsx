// @ts-nocheck
'use client';

import React from 'react';
import { TournamentSearchCard } from '@/modules/player/components/TournamentSearchCard';
import { EmptyState } from '@/modules/player/components/EmptyState';
import { CardSkeleton } from '@/modules/player/components/LoadingSkeleton';
import { DataList } from '@/components/shared/DataList';
import { useDiscoverTournaments, SortOption } from '@/modules/player/hooks/useDiscoverTournaments';
import { DiscoverTournament } from '@/modules/player/types';
import { Search, SlidersHorizontal, X, ChevronDown, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'date_asc', label: 'Date (Soonest)' },
  { value: 'date_desc', label: 'Date (Latest)' },
  { value: 'fee_asc', label: 'Entry Fee (Low → High)' },
  { value: 'fee_desc', label: 'Entry Fee (High → Low)' },
  { value: 'fill_desc', label: 'Most Popular' },
];

const STATUS_OPTIONS = [
  { value: 'REGISTRATION_OPEN', label: 'Registration Open' },
  { value: 'UPCOMING', label: 'Upcoming' },
  { value: 'ONGOING', label: 'Ongoing' },
  { value: 'COMPLETED', label: 'Completed' },
];

interface DiscoverTournamentsClientProps {
  initialTournaments: DiscoverTournament[];
}

export function DiscoverTournamentsClient({ initialTournaments }: DiscoverTournamentsClientProps) {
  const {
    filters,
    updateFilter,
    resetFilters,
    filteredTournaments,
    availableSports,
    availableLocations,
    activeFilterCount,
    filteredCount,
    totalCount,
  } = useDiscoverTournaments(initialTournaments);

  const [showFilters, setShowFilters] = React.useState(false);

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
          <input
            id="tournament-search"
            type="text"
            value={filters.query}
            onChange={(e) => updateFilter('query', e.target.value)}
            placeholder="Search by name, sport, venue, or location…"
            className={cn(
              'w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-card/60 backdrop-blur-md',
              'text-sm text-foreground placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all'
            )}
            aria-label="Search tournaments"
          />
          {filters.query && (
            <button
              onClick={() => updateFilter('query', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <Button
          variant="outline"
          onClick={() => setShowFilters((v) => !v)}
          className={cn(
            'h-11 border-white/10 bg-card/60 backdrop-blur-md text-sm gap-2 flex-shrink-0',
            showFilters && 'border-violet-500/50 bg-violet-500/10 text-violet-400'
          )}
          aria-expanded={showFilters}
          aria-label="Toggle filters"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-violet-500 text-white text-[10px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown className={cn('w-4 h-4 transition-transform', showFilters && 'rotate-180')} />
        </Button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="p-5 rounded-2xl border border-white/8 bg-card/50 backdrop-blur-md space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Sport */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Sport
              </label>
              <select
                value={filters.sport}
                onChange={(e) => updateFilter('sport', e.target.value)}
                className={cn(
                  'w-full h-9 px-3 rounded-lg border border-white/10 bg-card text-sm text-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-violet-500/50'
                )}
                aria-label="Filter by sport"
              >
                <option value="">All Sports</option>
                {availableSports.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Location
              </label>
              <select
                value={filters.location}
                onChange={(e) => updateFilter('location', e.target.value)}
                className={cn(
                  'w-full h-9 px-3 rounded-lg border border-white/10 bg-card text-sm text-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-violet-500/50'
                )}
                aria-label="Filter by location"
              >
                <option value="">All Locations</option>
                {availableLocations.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => updateFilter('status', e.target.value)}
                className={cn(
                  'w-full h-9 px-3 rounded-lg border border-white/10 bg-card text-sm text-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-violet-500/50'
                )}
                aria-label="Filter by status"
              >
                <option value="">All Statuses</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilter('sortBy', e.target.value as SortOption)}
                className={cn(
                  'w-full h-9 px-3 rounded-lg border border-white/10 bg-card text-sm text-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-violet-500/50'
                )}
                aria-label="Sort tournaments"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-violet-400 transition-colors"
              aria-label="Reset all filters"
            >
              <X className="w-3.5 h-3.5" />
              Reset all filters
            </button>
          )}
        </div>
      )}

      {/* Results header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredCount}</span>
          {filteredCount !== totalCount && (
            <> of <span className="font-semibold text-foreground">{totalCount}</span></>
          )} tournaments
        </p>
      </div>

      {/* Grid */}
      <DataList
        items={filteredTournaments}
        gridCols={3}
        layout="grid"
        emptyTitle="No Tournaments Found"
        emptyDescription="Try adjusting your search or filters to find tournaments."
        emptyIcon={Trophy}
        emptyAction={
          <Button variant="outline" onClick={resetFilters} className="border-white/10">
            Clear Filters
          </Button>
        }
        renderItem={(tournament: any) => (
          <TournamentSearchCard tournament={tournament} />
        )}
      />
    </div>
  );
}
