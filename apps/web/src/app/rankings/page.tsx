'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, ArrowUpRight, Search, Medal } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

export default function GlobalRankingsPage() {
  const [search, setSearch] = React.useState('');

  const { data: res, isLoading } = useQuery({
    queryKey: ['global-rankings'],
    queryFn: async () => {
      const response = await fetch('/api/rankings?limit=100');
      if (!response.ok) throw new Error('Failed to load rankings');
      return response.json();
    }
  });

  const players = res?.data || [];

  const filteredPlayers = players.filter((p: any) => 
    p.userId?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-12 px-4">
      {/* Header */}
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-5xl font-black tracking-tight flex items-center justify-center gap-3">
          <Trophy className="w-12 h-12 text-amber-500" />
          Global Leaderboard
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          The ultimate ranking of athletes on Daft Arena. Compete in tournaments to earn points and climb the ladder!
        </p>
      </div>

      <div className="flex justify-between items-center gap-4 flex-col sm:flex-row bg-zinc-900/50 p-4 rounded-xl border border-white/5">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search players..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-black/50 border-white/10 h-11"
          />
        </div>
        <div className="text-sm text-muted-foreground shrink-0">
          Showing Top 100 Players
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Podium for top 3 (only if not searching to keep it clean) */}
          {!search && players.length >= 3 && (
            <div className="flex flex-col md:flex-row justify-center items-end gap-6 mb-16 pt-12">
              {/* 2nd Place */}
              <Link href={`/players/${players[1].userId._id}`} className="order-2 md:order-1 flex-1 max-w-[200px] flex flex-col items-center group">
                <div className="relative mb-4">
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-zinc-400 text-black font-bold rounded-full flex items-center justify-center z-10 border-2 border-black shadow-[0_0_15px_rgba(161,161,170,0.5)]">2</div>
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-zinc-400 group-hover:scale-105 transition-transform bg-zinc-800 flex items-center justify-center">
                    {players[1].userId?.avatar ? <img src={players[1].userId.avatar} className="w-full h-full object-cover"/> : <span className="text-2xl font-bold">{players[1].userId?.name?.charAt(0)}</span>}
                  </div>
                </div>
                <div className="text-center w-full bg-gradient-to-t from-zinc-800 to-zinc-900/50 p-4 rounded-t-xl border border-b-0 border-white/10 h-32 flex flex-col justify-end pb-6">
                  <div className="font-bold truncate w-full">{players[1].userId?.name}</div>
                  <div className="text-violet-400 font-semibold">{players[1].points} pts</div>
                </div>
              </Link>

              {/* 1st Place */}
              <Link href={`/players/${players[0].userId._id}`} className="order-1 md:order-2 flex-1 max-w-[220px] flex flex-col items-center group z-10">
                <div className="relative mb-6">
                  <div className="absolute -top-5 -right-5 w-10 h-10 bg-amber-400 text-black font-black text-lg rounded-full flex items-center justify-center z-10 border-2 border-black shadow-[0_0_25px_rgba(251,191,36,0.6)]">1</div>
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-amber-400 group-hover:scale-105 transition-transform bg-zinc-800 flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.2)]">
                    {players[0].userId?.avatar ? <img src={players[0].userId.avatar} className="w-full h-full object-cover"/> : <span className="text-4xl font-bold">{players[0].userId?.name?.charAt(0)}</span>}
                  </div>
                </div>
                <div className="text-center w-full bg-gradient-to-t from-amber-900/40 to-zinc-900 p-4 rounded-t-xl border border-b-0 border-amber-500/30 h-40 flex flex-col justify-end pb-8 shadow-[0_-10px_30px_rgba(251,191,36,0.1)]">
                  <div className="font-bold text-lg truncate w-full">{players[0].userId?.name}</div>
                  <div className="text-amber-400 font-bold">{players[0].points} pts</div>
                </div>
              </Link>

              {/* 3rd Place */}
              <Link href={`/players/${players[2].userId._id}`} className="order-3 md:order-3 flex-1 max-w-[200px] flex flex-col items-center group">
                <div className="relative mb-2">
                  <div className="absolute -top-3 -right-3 w-7 h-7 bg-amber-700 text-white font-bold rounded-full flex items-center justify-center z-10 border-2 border-black shadow-[0_0_15px_rgba(180,83,9,0.5)]">3</div>
                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-amber-700 group-hover:scale-105 transition-transform bg-zinc-800 flex items-center justify-center">
                    {players[2].userId?.avatar ? <img src={players[2].userId.avatar} className="w-full h-full object-cover"/> : <span className="text-xl font-bold">{players[2].userId?.name?.charAt(0)}</span>}
                  </div>
                </div>
                <div className="text-center w-full bg-gradient-to-t from-amber-950/40 to-zinc-900/50 p-4 rounded-t-xl border border-b-0 border-amber-700/30 h-28 flex flex-col justify-end pb-4">
                  <div className="font-bold truncate w-full text-sm">{players[2].userId?.name}</div>
                  <div className="text-amber-500 font-semibold text-sm">{players[2].points} pts</div>
                </div>
              </Link>
            </div>
          )}

          {/* List View */}
          <div className="bg-zinc-900/30 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 bg-zinc-900/80 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <div className="col-span-1 text-center">Rank</div>
              <div className="col-span-5 md:col-span-4">Player</div>
              <div className="col-span-3 text-center hidden md:block">Win Rate</div>
              <div className="col-span-3 text-center hidden md:block">W / L</div>
              <div className="col-span-6 md:col-span-2 text-right md:text-center">Points</div>
            </div>

            <div className="divide-y divide-white/5">
              {filteredPlayers.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">No players found.</div>
              ) : (
                filteredPlayers.map((player: any, index: number) => {
                  const actualRank = index + 1;
                  const winRate = player.totalMatches > 0 ? Math.round((player.wins / player.totalMatches) * 100) : 0;
                  
                  return (
                    <Link 
                      href={`/players/${player.userId?._id}`} 
                      key={player._id}
                      className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/[0.02] transition-colors group"
                    >
                      <div className="col-span-1 text-center font-mono font-bold text-muted-foreground group-hover:text-white transition-colors">
                        {actualRank}
                      </div>
                      
                      <div className="col-span-5 md:col-span-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 overflow-hidden border border-white/10">
                          {player.userId?.avatar ? (
                            <img src={player.userId.avatar} className="w-full h-full object-cover" />
                          ) : (
                            <span className="font-bold text-xs">{player.userId?.name?.charAt(0)}</span>
                          )}
                        </div>
                        <div className="truncate">
                          <div className="font-semibold text-sm sm:text-base group-hover:text-violet-400 transition-colors flex items-center gap-1">
                            {player.userId?.name} 
                            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          {player.userId?.location && <div className="text-xs text-muted-foreground truncate">{player.userId.location}</div>}
                        </div>
                      </div>

                      <div className="col-span-3 text-center hidden md:block">
                        <div className="inline-flex items-center gap-2">
                          <span className={`font-semibold ${winRate >= 60 ? 'text-emerald-400' : winRate >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
                            {winRate}%
                          </span>
                        </div>
                      </div>

                      <div className="col-span-3 text-center hidden md:block text-sm text-muted-foreground">
                        {player.wins} / {player.losses}
                      </div>

                      <div className="col-span-6 md:col-span-2 flex items-center justify-end md:justify-center">
                        <Badge variant="secondary" className="bg-violet-500/10 text-violet-400 border-violet-500/20 text-sm py-1">
                          {player.points}
                        </Badge>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
