'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, MapPin, CalendarDays, Swords, Hash, Activity } from 'lucide-react';
import Link from 'next/link';

export default function PlayerProfilePage() {
  const params = useParams();
  const userId = params?.userId as string;

  const { data: res, isLoading, error } = useQuery({
    queryKey: ['player-profile', userId],
    queryFn: async () => {
      const response = await fetch(`/api/players/${userId}`);
      if (!response.ok) throw new Error('Failed to load profile');
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !res?.data) {
    return (
      <div className="text-center py-24 text-muted-foreground">
        Player not found or profile is private.
      </div>
    );
  }

  const { profile, stats, recentMatches } = res.data;

  // Calculate win rate
  const winRate = stats.totalMatches > 0 ? Math.round((stats.wins / stats.totalMatches) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-8 px-4">
      {/* Top Banner / Hero Profile */}
      <div className="relative rounded-2xl bg-zinc-900/50 border border-white/10 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-violet-600/30 to-fuchsia-600/30 w-full" />
        <div className="px-6 md:px-10 pb-8 relative flex flex-col md:flex-row gap-6 md:items-end -mt-12">
          
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-black bg-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-bold text-muted-foreground">{profile.name?.charAt(0) || 'U'}</span>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              {profile.name}
              {stats.rank > 0 && stats.rank <= 10 && (
                <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/50">Top 10 Player</Badge>
              )}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {profile.location && (
                <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {profile.location}</div>
              )}
              <div className="flex items-center gap-1"><CalendarDays className="w-4 h-4" /> Joined {new Date(profile.createdAt).getFullYear()}</div>
            </div>
            
            {profile.bio && <p className="text-sm max-w-2xl text-zinc-300 mt-2">{profile.bio}</p>}
            
            {profile.sports && profile.sports.length > 0 && (
              <div className="flex gap-2 mt-4">
                {profile.sports.map((sport: string) => (
                  <Badge key={sport} variant="secondary">{sport}</Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="shrink-0 bg-black/40 p-4 rounded-xl border border-white/5 text-center min-w-[120px]">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1 font-semibold flex justify-center items-center gap-1">
              <Hash className="w-3 h-3" /> Global Rank
            </div>
            <div className="text-3xl font-bold text-violet-400">
              {stats.rank > 0 ? `#${stats.rank}` : 'Unranked'}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Col: Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" /> Career Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white/5 rounded-lg text-center">
                  <div className="text-2xl font-bold">{stats.totalMatches}</div>
                  <div className="text-xs text-muted-foreground">Matches</div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg text-center">
                  <div className="text-2xl font-bold text-emerald-400">{winRate}%</div>
                  <div className="text-xs text-muted-foreground">Win Rate</div>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-lg text-center">
                  <div className="text-xl font-bold text-emerald-400">{stats.wins}</div>
                  <div className="text-xs text-muted-foreground">Wins</div>
                </div>
                <div className="p-3 bg-red-500/10 rounded-lg text-center">
                  <div className="text-xl font-bold text-red-400">{stats.losses}</div>
                  <div className="text-xs text-muted-foreground">Losses</div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Ranking Points</span>
                  <span className="text-sm font-bold text-violet-400">{stats.points} pts</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-violet-500 h-2 rounded-full" style={{ width: `${Math.min((stats.points / 1000) * 100, 100)}%` }}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">Next tier at {Math.ceil((stats.points + 1) / 500) * 500} pts</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" /> Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.wins >= 10 ? (
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-500/20 to-transparent border border-amber-500/20 rounded-lg">
                  <Medal className="w-6 h-6 text-amber-400" />
                  <div>
                    <div className="text-sm font-bold text-amber-400">Veteran Competitor</div>
                    <div className="text-xs text-muted-foreground">10+ Career Wins</div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">Keep playing to unlock achievements!</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Recent Matches */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Swords className="w-5 h-5" /> Recent Match History
          </h3>
          
          <div className="space-y-3">
            {recentMatches.length === 0 ? (
              <div className="text-center p-8 bg-zinc-900/50 border border-white/5 rounded-xl text-muted-foreground">
                No official matches played yet.
              </div>
            ) : (
              recentMatches.map((match: any) => {
                // Determine if this user won
                const isWinner = match.winnerId && (
                  (match.participant1Id?._id === match.winnerId && match.participant1Id?.participantIds.some((p:any) => p._id === userId)) ||
                  (match.participant2Id?._id === match.winnerId && match.participant2Id?.participantIds.some((p:any) => p._id === userId))
                );
                
                const p1Names = match.participant1Id?.participantIds.map((p:any) => p.name).join(' & ');
                const p2Names = match.participant2Id?.participantIds.map((p:any) => p.name).join(' & ');

                return (
                  <div key={match._id} className={`p-4 rounded-xl border ${isWinner ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/10 bg-zinc-900/50'} flex flex-col sm:flex-row gap-4 items-center justify-between`}>
                    <div className="space-y-1 w-full sm:w-auto text-center sm:text-left">
                      <Link href={`/tournaments/${match.tournamentId?.slug || match.tournamentId?._id}`} className="text-xs text-violet-400 hover:underline">
                        {match.tournamentId?.name || 'Tournament'}
                      </Link>
                      <div className="flex items-center justify-center sm:justify-start gap-4 text-base font-semibold">
                        <span className={match.winnerId === match.participant1Id?._id ? 'text-white' : 'text-muted-foreground'}>{p1Names}</span>
                        <span className="text-[10px] text-muted-foreground bg-white/10 px-2 py-0.5 rounded-full">VS</span>
                        <span className={match.winnerId === match.participant2Id?._id ? 'text-white' : 'text-muted-foreground'}>{p2Names}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(match.endTime || match.updatedAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex flex-col items-center sm:items-end gap-2 shrink-0">
                      {isWinner ? (
                        <Badge className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20">Victory</Badge>
                      ) : (
                        <Badge variant="secondary" className="opacity-70">Defeat</Badge>
                      )}
                      
                      <div className="text-sm font-mono tracking-wider font-bold">
                        {match.scores?.p1?.map((s: number, i: number) => `${s}-${match.scores.p2[i]}`).join(', ')}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
