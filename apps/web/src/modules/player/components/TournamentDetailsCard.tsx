// @ts-nocheck
'use client';

import React from 'react';
import { TournamentDetail } from '../types';
import { formatCurrency, getFillPercentage } from '../utils';
import { Users, Lock, Trophy, FileText, ExternalLink, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { WidgetContainer } from '@/components/shared/WidgetContainer';
import { useRouter } from 'next/navigation';

interface TournamentDetailsCardProps {
  tournament: TournamentDetail;
  className?: string;
  // Phase 8 Registration Module Extension Hooks
  isRegistered?: boolean;
  registrationStatus?: 'REGISTERED' | 'PENDING_PAYMENT' | 'NOT_REGISTERED' | 'WAITLISTED';
  onRegisterClick?: () => void;
  isEligible?: boolean;
  eligibilityMessage?: string;
}

export function TournamentDetailsCard({
  tournament,
  className,
  isRegistered = false,
  registrationStatus = 'NOT_REGISTERED',
  onRegisterClick,
  isEligible = true,
  eligibilityMessage = 'You meet all the eligibility criteria for this tournament.',
}: TournamentDetailsCardProps) {
  const router = useRouter();
  const handleRegisterClick = onRegisterClick || (() => {
    router.push(`/workspace/player/tournaments/${tournament.id}/register`);
  });

  const fillPct = tournament.capacity && tournament.registeredCount
    ? getFillPercentage(tournament.registeredCount, tournament.capacity)
    : null;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Registration Sidebar Card */}
      <WidgetContainer className="p-6 bg-white/5 border-white/10 sticky top-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-foreground">Registration</h3>
          {/* Status Badge Extension Point */}
          {isRegistered && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {registrationStatus}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mb-5">Select events and complete payment in the next step.</p>

        {/* Fee display */}
        <div className="flex justify-between items-center py-4 border-y border-white/10 mb-5">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Base Entry Fee</p>
            <p className="text-2xl font-black text-foreground">
              {formatCurrency(tournament.baseEntryFee, tournament.currency)}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
            <Trophy className="w-5 h-5 text-violet-400" />
          </div>
        </div>

        {/* Capacity bar */}
        {fillPct !== null && tournament.capacity && (
          <div className="mb-5">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                {tournament.registeredCount} of {tournament.capacity} spots filled
              </span>
              <span className={cn(
                'font-semibold',
                fillPct >= 90 ? 'text-red-400' : fillPct >= 75 ? 'text-amber-400' : 'text-emerald-400'
              )}>
                {100 - fillPct}% left
              </span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  fillPct >= 90 ? 'bg-red-500' : fillPct >= 75 ? 'bg-amber-500' : 'bg-gradient-to-r from-violet-500 to-emerald-500'
                )}
                style={{ width: `${fillPct}%` }}
              />
            </div>
          </div>
        )}

        {/* CTA — Registration Module Hook */}
        <Button
          onClick={handleRegisterClick}
          disabled={!isEligible || registrationStatus === 'REGISTERED'}
          className={cn(
            'w-full h-12 text-white font-semibold transition-all duration-250 rounded-xl',
            registrationStatus === 'REGISTERED'
              ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 cursor-default'
              : 'bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-500/20'
          )}
          aria-label={registrationStatus === 'REGISTERED' ? 'Already Registered' : 'Register for Tournament'}
        >
          {registrationStatus === 'REGISTERED' ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Registered
            </>
          ) : (
            <>
              <Trophy className="w-4 h-4 mr-2 text-white" />
              Register Now
            </>
          )}
        </Button>
        <p className="text-center text-[10px] text-muted-foreground mt-3">
          {registrationStatus === 'REGISTERED'
            ? 'Your spot is secured. Access draw sheets under Matches.'
            : 'Instant entry slot confirmation upon registration.'}
        </p>
      </WidgetContainer>

      {/* Player Eligibility Panel Extension Point */}
      <WidgetContainer className="p-5">
        <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-violet-400" />
          Player Eligibility
        </h4>
        <div className="flex gap-3">
          {isEligible ? (
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0 animate-pulse" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
          )}
          <div>
            <p className={cn('text-xs font-bold', isEligible ? 'text-emerald-400' : 'text-amber-400')}>
              {isEligible ? 'Eligible to enter' : 'Ineligible'}
            </p>
            <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
              {eligibilityMessage}
            </p>
          </div>
        </div>
      </WidgetContainer>

      {/* Events List Card */}
      {Array.isArray(tournament?.events) && tournament.events.length > 0 && (
        <WidgetContainer className="p-5">
          <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-4">Available Events</h4>
          <div className="space-y-3">
            {tournament.events.map((event) => {
              const evtFill = getFillPercentage(event.currentParticipants || 0, event.maxParticipants || 32);
              return (
                <div
                  key={event.id || event.name}
                  className="p-3 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between"
                >
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="text-sm font-semibold text-foreground truncate">{event.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {event.currentParticipants || 0}/{event.maxParticipants || 32} players
                    </p>
                    <div className="h-1 bg-white/5 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="h-full bg-violet-500/60 rounded-full"
                        style={{ width: `${evtFill}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-foreground whitespace-nowrap">
                    {formatCurrency(event.entryFee || tournament.baseEntryFee || 0, tournament.currency)}
                  </span>
                </div>
              );
            })}
          </div>
        </WidgetContainer>
      )}

      {/* Documents Card */}
      {Array.isArray(tournament?.documents) && tournament.documents.length > 0 && (
        <WidgetContainer className="p-5">
          <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-4">Documents</h4>
          <div className="space-y-2">
            {tournament.documents.map((doc, i) => (
              <a
                key={i}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-white/5 hover:bg-white/5 transition-colors group"
                aria-label={`Open ${doc.title}`}
              >
                <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <FileText className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground group-hover:text-violet-400 transition-colors truncate">{doc.title}</p>
                  <p className="text-xs text-muted-foreground">{doc.type}</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              </a>
            ))}
          </div>
        </WidgetContainer>
      )}
    </div>
  );
}
