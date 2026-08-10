// @ts-nocheck
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ArrowLeft, CalendarDays, Clock, PlayCircle, CheckCircle2, Edit3 } from 'lucide-react';

export default function MatchesPage() {
  const params = useParams();
  const tournamentId = params?.tournamentId as string;

  const [statusFilter, setStatusFilter] = React.useState('All');
  const [editingMatchId, setEditingMatchId] = React.useState<string | null>(null);
  const [scoreP1, setScoreP1] = React.useState('');
  const [scoreP2, setScoreP2] = React.useState('');

  // Fetch Tournament
  const { data: tournamentRes } = useQuery({
    queryKey: ['tournament', tournamentId],
    queryFn: async () => {
      const res = await fetch(`/api/tournaments/${tournamentId}`);
      if (!res.ok) throw new Error('Failed to load tournament');
      return res.json();
    },
    enabled: Boolean(tournamentId),
  });

  const tournament = tournamentRes?.data;

  // Mock match schedule items
  const [matches, setMatches] = React.useState([
    { id: '1', event: "Men's Singles", round: 'Quarter-Finals', p1: 'Rayaan A.', p2: 'Kalyan S.', court: 'Court 1', time: '10:00 AM', status: 'Completed', score: '21-18, 21-14' },
    { id: '2', event: "Men's Singles", round: 'Quarter-Finals', p1: 'Vikram R.', p2: 'Arun K.', court: 'Court 2', time: '10:45 AM', status: 'Completed', score: '21-15, 19-21, 21-17' },
    { id: '3', event: "Women's Doubles", round: 'Semi-Finals', p1: 'Ananya & Priya', p2: 'Sneha & Divya', court: 'Court 1', time: '11:30 AM', status: 'Live', score: '21-19, 14-11' },
    { id: '4', event: "Men's Singles", round: 'Semi-Finals', p1: 'Rayaan A.', p2: 'Vikram R.', court: 'Court 2', time: '02:00 PM', status: 'Scheduled', score: '' },
    { id: '5', event: "Men's Singles", round: 'Finals', p1: 'TBD', p2: 'TBD', court: 'Court 1', time: '04:30 PM', status: 'Scheduled', score: '' },
  ]);

  const filteredMatches = statusFilter === 'All' ? matches : matches.filter(m => m.status === statusFilter);

  const handleUpdateScore = (matchId: string) => {
    if (!scoreP1 || !scoreP2) {
      toast.error('Please enter scores for both players/teams');
      return;
    }

    setMatches(prev => prev.map(m => {
      if (m.id === matchId) {
        return {
          ...m,
          score: `${scoreP1}, ${scoreP2}`,
          status: 'Completed',
        };
      }
      return m;
    }));

    toast.success('Match score updated');
    setEditingMatchId(null);
    setScoreP1('');
    setScoreP2('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/workspace/tournaments/${tournamentId}`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Match Schedule & Live Scoring</h2>
            <p className="text-muted-foreground text-sm">
              {tournament ? tournament.name : 'Manage match order, court allocations, and live score updates'}
            </p>
          </div>
        </div>

        <Button onClick={() => toast.success('Match schedule exported as PDF')}>
          Export Schedule
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold">Filter Status:</span>
            {['All', 'Live', 'Scheduled', 'Completed'].map((st) => (
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

          <Badge variant="secondary">
            Total Matches: {filteredMatches.length}
          </Badge>
        </CardContent>
      </Card>

      {/* Matches List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-violet-400" />
            Matches Schedule
          </CardTitle>
          <CardDescription>Click score edit to record results or change match status.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredMatches.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/[0.07] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{m.event}</Badge>
                    <span className="text-xs text-muted-foreground">{m.round}</span>
                    <span className="text-xs text-violet-300 font-medium">[{m.court} • {m.time}]</span>
                  </div>

                  <div className="flex items-center gap-4 text-base font-semibold pt-1">
                    <span>{m.p1}</span>
                    <span className="text-muted-foreground text-xs font-normal">VS</span>
                    <span>{m.p2}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {m.score && (
                    <div className="text-sm font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                      {m.score}
                    </div>
                  )}

                  <Badge
                    variant={m.status === 'Live' ? 'destructive' : m.status === 'Completed' ? 'default' : 'secondary'}
                    className="flex items-center gap-1"
                  >
                    {m.status === 'Live' && <PlayCircle className="w-3 h-3 animate-pulse" />}
                    {m.status === 'Completed' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                    {m.status === 'Scheduled' && <Clock className="w-3 h-3" />}
                    {m.status}
                  </Badge>

                  {editingMatchId === m.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="21-18"
                        className="w-20 h-8 text-xs"
                        value={scoreP1}
                        onChange={(e) => setScoreP1(e.target.value)}
                      />
                      <Input
                        placeholder="21-14"
                        className="w-20 h-8 text-xs"
                        value={scoreP2}
                        onChange={(e) => setScoreP2(e.target.value)}
                      />
                      <Button size="sm" onClick={() => handleUpdateScore(m.id)}>Save</Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingMatchId(null)}>Cancel</Button>
                    </div>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => setEditingMatchId(m.id)}>
                      <Edit3 className="w-3.5 h-3.5 mr-1" /> Score
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
