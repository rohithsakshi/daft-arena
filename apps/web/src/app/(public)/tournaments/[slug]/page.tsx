'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, Trophy, Users, AlertCircle, ArrowLeft, Loader2, Info } from 'lucide-react';

export default function PublicTournamentDetailPage() {
  const params = useParams();
  const id = params?.slug as string;

  const { data: res, isLoading } = useQuery({
    queryKey: ['public-tournament', id],
    queryFn: async () => {
      const response = await fetch(`/api/tournaments/${id}`);
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    }
  });

  const { data: eventsRes, isLoading: isLoadingEvents } = useQuery({
    queryKey: ['public-tournament-events', id],
    queryFn: async () => {
      const response = await fetch(`/api/tournaments/${id}/events`);
      if (!response.ok) throw new Error('Failed to fetch events');
      return response.json();
    },
    enabled: !!id
  });

  const { data: sponsorsRes } = useQuery({
    queryKey: ['public-tournament-sponsors', id],
    queryFn: async () => {
      const response = await fetch(`/api/tournaments/${id}/sponsors`);
      if (!response.ok) throw new Error('Failed to fetch sponsors');
      return response.json();
    },
    enabled: !!id
  });

  const tournament = res?.data;
  const events = Array.isArray(eventsRes?.data) ? eventsRes.data : [];
  const sponsors = Array.isArray(sponsorsRes?.data) ? sponsorsRes.data : [];
  
  const titleSponsor = sponsors.find((s: any) => s.tier === 'Title');
  const otherSponsors = sponsors.filter((s: any) => s.tier !== 'Title');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <AlertCircle className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-3xl font-bold mb-2">Tournament Not Found</h1>
        <p className="text-muted-foreground mb-6">The tournament you are looking for does not exist or is not public.</p>
        <Link href="/tournaments">
          <Button variant="default">Back to Tournaments</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Hero Header */}
      <div className="relative h-[400px] overflow-hidden">
        {tournament.coverImage ? (
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: `url(${tournament.coverImage})` }} 
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/60 to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        
        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12">
          <Link href="/tournaments" className="inline-flex items-center text-sm text-violet-400 hover:text-violet-300 mb-6 w-fit transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tournaments
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                  Registrations Open
                </Badge>
                {titleSponsor && (
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                    <span className="text-xs text-muted-foreground uppercase font-semibold">Presented by</span>
                    <img src={titleSponsor.logoUrl} alt={titleSponsor.name} className="h-4 object-contain" />
                  </div>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{tournament.name}</h1>
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-violet-400" />
                  {tournament.startDate ? format(new Date(tournament.startDate), 'MMMM dd, yyyy') : 'Dates TBD'}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-violet-400" />
                  {tournament.location || 'Location TBD'}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-violet-400" />
                  Open for Everyone
                </div>
              </div>
            </div>
            
            <Link href={`/tournaments/${id}/register`}>
              <Button size="lg" className="w-full md:w-auto bg-violet-600 hover:bg-violet-500 text-white font-semibold shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                Register Now
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl mb-8 overflow-x-auto flex w-fit max-w-full justify-start">
            <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-violet-600 data-[state=active]:text-white">Overview</TabsTrigger>
            <TabsTrigger value="events" className="rounded-lg data-[state=active]:bg-violet-600 data-[state=active]:text-white">Categories & Events</TabsTrigger>
            <TabsTrigger value="brackets" className="rounded-lg data-[state=active]:bg-violet-600 data-[state=active]:text-white">Brackets & Live Scores</TabsTrigger>
            <TabsTrigger value="sponsors" className="rounded-lg data-[state=active]:bg-violet-600 data-[state=active]:text-white">Sponsors</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8 animate-in fade-in-50 duration-500">
            <Card className="bg-zinc-900/50 border-white/10">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <Info className="w-5 h-5 text-violet-400" /> About this Tournament
                </h3>
                <div className="prose prose-invert max-w-none text-muted-foreground">
                  {tournament.description ? (
                    <p className="whitespace-pre-wrap leading-relaxed">{tournament.description}</p>
                  ) : (
                    <p>No description provided for this tournament.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {tournament.rules && (
              <Card className="bg-zinc-900/50 border-white/10">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold mb-6">Rules & Regulations</h3>
                  <div className="prose prose-invert max-w-none text-muted-foreground whitespace-pre-wrap">
                    {tournament.rules}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="events" className="animate-in fade-in-50 duration-500">
            {isLoadingEvents ? (
              <div className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-violet-500" /></div>
            ) : events.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground border border-dashed border-white/20 rounded-xl">
                <Trophy className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No events have been created for this tournament yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((ev: any) => (
                  <Card key={ev._id} className="bg-zinc-900/80 border-white/10 hover:border-violet-500/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-xl font-bold">{ev.name}</h4>
                        <Badge variant="outline" className="bg-violet-500/10 text-violet-300 border-violet-500/30">
                          {ev.eventType}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3 text-sm text-muted-foreground mb-6">
                        <div className="flex justify-between pb-2 border-b border-white/5">
                          <span>Gender Category</span>
                          <span className="text-white capitalize">{ev.gender || 'Mixed'}</span>
                        </div>
                        <div className="flex justify-between pb-2 border-b border-white/5">
                          <span>Age Category</span>
                          <span className="text-white capitalize">{ev.ageCategory || 'Open'}</span>
                        </div>
                        <div className="flex justify-between pb-2 border-b border-white/5">
                          <span>Format</span>
                          <span className="text-white">{ev.drawType || 'Knockout'}</span>
                        </div>
                        {ev.entryFee && (
                          <div className="flex justify-between pb-2 border-b border-white/5">
                            <span>Entry Fee</span>
                            <span className="text-emerald-400 font-bold">₹{ev.entryFee}</span>
                          </div>
                        )}
                      </div>

                      <Link href={`/tournaments/${id}/register?eventId=${ev._id}`}>
                        <Button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/5">
                          Register for Event
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="brackets" className="animate-in fade-in-50 duration-500">
            <Card className="bg-zinc-900/50 border-white/10">
              <CardContent className="p-12 text-center">
                <Trophy className="w-16 h-16 mx-auto mb-6 text-violet-500/50" />
                <h3 className="text-2xl font-bold mb-2">Draws not yet published</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  The brackets and draws for this tournament will be published once registrations close. Check back later!
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sponsors" className="animate-in fade-in-50 duration-500">
            {sponsors.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground border border-dashed border-white/20 rounded-xl">
                <p>No sponsors have been added yet.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {titleSponsor && (
                  <div className="text-center mb-12">
                    <h3 className="text-sm font-semibold text-violet-400 uppercase tracking-widest mb-4">Title Sponsor</h3>
                    <div className="bg-white/5 border border-white/10 p-8 rounded-2xl inline-block">
                      <img src={titleSponsor.logoUrl} alt={titleSponsor.name} className="h-24 object-contain mx-auto" />
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {otherSponsors.map((sponsor: any) => (
                    <Card key={sponsor._id} className="bg-white/5 border-white/10 flex flex-col items-center justify-center p-6 hover:bg-white/10 transition-colors">
                      <div className="h-16 flex items-center justify-center w-full bg-white rounded p-2 mb-4">
                        <img src={sponsor.logoUrl} alt={sponsor.name} className="max-h-full max-w-full object-contain" />
                      </div>
                      <Badge variant="outline" className={`
                        ${sponsor.tier === 'Gold' ? 'border-amber-500/50 text-amber-400' : ''}
                        ${sponsor.tier === 'Silver' ? 'border-slate-300/50 text-slate-300' : ''}
                        ${sponsor.tier === 'Bronze' ? 'border-orange-800/50 text-orange-400' : ''}
                      `}>
                        {sponsor.tier}
                      </Badge>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}
