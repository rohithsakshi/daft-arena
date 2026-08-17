// @ts-nocheck
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Trophy, Plus, ArrowLeft, Trash2, Users, Loader2, GripVertical, Settings2 } from 'lucide-react';
import { EventType, Gender, AgeCategory, DrawType } from '@/modules/core/enums';

export default function ManageEventsPage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const tournamentId = params?.tournamentId as string;

  const [isCreating, setIsCreating] = React.useState(false);
  const [eventName, setEventName] = React.useState('');
  const [eventType, setEventType] = React.useState<EventType>(EventType.Singles);
  const [gender, setGender] = React.useState<Gender>(Gender.Male);
  const [ageCategory, setAgeCategory] = React.useState<AgeCategory>(AgeCategory.Senior);
  const [drawType, setDrawType] = React.useState<DrawType>(DrawType.Knockout);
  const [maxEntries, setMaxEntries] = React.useState<number | ''>(32);
  const [entryFee, setEntryFee] = React.useState<number | ''>(0);

  // Team Tie rubber config state
  const [rubberCount, setRubberCount] = React.useState<number | ''>(5);
  const [winCondition, setWinCondition] = React.useState<number | ''>(3);
  const [rubbers, setRubbers] = React.useState([
    { order: 1, rubberType: EventType.Singles,      name: 'Rubber 1 - Singles' },
    { order: 2, rubberType: EventType.Doubles,      name: 'Rubber 2 - Doubles' },
    { order: 3, rubberType: EventType.MixedDoubles, name: 'Rubber 3 - Mixed Doubles' },
    { order: 4, rubberType: EventType.ReverseSingles, name: 'Rubber 4 - Reverse Singles' },
    { order: 5, rubberType: EventType.ReverseSingles, name: 'Rubber 5 - Reverse Singles' },
  ]);

  const isTeamTie = eventType === EventType.Team && drawType === DrawType.Tie;

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

  // Fetch Events
  const { data: eventsRes, isLoading } = useQuery({
    queryKey: ['tournament-events', tournamentId],
    queryFn: async () => {
      const res = await fetch(`/api/tournaments/${tournamentId}/events`);
      if (!res.ok) throw new Error('Failed to load events');
      return res.json();
    },
    enabled: Boolean(tournamentId),
  });

  const tournament = tournamentRes?.data;
  const events = eventsRes?.data || [];

  // Update maxEntries default when tournament loads
  React.useEffect(() => {
    if (tournament?.capacity && maxEntries === 32) {
      setMaxEntries(tournament.capacity);
    }
  }, [tournament?.capacity]);

  // Create Event Mutation
  const createMutation = useMutation({
    mutationFn: async () => {
      // Step 1: Create the event
      const res = await fetch(`/api/tournaments/${tournamentId}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tournamentId,
          name: eventName,
          eventType,
          gender,
          ageCategory,
          drawType,
          maxEntries: Number(maxEntries) || 32,
          entryFee: Number(entryFee) || 0,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create event');

      // Step 2: If Team Tie, save rubber configuration
      if (isTeamTie && data?.data?._id) {
        const eventId = data.data._id;
        const configRes = await fetch(`/api/tournaments/${tournamentId}/events/${eventId}/tie-config`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rubberCount, winCondition, rubbers })
        });
        const configData = await configRes.json();
        if (!configRes.ok) throw new Error(configData.error || 'Failed to save rubber config');
      }

      return data;
    },
    onSuccess: () => {
      toast.success('Event created successfully');
      setEventName('');
      setIsCreating(false);
      queryClient.invalidateQueries({ queryKey: ['tournament-events', tournamentId] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to create event');
    },
  });

  const updateRubber = (index: number, field: string, value: any) => {
    setRubbers(prev => prev.map((r, i) => i === index ? { ...r, [field]: value } : r));
  };

  const addRubber = () => {
    const nextOrder = rubbers.length + 1;
    setRubbers(prev => [...prev, { order: nextOrder, rubberType: EventType.Singles, name: `Rubber ${nextOrder}` }]);
    setRubberCount(prev => prev + 1);
  };

  const removeRubber = (index: number) => {
    setRubbers(prev => prev.filter((_, i) => i !== index).map((r, i) => ({ ...r, order: i + 1 })));
    setRubberCount(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName.trim()) {
      toast.error('Please enter an event name');
      return;
    }
    createMutation.mutate();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/workspace/tournaments/${tournamentId}`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Events Management</h2>
            <p className="text-muted-foreground text-sm">
              {tournament ? tournament.name : 'Manage tournament disciplines and event categories'}
            </p>
          </div>
        </div>

        <Button onClick={() => setIsCreating(!isCreating)}>
          <Plus className="w-4 h-4 mr-2" />
          {isCreating ? 'Close Form' : 'Add Event'}
        </Button>
      </div>

      {/* Create Event Card */}
      {isCreating && (
        <Card className="border-violet-500/30 bg-violet-500/5">
          <CardHeader>
            <CardTitle>Create New Event Discipline</CardTitle>
            <CardDescription>Add categories like Men's Singles, Women's Doubles, U19 Boys, etc.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Event Name *</Label>
                  <Input
                    placeholder="e.g. Men's Singles Open"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Event Type</Label>
                  <Select value={eventType} onValueChange={(v) => setEventType(v as EventType)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value={EventType.Singles}>Singles</SelectItem>
                      <SelectItem value={EventType.Doubles}>Doubles</SelectItem>
                      <SelectItem value={EventType.MixedDoubles}>Mixed Doubles</SelectItem>
                      <SelectItem value={EventType.Team}>Team</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select value={gender} onValueChange={(v) => setGender(v as Gender)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value={Gender.Male}>Male</SelectItem>
                      <SelectItem value={Gender.Female}>Female</SelectItem>
                      <SelectItem value={Gender.Mixed}>Mixed</SelectItem>
                      <SelectItem value={Gender.Other}>Open / Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Age Category</Label>
                  <Select value={ageCategory} onValueChange={(v) => setAgeCategory(v as AgeCategory)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value={AgeCategory.Open || 'Senior'}>Open / Senior</SelectItem>
                      <SelectItem value={AgeCategory.U19}>U19</SelectItem>
                      <SelectItem value={AgeCategory.U17}>U17</SelectItem>
                      <SelectItem value={AgeCategory.U15}>U15</SelectItem>
                      <SelectItem value={AgeCategory.U13}>U13</SelectItem>
                      <SelectItem value={AgeCategory.U11}>U11</SelectItem>
                      <SelectItem value={AgeCategory.Veteran40}>Veteran 40+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Draw / Format Type</Label>
                  <Select value={drawType} onValueChange={(v) => setDrawType(v as DrawType)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value={DrawType.Knockout}>Single Knockout</SelectItem>
                      <SelectItem value={DrawType.RoundRobin}>Round Robin</SelectItem>
                      <SelectItem value={DrawType.League}>League</SelectItem>
                      <SelectItem value={DrawType.Group}>Group Stage + Knockout</SelectItem>
                      <SelectItem value={DrawType.Tie}>Team Tie (Rubbers)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Max Participants / Teams</Label>
                  <Input
                    type="number"
                    min="2"
                    value={maxEntries}
                    onChange={(e) => setMaxEntries(e.target.value === '' ? '' : parseInt(e.target.value) || 32)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Event Fee ({tournament?.currency || 'INR'})</Label>
                  <Input
                    type="number"
                    min="0"
                    value={entryFee}
                    onChange={(e) => setEntryFee(e.target.value === '' ? '' : parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              {/* Team Tie Rubber Configuration */}
              {isTeamTie && (
                <div className="mt-6 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-semibold text-amber-400 flex items-center gap-2">
                      🏸 Team Tie — Rubber Configuration
                    </h4>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Label className="text-xs">Win Condition</Label>
                        <Input
                          type="number" min="1" max={rubberCount}
                          value={winCondition}
                          onChange={(e) => setWinCondition(e.target.value === '' ? '' : parseInt(e.target.value) || 3)}
                          className="w-16 h-8 text-sm"
                        />
                        <span className="text-xs text-muted-foreground">rubbers to win</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {rubbers.map((rubber, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-black/30 rounded-lg border border-white/5">
                        <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-xs font-bold shrink-0">
                          {rubber.order}
                        </div>
                        <Input
                          value={rubber.name}
                          onChange={(e) => updateRubber(index, 'name', e.target.value)}
                          className="flex-1 h-8 text-sm"
                          placeholder="Rubber name"
                        />
                        <Select
                          value={rubber.rubberType}
                          onValueChange={(v) => updateRubber(index, 'rubberType', v)}
                        >
                          <SelectTrigger className="w-48 h-8 text-sm"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value={EventType.Singles}>Singles</SelectItem>
                            <SelectItem value={EventType.Doubles}>Doubles</SelectItem>
                            <SelectItem value={EventType.MixedDoubles}>Mixed Doubles</SelectItem>
                            <SelectItem value={EventType.ReverseSingles}>Reverse Singles</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          type="button" variant="ghost" size="icon"
                          onClick={() => removeRubber(index)}
                          className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-950/30 shrink-0"
                          disabled={rubbers.length <= 1}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addRubber} className="w-full border-dashed border-amber-500/30 text-amber-400 hover:bg-amber-500/5">
                    <Plus className="w-3.5 h-3.5 mr-2" /> Add Rubber
                  </Button>
                  <p className="text-xs text-amber-400/70 text-center">
                    First team to win <strong>{winCondition}</strong> rubbers wins the Tie
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Creating...' : 'Save Event'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Events List */}
      <Card>
        <CardHeader>
          <CardTitle>Configured Events ({events.length})</CardTitle>
          <CardDescription>Events available for player registration in this tournament.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground space-y-3">
              <Trophy className="w-10 h-10 mx-auto opacity-30" />
              <p>No events configured yet for this tournament.</p>
              <Button size="sm" onClick={() => setIsCreating(true)}>
                <Plus className="w-4 h-4 mr-2" /> Add First Event
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map((ev: any) => (
                <div key={ev._id || ev.id} className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-base">{ev.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {ev.eventType} • {ev.gender} • {ev.ageCategory}
                      </p>
                    </div>
                    <Badge variant="outline" className="border-violet-500/30 text-violet-300">
                      {ev.drawType}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-white/10">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> Max Entries: {ev.maxEntries || 32}
                    </span>
                    <span>
                      Fee: {ev.entryFee ? `${tournament?.currency || 'INR'} ${ev.entryFee}` : 'Included / Free'}
                    </span>
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
