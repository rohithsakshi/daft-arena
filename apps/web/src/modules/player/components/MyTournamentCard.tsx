// @ts-nocheck
import React from 'react';
import { PlayerTournament } from '../types';
import { REGISTRATION_STATUS_COLORS, REGISTRATION_STATUS_LABELS } from '../constants';
import { formatTournamentDate } from '../utils';
import { Calendar, MapPin, Trophy, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

import { WidgetContainer } from '@/components/shared/WidgetContainer';

interface MyTournamentCardProps {
  tournament: PlayerTournament;
  className?: string;
}

export function MyTournamentCard({ tournament, className }: MyTournamentCardProps) {
  const dateRange = formatTournamentDate(tournament.startDate, tournament.endDate);
  const statusColorClass = REGISTRATION_STATUS_COLORS[tournament.status] ?? '';
  const statusLabel = REGISTRATION_STATUS_LABELS[tournament.status] ?? tournament.status;

  return (
    <WidgetContainer
      hoverEffect
      className={cn('flex flex-col', className)}
    >
      {/* Banner */}
      <div className="h-24 bg-gradient-to-r from-violet-600/20 to-purple-600/20 relative overflow-hidden flex-shrink-0">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-3 left-4">
          <div className="p-2 bg-black/40 backdrop-blur-md rounded-xl border border-white/10">
            <Trophy className="w-5 h-5 text-violet-400" />
          </div>
        </div>
        <div className="absolute top-3 right-3">
          <span className={cn(
            'px-2.5 py-1 text-[11px] font-bold rounded-lg border backdrop-blur-md',
            statusColorClass
          )}>
            {statusLabel}
          </span>
        </div>
        {tournament.sport && (
          <div className="absolute bottom-3 right-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/60 bg-black/40 px-2 py-0.5 rounded-md border border-white/10 backdrop-blur-sm">
              {tournament.sport}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-base text-foreground group-hover:text-violet-400 transition-colors mb-3 leading-snug truncate">
          {tournament.title}
        </h3>

        <div className="space-y-1.5 text-sm text-muted-foreground flex-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-violet-400/70 flex-shrink-0" />
            <span className="truncate">{dateRange}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-400/70 flex-shrink-0" />
            <span className="truncate">{tournament.venueName}, {tournament.location}</span>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-white/5">
          <Link
            href={`/workspace/player/my-tournaments/${tournament.id}`}
            className="flex items-center justify-between w-full text-sm font-medium text-muted-foreground hover:text-violet-400 transition-colors group/link"
            aria-label={`View details for ${tournament.title}`}
          >
            <span>View Details</span>
            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </WidgetContainer>
  );
}
