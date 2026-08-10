'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Activity, History, Swords, ExternalLink, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function PlayerDashboardPage() {
  const { data: res, isLoading } = useQuery({
    queryKey: ['player-dashboard'],
    queryFn: async () => {
      const response = await fetch('/api/player/dashboard');
      if (!response.ok) throw new Error('Failed to fetch dashboard');
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
      </div>
    );
  }

  if (res?.error === 'Unauthorized') {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4">
        <h1 className="text-3xl font-bold mb-4">Please Log In</h1>
        <p className="text-muted-foreground mb-6">You need to be logged in to view your dashboard.</p>
        <Link href="/login">
          <Button>Log In</Button>
        </Link>
      </div>
    );
  }

  const { registrations, stats, user, sponsors } = res?.data || { registrations: [], stats: {}, user: {}, sponsors: [] };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Dashboard Header */}
      <div className="bg-zinc-950 border-b border-white/5 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="w-24 h-24 border-4 border-violet-500/20">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="text-3xl bg-violet-900/40 text-violet-300">
                {user.name?.charAt(0) || 'P'}
              </AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{user.name || 'Player'}</h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
            <div className="md:ml-auto">
              <Link href="/tournaments">
                <Button className="bg-white text-black hover:bg-white/90">
                  <Swords className="w-4 h-4 mr-2" /> Find Tournaments
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-zinc-900/50 border-white/5 hover:border-violet-500/30 transition-colors">
            <CardContent className="p-6 flex flex-col items-center text-center gap-2">
              <Trophy className="w-8 h-8 text-amber-400" />
              <p className="text-sm text-muted-foreground">Tournaments</p>
              <h3 className="text-3xl font-bold">{stats.tournamentsEntered || 0}</h3>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-white/5 hover:border-violet-500/30 transition-colors">
            <CardContent className="p-6 flex flex-col items-center text-center gap-2">
              <Swords className="w-8 h-8 text-violet-400" />
              <p className="text-sm text-muted-foreground">Matches Played</p>
              <h3 className="text-3xl font-bold">{stats.matchesPlayed || 0}</h3>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-white/5 hover:border-violet-500/30 transition-colors">
            <CardContent className="p-6 flex flex-col items-center text-center gap-2">
              <Activity className="w-8 h-8 text-emerald-400" />
              <p className="text-sm text-muted-foreground">Win Rate</p>
              <h3 className="text-3xl font-bold">
                {stats.matchesPlayed > 0 ? Math.round((stats.matchesWon / stats.matchesPlayed) * 100) : 0}%
              </h3>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-white/5 hover:border-violet-500/30 transition-colors">
            <CardContent className="p-6 flex flex-col items-center text-center gap-2">
              <History className="w-8 h-8 text-blue-400" />
              <p className="text-sm text-muted-foreground">UTR Level</p>
              <h3 className="text-3xl font-bold">{stats.currentUtr || 'N/A'}</h3>
            </CardContent>
          </Card>
        </div>

        {/* Registrations List */}
        <Card className="bg-zinc-900/30 border-white/5">
          <CardHeader>
            <CardTitle>My Tournament Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            {registrations.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Trophy className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>You haven't registered for any tournaments yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {registrations.map((reg: any) => (
                  <div key={reg._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 gap-4">
                    <div className="flex items-center gap-4">
                      {reg.tournamentId?.coverImage ? (
                        <img src={reg.tournamentId.coverImage} className="w-16 h-16 rounded-lg object-cover" alt="Tournament" />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-zinc-800 flex items-center justify-center">
                          <Trophy className="w-6 h-6 text-white/20" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-lg">{reg.tournamentId?.name || 'Unknown Tournament'}</h4>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                          <Badge variant="outline" className="border-white/10">{reg.eventId?.name}</Badge>
                          <span>{reg.tournamentId?.startDate ? format(new Date(reg.tournamentId.startDate), 'MMM dd, yyyy') : ''}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="text-right flex-1 sm:flex-none">
                        <p className="text-xs text-muted-foreground mb-1">Status</p>
                        <Badge variant={reg.status === 'Approved' ? 'default' : reg.status === 'Pending' ? 'secondary' : 'destructive'} 
                               className={reg.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20' : ''}>
                          {reg.status}
                        </Badge>
                      </div>
                      
                      <Link href={`/tournaments/${reg.tournamentId?._id}`}>
                        <Button variant="ghost" size="icon">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sponsor Carousel */}
        {sponsors && sponsors.length > 0 && (
          <Card className="bg-zinc-900/30 border-white/5 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-widest text-center">
                Supported By
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex overflow-x-auto gap-8 pb-4 items-center justify-start sm:justify-center custom-scrollbar">
                {sponsors.map((sponsor: any) => (
                  <div key={sponsor._id} className="flex-shrink-0 h-16 w-32 bg-white/5 rounded p-2 flex items-center justify-center hover:bg-white/10 transition-colors">
                    <img src={sponsor.logoUrl} alt={sponsor.name} className="max-h-full max-w-full object-contain" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}
