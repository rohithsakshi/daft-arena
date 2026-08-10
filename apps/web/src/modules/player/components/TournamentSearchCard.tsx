// @ts-nocheck
'use client';

import React from 'react';
import { DiscoverTournament } from '../types';
import { TOURNAMENT_DISCOVERY_STATUS_COLORS } from '../constants';
import { formatTournamentDate, getFillPercentage } from '../utils';
import { Trophy, Calendar, MapPin, Users, Clock, ArrowRight, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface TournamentSearchCardProps {
  tournament: DiscoverTournament;
  className?: string;
}

export function TournamentSearchCard({ tournament, className }: TournamentSearchCardProps) {
  const fillPct = tournament.capacity && tournament.registeredCount
    ? getFillPercentage(tournament.registeredCount, tournament.capacity)
    : null;

  const statusLabel = tournament.status.replace('_', ' ');
  const statusColorClass = TOURNAMENT_DISCOVERY_STATUS_COLORS[tournament.status] ?? '';
  const dateRange = formatTournamentDate(tournament.startDate, tournament.endDate);

  const isAlmostFull = fillPct !== null && fillPct >= 80;

  return (
    <div className={cn(
      'group relative flex flex-col rounded-2xl border border-white/5 bg-card/60 backdrop-blur-xl shadow-lg overflow-hidden',
      'transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-violet-500/30',
      className
    )}>
      {/* Banner */}
      <div className="h-28 bg-gradient-to-br from-violet-600/30 via-purple-900/30 to-fuchsia-900/20 relative overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-500/20 to-transparent" />
        {/* Decorative grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '20px 20px' }}
        />
        <div className="absolute top-3 right-3">
          <span className={cn(
            'px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide rounded-lg border backdrop-blur-md',
            statusColorClass
          )}>
            {statusLabel}
          </span>
        </div>
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
          <div className="p-2 bg-black/40 backdrop-blur-md rounded-xl border border-white/10">
            <Trophy className="w-5 h-5 text-violet-400" />
          </div>
          {tournament.prizePool && (
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded-md border border-emerald-500/20 backdrop-blur-sm">
              Prize: {tournament.prizePool}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        {/* Sports tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tournament.sports.slice(0, 3).map((sport: any) => (
            <span
              key={sport}
              className="text-[10px] font-semibold uppercase tracking-wider bg-white/5 border border-white/8 px-2 py-0.5 rounded-md text-muted-foreground"
            >
              {sport}
            </span>
          ))}
          {tournament.sports.length > 3 && (
            <span className="text-[10px] font-semibold uppercase tracking-wider bg-white/5 border border-white/8 px-2 py-0.5 rounded-md text-muted-foreground">
              +{tournament.sports.length - 3}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg text-foreground group-hover:text-violet-400 transition-colors mb-3 leading-tight">
          {tournament.title}
        </h3>

        {/* Meta info */}
        <div className="space-y-1.5 text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-2 text-violet-400/70 flex-shrink-0" />
            <span className="truncate">{dateRange}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-3.5 h-3.5 mr-2 text-emerald-400/70 flex-shrink-0" />
            <span className="truncate">{tournament.venueName}, {tournament.location}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-3.5 h-3.5 mr-2 text-amber-400/70 flex-shrink-0" />
            <span>Deadline: {new Date(tournament.registrationDeadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Capacity bar */}
        {fillPct !== null && tournament.capacity && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="w-3.5 h-3.5" />
                <span>{tournament.registeredCount} / {tournament.capacity}</span>
              </div>
              {isAlmostFull && (
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                  Almost Full
                </span>
              )}
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  fillPct >= 90 ? 'bg-red-500' : fillPct >= 75 ? 'bg-amber-500' : 'bg-emerald-500'
                )}
                style={{ width: `${fillPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Tags */}
        {tournament.tags && tournament.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tournament.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 text-[10px] text-violet-400/80 bg-violet-500/5 border border-violet-500/10 px-1.5 py-0.5 rounded-md">
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between gap-3">
          {tournament.entryFee != null && (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Entry Fee</p>
              <p className="text-base font-bold text-foreground">
                {tournament.isFreeEntry || tournament.entryFee === 0 ? (
                  <span className="text-emerald-400 font-semibold">Free Entry</span>
                ) : (
                  <>
                    {(tournament.currency ?? 'INR').toUpperCase() === 'INR' ? '₹' : (tournament.currency ?? 'INR').toUpperCase() === 'EUR' ? '€' : '$'}
                    {tournament.entryFee}
                    <span className="text-xs font-normal text-muted-foreground ml-1">{(tournament.currency ?? 'INR').toUpperCase()}</span>
                  </>
                )}
              </p>
            </div>
          )}
          <Link
            href={`/workspace/player/tournaments/${tournament.id}`}
            className="flex items-center justify-center gap-2 h-9 px-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-violet-500/20 transition-colors flex-shrink-0 group/btn"
            aria-label={`View details for ${tournament.title}`}
          >
            View Details
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
