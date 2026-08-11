'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Swords, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function UmpireDashboardPage() {
  const params = useParams();
  const token = params?.token as string;

  // Fetch Umpire Info and Matches
  const { data: resData, isLoading, error } = useQuery({
    queryKey: ['umpire-dashboard', token],
    queryFn: async () => {
      const res = await fetch(`/api/umpire/auth?token=${token}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Invalid token or session expired');
      }
      return res.json();
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500 mb-4" />
        <p className="text-muted-foreground">Authenticating securely...</p>
      </div>
    );
  }

  if (error || !resData?.data?.umpire) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl max-w-md w-full">
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-sm">{error?.message || 'Invalid or expired magic link.'}</p>
        </div>
      </div>
    );
  }

  const { umpire, tournament, matches } = resData.data;

  const getPlayerName = (participantInfo: any) => {
    if (!participantInfo || participantInfo.length === 0) return 'TBD';
    return participantInfo.map((p: any) => p.name).join(' & ');
  };

  return (
    <div className="min-h-screen bg-black text-white pb-12">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-white/10 p-4 sticky top-0 z-10 shadow-md">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-bold text-lg leading-tight">Umpire Dashboard</h1>
            <p className="text-xs text-violet-400 font-medium">Hello, {umpire.name}</p>
          </div>
          <Badge variant="outline" className="border-violet-500/50 bg-violet-500/10 text-violet-300">
            {tournament.name}
          </Badge>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6 mt-4">
        <div>
          <h2 className="text-lg font-semibold mb-1">Your Assigned Matches</h2>
          <p className="text-sm text-muted-foreground">Select a match to start scoring.</p>
        </div>

        {matches.length === 0 ? (
          <Card className="bg-zinc-900/50 border-white/5 border-dashed">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <CheckCircle className="w-12 h-12 mb-3 opacity-20" />
              <p>You have no pending matches assigned to you right now.</p>
              <p className="text-xs mt-2">Wait for the Control Desk to assign your next match.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {matches.map((match: any) => (
              <Card key={match._id} className="bg-zinc-900/80 border-white/10 overflow-hidden">
                <CardHeader className="bg-zinc-800/50 p-3 pb-2 flex flex-row items-center justify-between space-y-0 border-b border-white/5">
                  <div>
                    <CardTitle className="text-sm font-semibold text-violet-300">{match.eventId?.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {match.courtId ? `Court: ${match.courtId.name}` : 'Court TBD'} • Round {match.round}
                    </CardDescription>
                  </div>
                  {match.startTime && (
                    <Badge variant="secondary" className="flex items-center gap-1 text-[10px] px-1.5 py-0.5">
                      <Clock className="w-3 h-3" />
                      {new Date(match.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold truncate flex-1 text-center">
                      {getPlayerName(match.participant1Id?.participantIds)}
                    </div>
                    <div className="px-3 flex flex-col items-center justify-center">
                      <Swords className="w-5 h-5 text-muted-foreground mb-1" />
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">vs</span>
                    </div>
                    <div className="text-sm font-semibold truncate flex-1 text-center">
                      {getPlayerName(match.participant2Id?.participantIds)}
                    </div>
                  </div>
                  
                  <Link href={`/umpire/${token}/matches/${match._id}/score`} className="block pt-2">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(5,150,105,0.3)]">
                      Start Match / Score
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
