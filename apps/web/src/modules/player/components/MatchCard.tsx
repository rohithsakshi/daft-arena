'use client';

import React from 'react';
import { PlayerMatch } from '../types';
import { WidgetContainer } from '@/components/shared/WidgetContainer';
import { Button } from '@/components/ui/button';
import { Swords, Calendar, Clock, MapPin, Play, UserCheck, ShieldAlert, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getInitials } from '../utils';

interface MatchCardProps {
  match: PlayerMatch;
  onLiveScoringClick?: (matchId: string) => void;
  className?: string;
}

export function MatchCard({ match, onLiveScoringClick, className }: MatchCardProps) {
  const isLive = match.status === 'LIVE';
  const isCompleted = match.status === 'COMPLETED';

  return (
    <WidgetContainer hoverEffect className={cn('p-5 flex flex-col justify-between h-full', className)}>
      <div className="space-y-4">
        {/* Event header & status */}
        <div className="flex items-start justify-between border-b border-white/5 pb-3">
          <div>
            <h3 className="font-extrabold text-sm text-foreground">{match.eventName}</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">{match.tournamentName}</p>
          </div>
          <span className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wide border',
            isLive
              ? 'bg-red-500/10 text-red-400 border-red-500/20 animate-pulse'
              : isCompleted
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-white/5 border-white/10 text-muted-foreground'
          )}>
            {isLive && <span className="w-1 h-1 rounded-full bg-red-400 animate-ping mr-0.5" />}
            {match.status}
          </span>
        </div>

        {/* Player Matchups display */}
        <div className="bg-black/20 rounded-xl p-3 flex items-center justify-between border border-white/5">
          <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center text-xs font-bold text-white shadow-md">
              You
            </div>
            <span className="text-[10px] font-semibold text-foreground truncate w-full text-center">You</span>
          </div>

          <div className="flex flex-col items-center px-2">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">VS</span>
            <span className="text-[9px] text-muted-foreground mt-0.5 text-center">{match.roundName}</span>
            {match.score && (
              <span className="text-xs font-mono font-bold text-foreground mt-1 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                {match.score}
              </span>
            )}
          </div>

          <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-foreground border border-white/10">
              {getInitials(match.opponentName)}
            </div>
            <span className="text-[10px] font-semibold text-foreground truncate w-full text-center">{match.opponentName}</span>
          </div>
        </div>

        {/* Details & Officials info */}
        <div className="space-y-2 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-violet-400/80" />
            <span>{new Date(match.scheduledTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-violet-400/80" />
            <span>{new Date(match.scheduledTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-400/80" />
            <span>{match.venueName} · {match.playingAreaName}</span>
          </div>

          {/* Referee & Officials metadata */}
          {(match.referee || (match.officials && match.officials.length > 0)) && (
            <div className="pt-2 border-t border-white/5 space-y-1.5 text-[10px]">
              {match.referee && (
                <p className="flex items-center gap-1.5">
                  <UserCheck className="w-3 h-3 text-violet-400/70" />
                  <span>Referee: <span className="text-foreground font-semibold">{match.referee}</span></span>
                </p>
              )}
              {match.officials && match.officials.length > 0 && (
                <p className="flex items-start gap-1.5">
                  <ShieldAlert className="w-3 h-3 text-violet-400/70 mt-0.5" />
                  <span>Officials: <span className="text-foreground font-semibold">{match.officials.join(', ')}</span></span>
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action triggers */}
      <div className="mt-4 pt-3 border-t border-white/5 flex gap-2">
        {isLive && onLiveScoringClick && (
          <Button
            size="sm"
            onClick={() => onLiveScoringClick(match.id)}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs gap-1 shadow-lg shadow-red-500/10 rounded-xl"
          >
            <Play className="w-3.5 h-3.5 animate-pulse" />
            Live Scoring Board
          </Button>
        )}
        {isCompleted && match.result === 'WIN' && (
          <div className="w-full flex items-center justify-center gap-1 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400">
            <Award className="w-4 h-4 text-emerald-400" />
            Victory Match
          </div>
        )}
      </div>
    </WidgetContainer>
  );
}
