'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Plus, Users, Swords, MonitorPlay, CheckCircle, Copy, Send, Trash2, Smartphone } from 'lucide-react';
import Link from 'next/link';

export default function CourtOperationsPage() {
  const params = useParams();
  const tournamentId = params?.tournamentId as string;
  const queryClient = useQueryClient();

  const [newCourtName, setNewCourtName] = React.useState('');
  const [newUmpireName, setNewUmpireName] = React.useState('');
  const [newUmpirePhone, setNewUmpirePhone] = React.useState('');

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

  // Fetch Umpires
  const { data: umpiresRes } = useQuery({
    queryKey: ['umpires', tournamentId],
    queryFn: async () => {
      const res = await fetch(`/api/tournaments/${tournamentId}/umpires`);
      if (!res.ok) throw new Error('Failed to load umpires');
      return res.json();
    }
  });

  const courts = courtsRes?.data || [];
  const matches = matchesRes?.data || [];
  const umpires = umpiresRes?.data || [];

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

  const addUmpireMutation = useMutation({
    mutationFn: async ({ name, phone }: { name: string, phone: string }) => {
      const res = await fetch(`/api/tournaments/${tournamentId}/umpires`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone })
      });
      if (!res.ok) throw new Error('Failed to add umpire');
      return res.json();
    },
    onSuccess: () => {
      setNewUmpireName('');
      setNewUmpirePhone('');
      queryClient.invalidateQueries({ queryKey: ['umpires', tournamentId] });
      toast.success('Umpire added successfully!');
    }
  });

  const removeUmpireMutation = useMutation({
    mutationFn: async (umpireId: string) => {
      const res = await fetch(`/api/tournaments/${tournamentId}/umpires/${umpireId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to remove umpire');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['umpires', tournamentId] });
      toast.success('Umpire removed');
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

  const copyMagicLink = (token: string) => {
    const url = `${window.location.origin}/umpire/${token}`;
    navigator.clipboard.writeText(url);
    toast.success('Magic link copied to clipboard!');
  };

  const openWhatsApp = (phone: string, token: string) => {
    const url = `${window.location.origin}/umpire/${token}`;
    const message = `Hello! Here is your Umpire Dashboard access link for the tournament: ${url}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Live Operations</h2>
          <p className="text-muted-foreground">Manage courts, dispatch matches, and coordinate umpires.</p>
        </div>
      </div>

      <Tabs defaultValue="courts" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="courts">Courts & Dispatch</TabsTrigger>
          <TabsTrigger value="umpires">Umpires & Access</TabsTrigger>
          <TabsTrigger value="scheduler">Automated Scheduler</TabsTrigger>
        </TabsList>

        <TabsContent value="courts" className="space-y-6">
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
        </TabsContent>

        <TabsContent value="umpires">
          <Card className="bg-zinc-900/30 border-white/5">
            <CardHeader>
              <CardTitle>Umpire Management</CardTitle>
              <CardDescription>Add temporary umpires and share their magic access links.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row items-end gap-4 bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                <div className="space-y-2 flex-1 w-full">
                  <label className="text-sm font-medium">Umpire Name</label>
                  <Input 
                    placeholder="E.g. John Doe" 
                    value={newUmpireName} 
                    onChange={(e) => setNewUmpireName(e.target.value)} 
                  />
                </div>
                <div className="space-y-2 flex-1 w-full">
                  <label className="text-sm font-medium">Phone Number (Optional for WhatsApp)</label>
                  <Input 
                    placeholder="E.g. 1234567890" 
                    value={newUmpirePhone} 
                    onChange={(e) => setNewUmpirePhone(e.target.value)} 
                  />
                </div>
                <Button 
                  onClick={() => addUmpireMutation.mutate({ name: newUmpireName, phone: newUmpirePhone })}
                  disabled={!newUmpireName || addUmpireMutation.isPending}
                  className="w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Umpire
                </Button>
              </div>

              {umpires.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {umpires.map((umpire: any) => (
                    <div key={umpire._id} className="p-4 rounded-xl border border-white/10 bg-zinc-900/50 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-lg">{umpire.name}</h4>
                          {umpire.phone && <p className="text-sm text-muted-foreground">{umpire.phone}</p>}
                        </div>
                        <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300 hover:bg-red-950/30" onClick={() => removeUmpireMutation.mutate(umpire._id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="pt-2 flex flex-col gap-2">
                        <Button variant="secondary" className="w-full justify-start" onClick={() => copyMagicLink(umpire.token)}>
                          <Copy className="w-4 h-4 mr-2" /> Copy Magic Link
                        </Button>
                        {umpire.phone ? (
                          <Button variant="outline" className="w-full justify-start text-emerald-400 hover:text-emerald-300 border-emerald-900/50 hover:bg-emerald-950/30" onClick={() => openWhatsApp(umpire.phone, umpire.token)}>
                            <Send className="w-4 h-4 mr-2" /> Send via WhatsApp
                          </Button>
                        ) : (
                          <div className="text-xs text-muted-foreground text-center py-2 flex items-center justify-center gap-1">
                            <Smartphone className="w-3 h-3" /> Add phone to send via WhatsApp
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground border border-dashed border-white/10 rounded-xl">
                  No umpires added yet.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduler">
          <Card className="bg-zinc-900/30 border-white/5">
            <CardHeader>
              <CardTitle>Automated Match Scheduler</CardTitle>
              <CardDescription>
                Assign dates, times, courts, and umpires to all pending matches intelligently.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b border-white/5 pb-2">Configuration</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm">Start Date</label>
                      <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} id="schedule-date" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm">Avg Match Duration (mins)</label>
                      <Input type="number" defaultValue="30" id="schedule-duration" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm">Day Starts At</label>
                      <Input type="time" defaultValue="09:00" id="schedule-start-time" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm">Day Ends At</label>
                      <Input type="time" defaultValue="18:00" id="schedule-end-time" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm">Min Rest Time (mins)</label>
                      <Input type="number" defaultValue="20" id="schedule-rest" />
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-violet-600 hover:bg-violet-500 mt-4"
                    onClick={async () => {
                      try {
                        const date = (document.getElementById('schedule-date') as HTMLInputElement).value;
                        const duration = (document.getElementById('schedule-duration') as HTMLInputElement).value;
                        const startTime = (document.getElementById('schedule-start-time') as HTMLInputElement).value;
                        const endTime = (document.getElementById('schedule-end-time') as HTMLInputElement).value;
                        const rest = (document.getElementById('schedule-rest') as HTMLInputElement).value;
                        
                        if (courts.length === 0) return toast.error("Please add at least one court in the 'Courts & Dispatch' tab first.");

                        const res = await fetch(`/api/tournaments/${tournamentId}/operations/scheduler`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            startDate: date,
                            startTimeOfDay: startTime,
                            endTimeOfDay: endTime,
                            matchDuration: parseInt(duration),
                            restDuration: parseInt(rest),
                            availableCourtIds: courts.map((c: any) => c._id),
                            availableUmpireIds: umpires.map((u: any) => u._id)
                          })
                        });

                        const data = await res.json();
                        if (!res.ok) throw new Error(data.error);
                        
                        queryClient.invalidateQueries({ queryKey: ['ops-matches', tournamentId] });
                        toast.success(`Successfully scheduled ${data.data.scheduledCount} matches!`);
                      } catch (err: any) {
                        toast.error(err.message || 'Error generating schedule');
                      }
                    }}
                  >
                    Generate Schedule & Assign Roles
                  </Button>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold border-b border-white/5 pb-2 mb-4">Schedule Preview</h3>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {matches.filter((m: any) => m.startTime).length === 0 ? (
                      <div className="text-center p-6 bg-zinc-900/50 border border-white/5 rounded-xl text-muted-foreground text-sm">
                        No matches scheduled yet.
                      </div>
                    ) : (
                      matches
                        .filter((m: any) => m.startTime)
                        .sort((a: any, b: any) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                        .map((m: any) => {
                          const court = courts.find((c: any) => c._id === m.courtId);
                          const umpire = umpires.find((u: any) => u._id === m.umpireId);
                          return (
                            <div key={m._id} className="p-3 rounded-lg bg-zinc-900/80 border border-white/10 shadow-sm flex flex-col gap-2">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-semibold text-violet-300">
                                  {new Date(m.startTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                </span>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">{court?.name || 'TBD'}</Badge>
                                  {umpire && <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400">Umpire: {umpire.name}</Badge>}
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-sm font-medium">
                                <div className="truncate flex-1">{getPlayerName(m.participant1Id?.participantIds)}</div>
                                <div className="text-xs text-muted-foreground px-2">vs</div>
                                <div className="truncate flex-1 text-right">{getPlayerName(m.participant2Id?.participantIds)}</div>
                              </div>
                            </div>
                          );
                        })
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
