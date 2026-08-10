'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Users, Swords, MonitorPlay, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function CourtOperationsPage() {
  const params = useParams();
  const tournamentId = params?.tournamentId as string;
  const queryClient = useQueryClient();

  const [newCourtName, setNewCourtName] = React.useState('');

  // Fetch Courts
  const { data: courtsRes } = useQuery({
    queryKey: ['courts', tournamentId],
    queryFn: async () => {
      const res = await fetch(`/api/tournaments/${tournamentId}/courts`);
      if (!res.ok) throw new Error('Failed to load courts');
      return res.json();
    }
  });

  // Fetch Matches
  const { data: matchesRes } = useQuery({
    queryKey: ['ops-matches', tournamentId],
    queryFn: async () => {
      const res = await fetch(`/api/tournaments/${tournamentId}/operations/matches`);
      if (!res.ok) throw new Error('Failed to load matches');
      return res.json();
    }
  });

  const courts = courtsRes?.data || [];
  const matches = matchesRes?.data || [];

  const unassignedMatches = matches.filter((m: any) => !m.courtId && !m.isWalkover);

  const addCourtMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch(`/api/tournaments/${tournamentId}/courts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      if (!res.ok) throw new Error('Failed to add court');
      return res.json();
    },
    onSuccess: () => {
      setNewCourtName('');
      queryClient.invalidateQueries({ queryKey: ['courts', tournamentId] });
      toast.success('Court added!');
    }
  });

  const assignMatchMutation = useMutation({
    mutationFn: async ({ matchId, courtId }: { matchId: string, courtId: string | null }) => {
      const res = await fetch(`/api/tournaments/${tournamentId}/matches/${matchId}/assign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courtId })
      });
      if (!res.ok) throw new Error('Failed to assign match');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ops-matches', tournamentId] });
      toast.success('Match assigned successfully!');
    }
  });

  const getPlayerName = (participantInfo: any) => {
    if (!participantInfo || participantInfo.length === 0) return 'TBD';
    return participantInfo.map((p: any) => p.name).join(' & ');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Live Operations</h2>
          <p className="text-muted-foreground">Manage courts and dispatch matches to referees.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Side: Scheduled Matches Queue */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-4 h-4 text-violet-400" /> Waiting List
            </h3>
            <Badge variant="secondary">{unassignedMatches.length}</Badge>
          </div>
          
          <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
            {unassignedMatches.length === 0 ? (
              <div className="text-center p-6 bg-zinc-900/50 border border-white/5 rounded-xl text-muted-foreground text-sm">
                No unassigned matches. Generate a draw first!
              </div>
            ) : (
              unassignedMatches.map((m: any) => (
                <div 
                  key={m._id} 
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('matchId', m._id);
                  }}
                  className="p-3 rounded-lg bg-zinc-900/80 border border-white/10 hover:border-violet-500/50 cursor-grab active:cursor-grabbing shadow-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-violet-300">{m.eventId?.name}</span>
                    <span className="text-xs text-muted-foreground">R{m.round}-M{m.matchNumber}</span>
                  </div>
                  <div className="space-y-1 text-sm font-medium">
                    <div className="truncate">{getPlayerName(m.participant1Id?.participantIds)}</div>
                    <div className="text-xs text-muted-foreground text-center">vs</div>
                    <div className="truncate">{getPlayerName(m.participant2Id?.participantIds)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Courts Dashboard */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="bg-zinc-900/30 border-white/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Court Dashboard</CardTitle>
              <div className="flex items-center gap-2">
                <Input 
                  placeholder="E.g. Court 1" 
                  value={newCourtName}
                  onChange={(e) => setNewCourtName(e.target.value)}
                  className="w-40 h-8 text-sm"
                />
                <Button 
                  size="sm" 
                  onClick={() => addCourtMutation.mutate(newCourtName)}
                  disabled={!newCourtName || addCourtMutation.isPending}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Court
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {courts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <MonitorPlay className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No courts created yet. Add a court to start assigning matches.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courts.map((court: any) => {
                    const assignedMatch = matches.find((m: any) => m.courtId === court._id);
                    
                    return (
                      <div 
                        key={court._id}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const matchId = e.dataTransfer.getData('matchId');
                          if (matchId && !assignedMatch) {
                            assignMatchMutation.mutate({ matchId, courtId: court._id });
                          } else if (assignedMatch) {
                            toast.error('Court is already occupied!');
                          }
                        }}
                        className={`relative rounded-xl border ${assignedMatch ? 'border-violet-500/50 bg-violet-500/5' : 'border-white/10 bg-zinc-900/50 border-dashed'} p-4 transition-all`}
                      >
                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
                          <h4 className="font-semibold text-lg flex items-center gap-2">
                            <MonitorPlay className={`w-4 h-4 ${assignedMatch ? 'text-violet-400' : 'text-muted-foreground'}`} />
                            {court.name}
                          </h4>
                          <Badge variant={assignedMatch ? "default" : "secondary"} className={assignedMatch ? 'bg-violet-600' : ''}>
                            {assignedMatch ? 'In Use' : 'Idle'}
                          </Badge>
                        </div>
                        
                        {assignedMatch ? (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-muted-foreground">{assignedMatch.eventId?.name} - R{assignedMatch.round}</span>
                              <Button 
                                variant="destructive" 
                                size="sm" 
                                className="h-6 text-[10px] px-2"
                                onClick={() => assignMatchMutation.mutate({ matchId: assignedMatch._id, courtId: null })}
                              >
                                Unassign
                              </Button>
                            </div>
                            
                            <div className="flex items-center justify-between px-2">
                              <div className="text-sm font-semibold truncate flex-1 text-center">
                                {getPlayerName(assignedMatch.participant1Id?.participantIds)}
                              </div>
                              <Swords className="w-4 h-4 text-muted-foreground mx-4" />
                              <div className="text-sm font-semibold truncate flex-1 text-center">
                                {getPlayerName(assignedMatch.participant2Id?.participantIds)}
                              </div>
                            </div>
                            
                            <div className="pt-2 flex justify-center">
                              <Link href={`/workspace/tournaments/${tournamentId}/matches/${assignedMatch._id}/score`} target="_blank">
                                <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(5,150,105,0.3)]">
                                  Open Referee Screen
                                </Button>
                              </Link>
                            </div>
                          </div>
                        ) : (
                          <div className="h-32 flex items-center justify-center text-muted-foreground text-sm flex-col gap-2">
                            <CheckCircle className="w-6 h-6 opacity-20" />
                            Drag a match here to assign
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
