'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Trophy, ChevronDown, ChevronUp, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { MatchStatus } from '@/modules/core/enums';
import Link from 'next/link';

const STATUS_COLORS: Record<string, string> = {
  Completed: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  InProgress: 'text-amber-400 border-amber-500/30 bg-amber-500/10 animate-pulse',
  Scheduled: 'text-zinc-400 border-white/10 bg-white/5',
};

export default function TeamTiesPage() {
  const params = useParams();
  const tournamentId = params?.tournamentId as string;
  const queryClient = useQueryClient();

  const [expandedTie, setExpandedTie] = React.useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = React.useState<string>('');

  // Fetch events
  const { data: eventsRes } = useQuery({
    queryKey: ['events', tournamentId],
    queryFn: async () => {
      const res = await fetch(`/api/tournaments/${tournamentId}/events`);
      return res.json();
    }
  });
  const events = eventsRes?.data || [];
  const teamEvents = events.filter((e: any) => e.drawType === 'Tie');

  // Fetch ties for selected event
  const { data: tiesRes, isLoading } = useQuery({
    queryKey: ['team-ties', tournamentId, selectedEventId],
    queryFn: async () => {
      const url = selectedEventId
        ? `/api/tournaments/${tournamentId}/team-ties?eventId=${selectedEventId}`
        : `/api/tournaments/${tournamentId}/team-ties`;
      const res = await fetch(url);
      return res.json();
    },
    enabled: !!selectedEventId
  });
  const ties = tiesRes?.data || [];

  // Mark a rubber winner
  const rubberMutation = useMutation({
    mutationFn: async ({ tieId, rubberOrder, winnerTeam }: any) => {
      const res = await fetch(`/api/tournaments/${tournamentId}/team-ties/${tieId}/rubber`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rubberOrder, winnerTeam })
      });
      if (!res.ok) throw new Error('Failed to update rubber result');
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['team-ties', tournamentId, selectedEventId] });
      if (data.data?.winnerId) {
        toast.success('Tie completed! Winner has advanced to the next round.');
      } else {
        toast.success('Rubber result recorded.');
      }
    },
    onError: (err: any) => toast.error(err.message)
  });

  const getTeamName = (team: any) => {
    if (!team) return 'TBD';
    if (team.participantIds && team.participantIds.length > 0) {
      return team.participantIds.map((p: any) => p.name).join(' & ');
    }
    return `Team ${team._id?.toString().slice(-4)}`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Team Ties</h2>
          <p className="text-muted-foreground">Manage team tie matchups and rubber-by-rubber scoring.</p>
        </div>
      </div>

      {/* Event Selector */}
      <div className="flex items-center gap-4 bg-zinc-900/50 p-4 rounded-xl border border-white/5">
        <Trophy className="w-5 h-5 text-amber-400" />
        <Select value={selectedEventId} onValueChange={(v) => setSelectedEventId(v || '')}>
          <SelectTrigger className="w-80">
            <SelectValue placeholder="Select a Team Tie Event..." />
          </SelectTrigger>
          <SelectContent>
            {teamEvents.length === 0 ? (
              <SelectItem value="_none" disabled>No Team Tie events found. Create one in Events.</SelectItem>
            ) : (
              teamEvents.map((ev: any) => (
                <SelectItem key={ev._id} value={ev._id}>{ev.name}</SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {selectedEventId && (
          <Link href={`/workspace/tournaments/${tournamentId}/events`}>
            <Button variant="outline" size="sm">Manage Events</Button>
          </Link>
        )}
      </div>

      {!selectedEventId ? (
        <div className="text-center py-20 text-muted-foreground border border-dashed border-white/10 rounded-xl">
          <Trophy className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>Select a Team Tie event above to view and manage its ties.</p>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full" />
        </div>
      ) : ties.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground border border-dashed border-white/10 rounded-xl">
          <p>No ties generated yet. Generate a draw from the Brackets page first.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Group by round */}
          {Array.from(new Set(ties.map((t: any) => t.round))).sort().map((round: any) => (
            <div key={round} className="space-y-3">
              <h3 className="text-lg font-semibold text-muted-foreground border-b border-white/5 pb-2">
                Round {round}
              </h3>
              {ties.filter((t: any) => t.round === round).map((tie: any) => {
                const isExpanded = expandedTie === tie._id;
                const team1Name = getTeamName(tie.team1Id);
                const team2Name = getTeamName(tie.team2Id);

                return (
                  <Card key={tie._id} className={`bg-zinc-900/30 border ${
                    tie.status === MatchStatus.Completed ? 'border-emerald-500/20' :
                    tie.status === MatchStatus.InProgress ? 'border-amber-500/30' :
                    'border-white/10'
                  }`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        {/* Teams + Score */}
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`flex-1 text-right font-bold text-lg ${tie.winnerId?.toString() === tie.team1Id?._id?.toString() ? 'text-amber-400' : ''}`}>
                            {team1Name}
                          </div>
                          <div className="flex items-center gap-2 text-2xl font-black tabular-nums">
                            <span className={tie.score?.team1 > tie.score?.team2 ? 'text-white' : 'text-muted-foreground'}>
                              {tie.score?.team1 ?? 0}
                            </span>
                            <span className="text-muted-foreground text-lg">—</span>
                            <span className={tie.score?.team2 > tie.score?.team1 ? 'text-white' : 'text-muted-foreground'}>
                              {tie.score?.team2 ?? 0}
                            </span>
                          </div>
                          <div className={`flex-1 font-bold text-lg ${tie.winnerId?.toString() === tie.team2Id?._id?.toString() ? 'text-amber-400' : ''}`}>
                            {team2Name}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <Badge className={STATUS_COLORS[tie.status] || ''}>{tie.status}</Badge>
                          <Button
                            variant="ghost" size="icon"
                            onClick={() => setExpandedTie(isExpanded ? null : tie._id)}
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    {isExpanded && (
                      <CardContent className="space-y-3 pt-0 border-t border-white/5">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold pt-3">Rubbers</p>
                        {tie.rubbers?.map((rubber: any) => (
                          <div key={rubber.order} className={`flex items-center gap-4 p-3 rounded-lg ${
                            rubber.status === MatchStatus.Completed ? 'bg-emerald-500/5 border border-emerald-500/15' : 'bg-zinc-900/60 border border-white/5'
                          }`}>
                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold shrink-0">
                              {rubber.order}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{rubber.name}</div>
                              <div className="text-xs text-muted-foreground">{rubber.rubberType}</div>
                            </div>

                            {rubber.status === MatchStatus.Completed ? (
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                <span className="text-sm font-semibold text-emerald-400">
                                  {rubber.winnerTeam === 1 ? team1Name : team2Name} won
                                </span>
                              </div>
                            ) : tie.status !== MatchStatus.Completed ? (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">Winner:</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs border-violet-500/30 text-violet-400 hover:bg-violet-500/10"
                                  disabled={rubberMutation.isPending}
                                  onClick={() => rubberMutation.mutate({ tieId: tie._id, rubberOrder: rubber.order, winnerTeam: 1 })}
                                >
                                  {team1Name.split(' ')[0]}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                                  disabled={rubberMutation.isPending}
                                  onClick={() => rubberMutation.mutate({ tieId: tie._id, rubberOrder: rubber.order, winnerTeam: 2 })}
                                >
                                  {team2Name.split(' ')[0]}
                                </Button>
                              </div>
                            ) : (
                              <Circle className="w-4 h-4 text-muted-foreground opacity-30" />
                            )}
                          </div>
                        ))}

                        {tie.status === MatchStatus.Completed && tie.winnerId && (
                          <div className="flex items-center gap-2 mt-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                            <Trophy className="w-4 h-4 text-amber-400" />
                            <span className="text-sm font-bold text-amber-400">
                              Tie won by {tie.winnerId?.toString() === tie.team1Id?._id?.toString() ? team1Name : team2Name}
                            </span>
                            {tie.nextTieId && (
                              <span className="ml-auto text-xs text-muted-foreground flex items-center gap-1">
                                Advanced to next round <ArrowRight className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                        )}
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
