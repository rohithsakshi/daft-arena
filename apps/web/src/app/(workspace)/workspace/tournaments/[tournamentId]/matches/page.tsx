// @ts-nocheck
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ArrowLeft, CalendarDays, Clock, PlayCircle, CheckCircle2, Edit3, MonitorPlay } from 'lucide-react';
import { MatchStatus } from '@/modules/core/enums';

export default function MatchesPage() {
  const params = useParams();
  const tournamentId = params?.tournamentId as string;
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = React.useState('All');
  const [editingMatchId, setEditingMatchId] = React.useState<string | null>(null);
  const [scoreP1, setScoreP1] = React.useState('');
  const [scoreP2, setScoreP2] = React.useState('');

  const { data: tournamentRes } = useQuery({
    queryKey: ['tournament', tournamentId],
    queryFn: async () => {
      const res = await fetch(`/api/tournaments/${tournamentId}`);
      if (!res.ok) throw new Error('Failed to load tournament');
      return res.json();
    },
    enabled: Boolean(tournamentId),
  });

  const { data: matchesRes, isLoading } = useQuery({
    queryKey: ['all-matches', tournamentId],
    queryFn: async () => {
      const res = await fetch(`/api/tournaments/${tournamentId}/matches`);
      if (!res.ok) throw new Error('Failed to load matches');
      return res.json();
    },
  });

  const tournament = tournamentRes?.data;
  const matches = matchesRes?.data || [];

  const filteredMatches = statusFilter === 'All' 
    ? matches 
    : matches.filter((m: any) => m.status === statusFilter);

  const getPlayerName = (participantInfo: any) => {
    if (!participantInfo || participantInfo.length === 0) return 'TBD';
    return participantInfo.map((p: any) => p.name).join(' & ');
  };

  const updateScoreMutation = useMutation({
    mutationFn: async ({ matchId, p1, p2 }: { matchId: string, p1: string, p2: string }) => {
      const res = await fetch(`/api/tournaments/${tournamentId}/matches/${matchId}/score`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scores: { p1: [parseInt(p1)], p2: [parseInt(p2)] },
          status: MatchStatus.Completed
        })
      });
      if (!res.ok) throw new Error('Failed to update score');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-matches', tournamentId] });
      toast.success('Match score updated');
      setEditingMatchId(null);
      setScoreP1('');
      setScoreP2('');
    },
    onError: (err: any) => toast.error(err.message)
  });

  const handleUpdateScore = (matchId: string) => {
    if (!scoreP1 || !scoreP2) {
      return toast.error('Please enter scores for both players/teams');
    }
    updateScoreMutation.mutate({ matchId, p1: scoreP1, p2: scoreP2 });
  };

  const formatScore = (scores: any) => {
    if (!scores || !scores.p1 || !scores.p2 || scores.p1.length === 0) return null;
    let parts = [];
    for(let i=0; i<scores.p1.length; i++) {
      parts.push(`${scores.p1[i]}-${scores.p2[i]}`);
    }
    return parts.join(', ');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/workspace/tournaments/${tournamentId}`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Match Schedule</h2>
            <p className="text-muted-foreground text-sm">
              {tournament ? tournament.name : 'View and manage all scheduled matches'}
            </p>
          </div>
        </div>

        <Button onClick={() => window.print()} variant="outline">
          Print / PDF
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 flex items-center justify-between overflow-x-auto">
          <div className="flex items-center gap-3 min-w-max">
            <span className="text-sm font-semibold">Filter Status:</span>
            {['All', MatchStatus.Scheduled, MatchStatus.InProgress, MatchStatus.Completed].map((st) => (
              <Button
                key={st}
                variant={statusFilter === st ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(st)}
              >
                {st}
              </Button>
            ))}
          </div>

          <Badge variant="secondary" className="whitespace-nowrap ml-4">
            Total Matches: {filteredMatches.length}
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-violet-400" />
            Master Schedule
          </CardTitle>
          <CardDescription>All matches mapped by chronological start time.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-12 text-center text-muted-foreground animate-pulse">Loading matches...</div>
          ) : filteredMatches.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground border border-dashed border-white/10 rounded-xl">
              No matches found. Generate a draw and use the Operations tab to schedule matches.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMatches.map((m: any) => (
                <div
                  key={m._id}
                  className="p-4 rounded-xl border border-white/10 bg-zinc-900/50 hover:bg-zinc-800/80 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
                >
                  <div className="space-y-2 min-w-[200px]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs bg-black/40">{m.eventId?.name}</Badge>
                      <span className="text-xs text-muted-foreground bg-white/5 px-2 py-0.5 rounded-md">Round {m.round}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-violet-300 font-medium bg-violet-500/10 px-2 py-1 rounded-md w-fit border border-violet-500/20">
                      <Clock className="w-3.5 h-3.5" />
                      {m.startTime ? new Date(m.startTime).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'TBD'}
                    </div>
                  </div>

                  <div className="flex-1 px-4">
                    <div className="flex items-center justify-between sm:justify-center gap-2 sm:gap-6 text-base font-semibold">
                      <span className="truncate max-w-[150px] sm:max-w-[200px] text-right">{getPlayerName(m.participant1Id?.participantIds)}</span>
                      <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest bg-white/5 px-2 py-1 rounded-full">vs</span>
                      <span className="truncate max-w-[150px] sm:max-w-[200px] text-left">{getPlayerName(m.participant2Id?.participantIds)}</span>
                    </div>
                    <div className="flex items-center justify-center gap-4 mt-2">
                      <span className="text-xs flex items-center gap-1 text-muted-foreground">
                        <MonitorPlay className="w-3 h-3" />
                        {m.courtId?.name || 'No Court'}
                      </span>
                      {m.umpireId && (
                        <span className="text-xs flex items-center gap-1 text-emerald-400">
                          Umpire: {m.umpireId?.name}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 min-w-[200px] justify-end">
                    {formatScore(m.scores) && (
                      <div className="text-sm font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 whitespace-nowrap">
                        {formatScore(m.scores)}
                      </div>
                    )}

                    <Badge
                      variant={m.status === MatchStatus.InProgress ? 'destructive' : m.status === MatchStatus.Completed ? 'default' : 'secondary'}
                      className="flex items-center gap-1 whitespace-nowrap"
                    >
                      {m.status === MatchStatus.InProgress && <PlayCircle className="w-3 h-3 animate-pulse" />}
                      {m.status === MatchStatus.Completed && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                      {m.status === MatchStatus.Scheduled && <Clock className="w-3 h-3" />}
                      {m.status}
                    </Badge>

                    {editingMatchId === m._id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="21"
                          className="w-12 h-8 text-xs text-center p-1"
                          value={scoreP1}
                          onChange={(e) => setScoreP1(e.target.value)}
                        />
                        <span className="text-xs">-</span>
                        <Input
                          placeholder="18"
                          className="w-12 h-8 text-xs text-center p-1"
                          value={scoreP2}
                          onChange={(e) => setScoreP2(e.target.value)}
                        />
                        <Button size="sm" onClick={() => handleUpdateScore(m._id)} disabled={updateScoreMutation.isPending}>Save</Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingMatchId(null)}>Cancel</Button>
                      </div>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => setEditingMatchId(m._id)}>
                        <Edit3 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
