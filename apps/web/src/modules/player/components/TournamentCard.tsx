// @ts-nocheck
import React from 'react';
import { Trophy, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TOURNAMENT_DISCOVERY_STATUS_COLORS } from '../constants';
import Link from 'next/link';

interface TournamentCardProps {
  id: string;
  title: string;
  date: string;
  location: string;
  sports: string[];
  prizePool?: string;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'REGISTRATION_OPEN';
  className?: string;
}

export function TournamentCard({ id, title, date, location, sports, prizePool, status, className }: TournamentCardProps) {
  const statusColorClass = TOURNAMENT_DISCOVERY_STATUS_COLORS[status] ?? '';
  const statusLabel = status.replace('_', ' ');

  return (
    <div className={cn(
      'group flex flex-col rounded-2xl border border-white/5 bg-card shadow-xl overflow-hidden',
      'transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-violet-500/30',
      className
    )}>
      <div className="h-32 bg-gradient-to-br from-violet-600/30 to-purple-900/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />
        <div className="absolute top-4 right-4">
          <span className={cn('px-2.5 py-1 text-[11px] font-bold rounded-lg border backdrop-blur-md', statusColorClass)}>
            {statusLabel}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <div className="p-2.5 bg-black/40 backdrop-blur-md rounded-xl border border-white/10">
            <Trophy className="w-5 h-5 text-violet-400" />
          </div>
          {prizePool && (
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded-md border border-emerald-500/20">
              Prize: {prizePool}
            </span>
          )}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {sports.slice(0, 3).map(sport => (
            <span key={sport} className="text-[10px] font-semibold uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded-md text-muted-foreground border border-white/5">
              {sport}
            </span>
          ))}
        </div>

        <h3 className="font-bold text-lg mb-3 text-foreground group-hover:text-violet-400 transition-colors leading-tight">
          {title}
        </h3>

        <div className="space-y-1.5 mt-auto text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-violet-400/70 flex-shrink-0" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-400/70 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-white/5">
          <Link
            href={`/workspace/player/tournaments/${id}`}
            className="flex items-center justify-center gap-2 h-10 w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-violet-500/20 transition-colors"
            aria-label={`View details for ${title}`}
          >
            View Details
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
