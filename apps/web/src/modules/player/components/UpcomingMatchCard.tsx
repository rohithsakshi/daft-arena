// @ts-nocheck
import React from 'react';
import { PlayerMatch } from '../types';
import { MATCH_STATUS_COLORS } from '../constants';
import { formatMatchTime, getInitials } from '../utils';
import { MapPin, Calendar, Clock, ArrowRight, Swords } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

import { WidgetContainer } from '@/components/shared/WidgetContainer';

interface UpcomingMatchCardProps {
  match: PlayerMatch;
  className?: string;
}

export function UpcomingMatchCard({ match, className }: UpcomingMatchCardProps) {
  const { date, time } = formatMatchTime(match.scheduledTime);
  const statusClass = MATCH_STATUS_COLORS[match.status] ?? '';
  const isLive = match.status === 'LIVE';
  const isCompleted = match.status === 'COMPLETED';

  return (
    <WidgetContainer
      hoverEffect
      glowEffect
      className={cn('p-5 flex flex-col h-full', className)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4 relative">
        <div>
          <span className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wide border mb-2',
            statusClass
          )}>
            {isLive && <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />}
            {match.status}
          </span>
          <h3 className="font-bold text-foreground text-base leading-tight">{match.eventName}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{match.tournamentName}</p>
        </div>
        <div className="p-1.5 rounded-lg bg-white/5 text-muted-foreground">
          <Swords className="w-4 h-4" />
        </div>
      </div>

      {/* Matchup */}
      <div className="flex-1 bg-black/20 rounded-xl p-4 my-3 flex items-center justify-between border border-white/5">
        {/* Player */}
        <div className="flex flex-col items-center gap-1.5 flex-1">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-violet-500/30">
            You
          </div>
          <span className="text-xs font-semibold text-foreground">You</span>
          {isCompleted && match.result && (
            <span className={cn(
              'text-[10px] font-bold px-1.5 py-0.5 rounded',
              match.result === 'WIN' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
            )}>
              {match.result}
            </span>
          )}
        </div>

        {/* VS divider */}
        <div className="flex flex-col items-center px-3">
          <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">VS</span>
          <span className="text-[10px] text-muted-foreground mt-1 text-center">{match.roundName}</span>
          {isCompleted && match.score && (
            <span className="text-xs font-bold text-foreground mt-1 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
              {match.score}
            </span>
          )}
        </div>

        {/* Opponent */}
        <div className="flex flex-col items-center gap-1.5 flex-1">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-foreground border border-white/10">
            {getInitials(match.opponentName)}
          </div>
          <span className="text-xs font-semibold text-foreground truncate max-w-[80px] text-center">
            {match?.opponentName?.split(' ')[0] || 'TBD'}
          </span>
          {isCompleted && match.result && (
            <span className={cn(
              'text-[10px] font-bold px-1.5 py-0.5 rounded',
              match.result === 'LOSS' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
            )}>
              {match.result === 'WIN' ? 'LOSS' : 'WIN'}
            </span>
          )}
        </div>
      </div>

      {/* Meta */}
      <div className="space-y-1.5 text-sm text-muted-foreground border-t border-white/5 pt-4 mt-3">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-violet-400/80" />
            {date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-violet-400/80" />
            {time}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-400/80 flex-shrink-0" />
          <span className="truncate">{match.venueName} · {match.playingAreaName}</span>
        </div>
      </div>

      <Button
        variant="ghost"
        className="w-full mt-3 justify-between text-xs text-muted-foreground hover:text-foreground group-hover:bg-white/5 h-8"
        aria-label={`View details for match against ${match.opponentName}`}
      >
        View Match Details
        <ArrowRight className="w-3.5 h-3.5" />
      </Button>
      </WidgetContainer>
  );
}
