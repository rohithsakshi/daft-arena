'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Trophy, Users, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function PublicTournamentsPage() {
  const [search, setSearch] = React.useState('');

  const { data: res, isLoading } = useQuery({
    queryKey: ['public-tournaments'],
    queryFn: async () => {
      const response = await fetch('/api/tournaments/public');
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    }
  });

  const tournaments = res?.data || [];

  const filteredTournaments = tournaments.filter((t: any) => 
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-zinc-950 py-20 border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-black to-black" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <Badge variant="outline" className="mb-4 border-violet-500/30 text-violet-300 bg-violet-500/10 backdrop-blur-md">
            Badminton Tournaments
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Find Your Next Challenge
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Discover and register for competitive and casual badminton tournaments in your area. Track your stats, view live brackets, and compete for glory.
          </p>
          
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              className="w-full pl-12 h-14 bg-white/5 border-white/10 text-lg rounded-2xl focus-visible:ring-violet-500/50" 
              placeholder="Search by tournament name or location..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tournaments Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredTournaments.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <h3 className="text-xl font-semibold text-white mb-2">No Tournaments Found</h3>
            <p>We couldn't find any tournaments matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.map((t: any) => (
              <Card key={t._id} className="bg-zinc-900/50 border-white/5 hover:border-violet-500/30 transition-all overflow-hidden group flex flex-col">
                <div className="h-48 bg-zinc-800 relative overflow-hidden">
                  {t.coverImage ? (
                    <img src={t.coverImage} alt={t.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-violet-900/40 to-zinc-900 flex items-center justify-center">
                      <Trophy className="w-16 h-16 text-white/10" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 backdrop-blur-md">
                      Registrations Open
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6 flex-1">
                  <h3 className="text-xl font-bold mb-2 line-clamp-1">{t.name}</h3>
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-violet-400" />
                      {t.startDate ? format(new Date(t.startDate), 'MMM dd, yyyy') : 'TBD'}
                      {t.endDate && ` - ${format(new Date(t.endDate), 'MMM dd, yyyy')}`}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-violet-400" />
                      <span className="truncate">{t.location || 'Location TBD'}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {t.description || 'Join this exciting badminton tournament. Multiple categories available for different skill levels and age groups.'}
                  </p>
                </CardContent>

                <CardFooter className="p-6 pt-0 border-t border-white/5 mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium bg-white/5 px-2.5 py-1 rounded-md">
                    <Users className="w-3.5 h-3.5" />
                    Open for All
                  </div>
                  <Link href={`/tournaments/${t._id}`}>
                    <Button variant="default" size="sm" className="bg-white text-black hover:bg-white/90">
                      View Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
