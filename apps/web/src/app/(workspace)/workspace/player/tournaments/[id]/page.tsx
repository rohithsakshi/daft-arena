// @ts-nocheck
import React from 'react';
import { PlayerService } from '@/modules/player/services/player.client.service';
import { TournamentDetailsCard } from '@/modules/player/components/TournamentDetailsCard';
import { EmptyState } from '@/modules/player/components/EmptyState';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { DashboardGrid } from '@/components/shared/DashboardGrid';
import { WidgetContainer } from '@/components/shared/WidgetContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft, MapPin, Calendar, Users, Trophy,
  Clock, Tag, AlertCircle, Play, Info, BarChart3, Swords
} from 'lucide-react';
import Link from 'next/link';
import { formatTournamentDate } from '@/modules/player/utils';
import { TOURNAMENT_DISCOVERY_STATUS_COLORS } from '@/modules/player/constants';
import { cn } from '@/lib/utils';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tournament = await PlayerService.getTournamentDetail(id);
  return {
    title: tournament ? `${tournament.title} | DAFT Arena` : 'Tournament | DAFT Arena',
    description: tournament?.description ?? 'Tournament details',
  };
}

export default async function TournamentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tournament = await PlayerService.getTournamentDetail(id);

  if (!tournament) {
    return (
      <div className="animate-in fade-in duration-500">
        <Link
          href="/workspace/player/tournaments"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-0.5 transition-transform" />
          Back to Tournaments
        </Link>
        <EmptyState
          icon={AlertCircle}
          title="Tournament Not Found"
          description="This tournament does not exist or may have been removed."
          action={
            <Link
              href="/workspace/player/tournaments"
              className="inline-flex items-center gap-2 h-10 px-5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              Browse Tournaments
            </Link>
          }
        />
      </div>
    );
  }

  const dateRange = formatTournamentDate(tournament.startDate, tournament.endDate);
  const deadlineDate = tournament.registrationDeadline ? new Date(tournament.registrationDeadline) : null;
  const deadline = deadlineDate && !isNaN(deadlineDate.getTime())
    ? deadlineDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'TBA';
  const statusColorClass = TOURNAMENT_DISCOVERY_STATUS_COLORS[tournament.status] ?? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  const fillPct = tournament.capacity && tournament.registeredCount
    ? Math.round((tournament.registeredCount / tournament.capacity) * 100)
    : null;

  const sportsList = Array.isArray(tournament.sports) && tournament.sports.length > 0
    ? tournament.sports
    : [tournament.sport || tournament.sportName || 'Badminton'];

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      {/* Breadcrumb Section Header */}
      <SectionHeader
        title="Tournament Details"
        titleSize="sm"
        className="mb-4"
        action={
          <Link
            href="/workspace/player/tournaments"
            className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Tournaments
          </Link>
        }
      />

      <WidgetContainer className="bg-card/60 backdrop-blur-xl shadow-2xl">
        {/* Hero banner */}
        <div className="h-64 md:h-80 bg-gradient-to-br from-violet-700/50 via-purple-900/60 to-fuchsia-900/40 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '28px 28px' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Status badge */}
          <div className="absolute top-6 right-6">
            <span className={cn(
              'px-3 py-1.5 text-xs font-bold rounded-xl border backdrop-blur-md',
              statusColorClass
            )}>
              {(tournament.status || 'RegistrationOpen').replace('_', ' ')}
            </span>
          </div>

          {/* Hero text */}
          <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 right-6 md:right-10">
            {/* Sport tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {sportsList.map((sport: any) => (
                <span
                  key={sport}
                  className="text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg text-white border border-white/10"
                >
                  {sport}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-white mb-3 leading-tight drop-shadow-lg">
              {tournament.title}
            </h1>
            <p className="text-base text-white/70 max-w-2xl leading-relaxed">
              Organised by {tournament.organizerName}
            </p>
          </div>
        </div>

        {/* Quick facts strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-b border-white/5 bg-black/10">
          {[
            { icon: Calendar, label: 'Dates', value: dateRange, color: 'text-violet-400' },
            { icon: MapPin, label: 'Venue', value: tournament.venueName, color: 'text-emerald-400' },
            { icon: Clock, label: 'Reg. Deadline', value: deadline, color: 'text-amber-400' },
            {
              icon: Users,
              label: 'Capacity',
              value: tournament.capacity
                ? `${tournament.registeredCount ?? 0} / ${tournament.capacity}`
                : 'Unlimited',
              color: 'text-blue-400',
            },
          ].map(({ icon: IconC, label, value, color }) => (
            <div
              key={label}
              className="flex items-start gap-3 p-5 border-r border-white/5 last:border-r-0 md:last:border-r-0"
            >
              <IconC className={cn('w-4 h-4 mt-0.5 flex-shrink-0', color)} />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-foreground">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabbed content details */}
        <div className="p-6 md:p-10">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-white/5 border border-white/5 mb-8 h-10 w-full md:w-auto overflow-x-auto justify-start flex-nowrap whitespace-nowrap">
              <TabsTrigger value="overview" className="text-xs font-semibold gap-1.5 flex-1 md:flex-none">
                <Info className="w-3.5 h-3.5" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="brackets" className="text-xs font-semibold gap-1.5 flex-1 md:flex-none">
                <BarChart3 className="w-3.5 h-3.5" />
                Draws & Brackets
              </TabsTrigger>
              <TabsTrigger value="schedule" className="text-xs font-semibold gap-1.5 flex-1 md:flex-none">
                <Swords className="w-3.5 h-3.5" />
                Schedule & Scores
              </TabsTrigger>
            </TabsList>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left — tabs content */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-8 mt-0 focus:outline-none">
                  <section aria-labelledby="about-heading">
                    <h2 id="about-heading" className="text-lg font-bold text-foreground mb-3">About This Tournament</h2>
                    <p className="text-muted-foreground leading-relaxed">{tournament.description}</p>
                  </section>

                  {fillPct !== null && tournament.capacity && (
                    <section aria-labelledby="progress-heading">
                      <div className="flex items-center justify-between mb-2">
                        <h2 id="progress-heading" className="text-lg font-bold text-foreground">Registration Progress</h2>
                        <span className={cn(
                          'text-sm font-bold',
                          fillPct >= 90 ? 'text-red-400' : fillPct >= 75 ? 'text-amber-400' : 'text-emerald-400'
                        )}>
                          {fillPct}% filled
                        </span>
                      </div>
                      <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all',
                            fillPct >= 90
                              ? 'bg-gradient-to-r from-red-600 to-red-500'
                              : fillPct >= 75
                              ? 'bg-gradient-to-r from-amber-600 to-amber-500'
                              : 'bg-gradient-to-r from-violet-600 to-emerald-500'
                          )}
                          style={{ width: `${fillPct}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {tournament.registeredCount} of {tournament.capacity} spots claimed
                      </p>
                    </section>
                  )}

                  {/* Prize / Fee grid */}
                  {(tournament.prizePool || tournament.baseEntryFee > 0) && (
                    <DashboardGrid cols={2}>
                      {tournament.prizePool && (
                        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-900/30 to-emerald-900/10 border border-emerald-500/20 flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                            <Trophy className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div>
                            <p className="text-xs text-emerald-400/80 uppercase tracking-wider font-semibold mb-0.5">Prize Pool</p>
                            <p className="text-2xl font-black text-emerald-400">{tournament.prizePool}</p>
                          </div>
                        </div>
                      )}
                      {tournament.baseEntryFee > 0 && (
                        <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-900/30 to-violet-900/10 border border-violet-500/20 flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
                            <Tag className="w-5 h-5 text-violet-400" />
                          </div>
                          <div>
                            <p className="text-xs text-violet-400/80 uppercase tracking-wider font-semibold mb-0.5">Entry Fee From</p>
                            <p className="text-2xl font-black text-violet-400">
                              {(tournament.currency || 'INR').toUpperCase() === 'INR' ? '₹' : '$'}
                              {tournament.baseEntryFee}
                              <span className="text-sm font-normal text-violet-400/60 ml-1">{tournament.currency || 'INR'}</span>
                            </p>
                          </div>
                        </div>
                      )}
                    </DashboardGrid>
                  )}

                  {/* Venue information */}
                  <section aria-labelledby="venue-heading">
                    <h2 id="venue-heading" className="text-lg font-bold text-foreground mb-3">Venue</h2>
                    <div className="p-5 rounded-2xl bg-black/20 border border-white/5 flex items-start gap-4">
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <MapPin className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{tournament.venueName}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">{tournament.location}</p>
                        {tournament.venueAddress && (
                          <p className="text-xs text-muted-foreground mt-1">{tournament.venueAddress}</p>
                        )}
                      </div>
                    </div>
                  </section>
                </TabsContent>

                {/* Phase 9 Draws & Brackets Extension Point */}
                <TabsContent value="brackets" className="mt-0 focus:outline-none">
                  <EmptyState
                    icon={BarChart3}
                    title="Brackets & Draws"
                    description="Brackets are generated once registration closes and seedings are finalised. Check back soon."
                    action={
                      <div className="flex flex-wrap gap-2 justify-center">
                        <span className="text-xs font-semibold px-3 py-1 bg-white/5 text-muted-foreground border border-white/5 rounded-md">
                          Single Elimination
                        </span>
                        <span className="text-xs font-semibold px-3 py-1 bg-white/5 text-muted-foreground border border-white/5 rounded-md">
                          Double Elimination
                        </span>
                        <span className="text-xs font-semibold px-3 py-1 bg-white/5 text-muted-foreground border border-white/5 rounded-md">
                          Round Robin
                        </span>
                      </div>
                    }
                  />
                </TabsContent>

                {/* Phase 10 Schedule & Scoreboard Extension Point */}
                <TabsContent value="schedule" className="mt-0 focus:outline-none">
                  <EmptyState
                    icon={Swords}
                    title="Schedule & Live Scoreboards"
                    description="Match timings and tables will appear here when schedule drafting is completed by the organizers."
                    action={
                      <button disabled className="inline-flex items-center gap-1.5 h-9 px-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold">
                        <Play className="w-3.5 h-3.5 animate-pulse" />
                        Live Scoreboard Hook
                      </button>
                    }
                  />
                </TabsContent>

              </div>

              {/* Right — sidebar registration panel */}
              <div>
                <TournamentDetailsCard tournament={tournament} />
              </div>
            </div>
          </Tabs>
        </div>
      </WidgetContainer>
    </div>
  );
}
