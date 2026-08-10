// @ts-nocheck
'use client';

import { useState, useCallback, useMemo } from 'react';
import { DiscoverTournament } from '../types';

export type SortOption = 'date_asc' | 'date_desc' | 'fee_asc' | 'fee_desc' | 'fill_desc';

export interface TournamentFilters {
  query: string;
  sport: string;
  location: string;
  status: string;
  sortBy: SortOption;
}

const DEFAULT_FILTERS: TournamentFilters = {
  query: '',
  sport: '',
  location: '',
  status: '',
  sortBy: 'date_asc',
};

/**
 * useDiscoverTournaments
 *
 * Client-side filtering and sorting hook for the Discover Tournaments page.
 * Filters run on the already-fetched tournaments list (passed in from server).
 * Future: replace `tournaments` prop with a TanStack Query call to the API.
 */
export function useDiscoverTournaments(tournaments: DiscoverTournament[]) {
  const [filters, setFilters] = useState<TournamentFilters>(DEFAULT_FILTERS);

  const updateFilter = useCallback(<K extends keyof TournamentFilters>(
    key: K,
    value: TournamentFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  const availableSports = useMemo(() => {
    const all = tournaments.flatMap((t) => t.sports || []);
    return Array.from(new Set(all)).filter(Boolean).sort();
  }, [tournaments]);

  const availableLocations = useMemo(() => {
    const all = tournaments.map((t) => t.location || t.city).filter(Boolean);
    return Array.from(new Set(all)).sort();
  }, [tournaments]);

  const filteredAndSorted = useMemo(() => {
    let result = [...tournaments];

    if (filters.query) {
      const q = filters.query.toLowerCase();
      result = result.filter(
        (t) =>
          (t.title || t.name || '').toLowerCase().includes(q) ||
          (t.location || t.city || '').toLowerCase().includes(q) ||
          (t.venueName || t.venue || '').toLowerCase().includes(q) ||
          (t.sports || []).some((s) => s.toLowerCase().includes(q)) ||
          (t.organizerName || t.organizer || '').toLowerCase().includes(q)
      );
    }

    if (filters.sport) {
      result = result.filter((t) => (t.sports || []).includes(filters.sport));
    }

    if (filters.location) {
      result = result.filter((t) => (t.location || t.city) === filters.location);
    }

    if (filters.status) {
      const normFilter = filters.status.replace(/_/g, '').toLowerCase();
      result = result.filter((t) => (t.status || '').replace(/_/g, '').toLowerCase() === normFilter);
    }

    result.sort((a: any, b: any) => {
      switch (filters.sortBy) {
        case 'date_asc':
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case 'date_desc':
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        case 'fee_asc':
          return (a.entryFee ?? 0) - (b.entryFee ?? 0);
        case 'fee_desc':
          return (b.entryFee ?? 0) - (a.entryFee ?? 0);
        case 'fill_desc': {
          const fillA = a.capacity && a.registeredCount ? a.registeredCount / a.capacity : 0;
          const fillB = b.capacity && b.registeredCount ? b.registeredCount / b.capacity : 0;
          return fillB - fillA;
        }
        default:
          return 0;
      }
    });

    return result;
  }, [tournaments, filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.query) count++;
    if (filters.sport) count++;
    if (filters.location) count++;
    if (filters.status) count++;
    if (filters.sortBy !== 'date_asc') count++;
    return count;
  }, [filters]);

  return {
    filters,
    updateFilter,
    resetFilters,
    filteredTournaments: filteredAndSorted,
    availableSports,
    availableLocations,
    activeFilterCount,
    totalCount: tournaments.length,
    filteredCount: filteredAndSorted.length,
  };
}
