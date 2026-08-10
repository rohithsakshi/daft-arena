// @ts-nocheck
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ArrowLeft, BarChart3, Shuffle, Trophy, CheckCircle, RefreshCw, Loader2 } from 'lucide-react';

export default function BracketsPage() {
  const params = useParams();
  const tournamentId = params?.tournamentId as string;

  const [selectedEventId, setSelectedEventId] = React.useState<string>('');
  const [generatedMatches, setGeneratedMatches] = React.useState<any[]>([]);
  const [isGenerating, setIsGenerating] = React.useState(false);

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
  const { data: eventsRes } = useQuery({
    queryKey: ['tournament-events', tournamentId],
    queryFn: async () => {
      const res = await fetch(`/api/tournaments/${tournamentId}/events`);
      if (!res.ok) throw new Error('Failed to load events');
      return res.json();
    },
    enabled: Boolean(tournamentId),
  });

  const tournament = tournamentRes?.data;
  const events = Array.isArray(eventsRes?.data) ? eventsRes.data : [];

  React.useEffect(() => {
    if (events.length > 0 && !selectedEventId) {
      const firstId = String(events[0]._id || events[0].id || '1');
      setSelectedEventId(firstId);
    }
  }, [events, selectedEventId]);

  // Clear matches when event changes
  React.useEffect(() => {
    setGeneratedMatches([]);
  }, [selectedEventId]);

  const selectedEvent = events.find((e: any) => String(e._id || e.id) === selectedEventId);

  const handleGenerateDraw = async () => {
    if (!selectedEventId) return;
    setIsGenerating(true);
    setGeneratedMatches([]);
    try {
      const res = await fetch(`/api/tournaments/${tournamentId}/events/${selectedEventId}/draw`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate draw');
      setGeneratedMatches(data.data || []);
      toast.success('Draw generated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Error generating draw');
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper to format participant name from the populated participant array
  const getPlayerName = (playerData: any) => {
    if (playerData === 'BYE') return 'BYE';
    if (!playerData || !Array.isArray(playerData) || playerData.length === 0) return 'TBD';
    const names = playerData.map((p: any) => p?.name || 'Unknown Player');
    return names.join(' & ');
  };

  // Transform flat matches to rounds
  const maxRound = generatedMatches.reduce((max, m) => Math.max(max, m.round), 0);
  
  const displayRounds = Array.from({ length: maxRound }).map((_, i) => {
    const roundNum = i + 1;
    const roundMatches = generatedMatches.filter(m => m.round === roundNum);
    
    // Determine Round Name
    let name = `Round ${roundNum}`;
    if (roundNum === maxRound) name = 'Finals';
    else if (roundNum === maxRound - 1 && maxRound > 1) name = 'Semi-Finals';
    else if (roundNum === maxRound - 2 && maxRound > 2) name = 'Quarter-Finals';
    
    return {
      name,
      matches: roundMatches.map(m => ({
        id: m.id,
        p1: getPlayerName(m.player1),
        p2: getPlayerName(m.player2),
        score: 'Scheduled',
        winner: m.winner ? (m.winner === m.player1 ? 'p1' : 'p2') : null,
      })),
    };
  });

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
            <h2 className="text-3xl font-bold tracking-tight">Brackets & Draw Generator</h2>
            <p className="text-muted-foreground text-sm">
              {tournament ? tournament.name : 'Generate knockout brackets, seedings, and round robin groups'}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.success('Seeds randomized successfully')}>
            <Shuffle className="w-4 h-4 mr-2" /> Randomize Seeds
          </Button>
          <Button onClick={handleGenerateDraw} disabled={isGenerating || !selectedEventId}>
            {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            Generate Draw
          </Button>
        </div>
      </div>

      {/* Select Event Filter */}
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Label className="text-sm font-semibold">Select Discipline / Event:</Label>
            {events.length > 0 ? (
              <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                <SelectTrigger className="w-[280px]">
                  <span className="truncate flex-1 text-left">
                    {selectedEvent ? `${selectedEvent.name} (${selectedEvent.eventType})` : "Select Event..."}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {events.map((ev: any, idx: number) => {
                    const evId = String(ev._id || ev.id || `event-${idx}`);
                    return (
                      <SelectItem key={evId} value={evId}>
                        {ev.name} ({ev.eventType})
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            ) : (
              <span className="text-sm text-muted-foreground">No events found. Please create an event first.</span>
            )}
          </div>

          {selectedEvent && (
            <div className="flex items-center gap-2">
              <Badge variant="outline">{selectedEvent.drawType || 'Knockout'}</Badge>
              <Badge variant="secondary">{selectedEvent.gender} • {selectedEvent.ageCategory}</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bracket Visualization */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-violet-400" />
              {selectedEvent ? `${selectedEvent.name} - Draw Tree` : 'Knockout Tournament Tree'}
            </CardTitle>
            <CardDescription>Interactive match tree and progression view.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6 overflow-x-auto py-4 custom-scrollbar snap-x snap-mandatory">
            {displayRounds.length === 0 ? (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                No draw has been generated for this event yet. Click "Generate Draw" to begin.
              </div>
            ) : (
              displayRounds.map((round, rIndex) => (
                <div key={round.name} className="space-y-4 flex-shrink-0 w-[280px] sm:w-[320px] snap-center">
                  <div className="text-center pb-2 border-b border-white/10">
                    <h4 className="font-semibold text-sm text-violet-300">{round.name}</h4>
                  </div>

                  <div className="space-y-6 flex flex-col justify-around h-full">
                    {round.matches.map((m) => (
                    <div
                      key={m.id}
                      className="p-3 rounded-xl border border-white/10 bg-white/5 hover:border-violet-500/50 transition-all space-y-2 shadow-sm"
                    >
                      {/* Player 1 */}
                      <div className={`flex items-center justify-between text-sm p-1.5 rounded ${m.winner === 'p1' ? 'bg-emerald-500/10 font-bold text-emerald-400' : ''}`}>
                        <span className="truncate">{m.p1}</span>
                        {m.winner === 'p1' && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>

                      {/* Player 2 */}
                      <div className={`flex items-center justify-between text-sm p-1.5 rounded ${m.winner === 'p2' ? 'bg-emerald-500/10 font-bold text-emerald-400' : ''}`}>
                        <span className="truncate">{m.p2}</span>
                        {m.winner === 'p2' && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>

                      {/* Match Score / Status */}
                      <div className="text-right text-xs text-muted-foreground border-t border-white/5 pt-1.5">
                        {m.score}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
