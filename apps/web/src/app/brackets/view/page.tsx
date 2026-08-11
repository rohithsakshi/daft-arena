'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle, BarChart3, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

function BracketViewContent() {
  const searchParams = useSearchParams();
  const tournamentId = searchParams?.get('tournamentId');
  const eventId = searchParams?.get('eventId');

  const { data: matchesRes, isLoading } = useQuery({
    queryKey: ['bracket-matches', tournamentId, eventId],
    queryFn: async () => {
      const res = await fetch(`/api/tournaments/${tournamentId}/operations/matches`);
      if (!res.ok) throw new Error('Failed to load matches');
      return res.json();
    },
    enabled: Boolean(tournamentId && eventId),
  });

  if (!tournamentId || !eventId) {
    return <div className="p-8 text-center text-red-500">Missing parameters</div>;
  }

  const generatedMatches = (matchesRes?.data || []).filter((m: any) => m.eventId === eventId);

  const getPlayerName = (playerData: any) => {
    if (playerData === 'BYE') return 'BYE';
    if (!playerData || !Array.isArray(playerData) || playerData.length === 0) return 'TBD';
    const names = playerData.map((p: any) => p?.name || 'Unknown Player');
    return names.join(' & ');
  };

  const maxRound = generatedMatches.reduce((max: number, m: any) => Math.max(max, m.round), 0);
  
  const displayRounds = Array.from({ length: maxRound }).map((_, i) => {
    const roundNum = i + 1;
    const roundMatches = generatedMatches.filter((m: any) => m.round === roundNum);
    
    let name = `Round ${roundNum}`;
    if (roundNum === maxRound) name = 'Finals';
    else if (roundNum === maxRound - 1 && maxRound > 1) name = 'Semi-Finals';
    else if (roundNum === maxRound - 2 && maxRound > 2) name = 'Quarter-Finals';
    
    return {
      name,
      matches: roundMatches.map((m: any) => ({
        id: m.id || m._id,
        p1: getPlayerName(m.player1),
        p2: getPlayerName(m.player2),
        score: 'Scheduled',
        winner: m.winner ? (m.winner === m.player1 ? 'p1' : 'p2') : null,
      })),
    };
  });

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex items-center justify-between mb-8 print:hidden">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-violet-400" />
          Bracket View
        </h1>
        <Button variant="outline" onClick={() => window.print()}>
          <Printer className="w-4 h-4 mr-2" /> Print Bracket
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading bracket...</div>
      ) : displayRounds.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No matches found for this event.</div>
      ) : (
        <div className="flex gap-8 overflow-x-auto pb-8 custom-scrollbar">
          {displayRounds.map((round, rIndex) => (
            <div key={round.name} className="space-y-4 flex-shrink-0 w-[280px]">
              <div className="text-center pb-2 border-b border-white/10">
                <h4 className="font-semibold text-sm text-violet-300">{round.name}</h4>
              </div>

              <div className="space-y-6 flex flex-col justify-around h-full">
                {round.matches.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 rounded-xl border border-white/10 bg-white/5 space-y-2 shadow-sm"
                  >
                    <div className={`flex items-center justify-between text-sm p-1.5 rounded ${m.winner === 'p1' ? 'bg-emerald-500/10 font-bold text-emerald-400' : ''}`}>
                      <span className="truncate">{m.p1}</span>
                      {m.winner === 'p1' && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>

                    <div className={`flex items-center justify-between text-sm p-1.5 rounded ${m.winner === 'p2' ? 'bg-emerald-500/10 font-bold text-emerald-400' : ''}`}>
                      <span className="truncate">{m.p2}</span>
                      {m.winner === 'p2' && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>

                    <div className="text-right text-xs text-muted-foreground border-t border-white/5 pt-1.5">
                      {m.score}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BracketViewPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-white">Loading...</div>}>
      <BracketViewContent />
    </React.Suspense>
  );
}
