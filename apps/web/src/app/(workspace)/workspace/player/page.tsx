// @ts-nocheck
import React from 'react';
import { PlayerService } from '@/modules/player/services/player.client.service';
import { UpcomingMatchCard } from '@/modules/player/components/UpcomingMatchCard';
import { MyTournamentCard } from '@/modules/player/components/MyTournamentCard';
import { QuickActionCard } from '@/modules/player/components/QuickActionCard';
import { EmptyState } from '@/modules/player/components/EmptyState';
import { MOCK_USER_ID } from '@/modules/player/constants';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { DashboardGrid } from '@/components/shared/DashboardGrid';
import { StatisticWidget } from '@/components/shared/StatisticWidget';
import { WidgetContainer } from '@/components/shared/WidgetContainer';
import {
  Trophy, Search, User, Bell, Medal, Target,
  TrendingUp, Zap, Calendar, ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Player Dashboard | DAFT Arena',
  description: 'Your personal DAFT Arena player hub.',
};

export default async function PlayerDashboardPage() {
  const [profile, matches, tournaments] = await Promise.all([
    PlayerService.getProfile(MOCK_USER_ID),
    PlayerService.getMyMatches(MOCK_USER_ID),
    PlayerService.getMyTournaments(MOCK_USER_ID),
  ]);

  const upcomingMatches = matches.filter((m) => m.status === 'UPCOMING');
  const activeRegistrations = tournaments.filter(
    (t) => t.status === 'REGISTERED' || t.status === 'PENDING_PAYMENT'
  );
  const unreadNotificationCount = 2; // from mock data

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Welcome header container */}
      <WidgetContainer className="p-6 md:p-8 bg-gradient-to-r from-violet-900/40 via-purple-900/30 to-card/60">
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}
        />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Active Player</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              Welcome back, {profile.fullName.split(' ')[0]} 👋
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              {upcomingMatches.length > 0
                ? `You have ${upcomingMatches.length} upcoming match${upcomingMatches.length > 1 ? 'es' : ''}.`
                : 'Your DAFT Arena player hub.'}
            </p>
          </div>
          <Link
            href="/workspace/player/profile"
            className="flex-shrink-0 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
            aria-label="View my profile"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center text-sm font-black text-white shadow-lg">
              {profile.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-foreground">{profile.fullName}</p>
              <p className="text-xs text-muted-foreground">View profile</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all" />
          </Link>
        </div>
      </WidgetContainer>

      {/* Stats row widget system */}
      <DashboardGrid cols={4}>
        <StatisticWidget
          title="Win Ratio"
          value={`${profile.stats.winRatio}%`}
          icon={Target}
          iconColorClass="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
          trend={{ value: 5.2, label: 'vs last month' }}
        />
        <StatisticWidget
          title="Matches Played"
          value={profile.stats.matchesPlayed}
          subtitle={`${profile.stats.matchesWon} wins`}
          icon={Trophy}
          iconColorClass="text-violet-400 bg-violet-500/10 border-violet-500/20"
        />
        <StatisticWidget
          title="Titles Won"
          value={profile.stats.tournamentsWon}
          subtitle={`of ${profile.stats.tournamentsEntered} entered`}
          icon={Medal}
          iconColorClass="text-amber-400 bg-amber-500/10 border-amber-500/20"
        />
        <StatisticWidget
          title="Active Entries"
          value={activeRegistrations.length}
          subtitle="tournaments registered"
          icon={Zap}
          iconColorClass="text-blue-400 bg-blue-500/10 border-blue-500/20"
        />
      </DashboardGrid>

      {/* Main layout container with sidebar */}
      <DashboardGrid cols="sidebar">
        {/* Left column (main) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Matches */}
          <section aria-labelledby="up-next-heading">
            <SectionHeader
              title="Up Next"
              icon={Calendar}
              titleSize="md"
              className="mb-4"
              action={
                <Link
                  href="/workspace/player/matches"
                  className="text-xs md:text-sm text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1 transition-colors group"
                  aria-label="View all scheduled matches"
                >
                  All matches <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              }
            />

            {upcomingMatches.length > 0 ? (
              <DashboardGrid cols={2}>
                {upcomingMatches.slice(0, 2).map((match: any) => (
                  <UpcomingMatchCard key={match.id} match={match} />
                ))}
              </DashboardGrid>
            ) : (
              <EmptyState
                icon={Calendar}
                title="No Upcoming Matches"
                description="Register for a tournament to get scheduled for matches."
                action={
                  <Link
                    href="/workspace/player/tournaments"
                    className="inline-flex items-center gap-2 h-9 px-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold transition-colors"
                  >
                    <Search className="w-4 h-4" /> Find Tournaments
                  </Link>
                }
              />
            )}
          </section>

          {/* My Active Tournaments */}
          <section aria-labelledby="my-tournaments-heading">
            <SectionHeader
              title="My Tournaments"
              icon={Trophy}
              titleSize="md"
              className="mb-4"
              action={
                <Link
                  href="/workspace/player/my-tournaments"
                  className="text-xs md:text-sm text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1 transition-colors group"
                  aria-label="Manage registrations"
                >
                  Manage <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              }
            />

            {activeRegistrations.length > 0 ? (
              <DashboardGrid cols={2}>
                {activeRegistrations.slice(0, 4).map((tournament: any) => (
                  <MyTournamentCard key={tournament.id} tournament={tournament} />
                ))}
              </DashboardGrid>
            ) : (
              <EmptyState
                icon={Trophy}
                title="No Active Registrations"
                description="You haven't registered for any upcoming tournaments yet."
                action={
                  <Link
                    href="/workspace/player/tournaments"
                    className="inline-flex items-center gap-2 h-9 px-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold transition-colors"
                  >
                    <Search className="w-4 h-4" /> Discover Tournaments
                  </Link>
                }
              />
            )}
          </section>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Quick Access</h2>
          <div className="grid grid-cols-1 gap-4">
            <QuickActionCard
              title="Discover Tournaments"
              description="Find your next competition and register"
              icon={Search}
              href="/workspace/player/tournaments"
              colorClass="text-violet-400 bg-violet-500/10 border-violet-500/20"
            />
            <QuickActionCard
              title="My Profile"
              description="Update your details and preferences"
              icon={User}
              href="/workspace/player/profile"
              colorClass="text-blue-400 bg-blue-500/10 border-blue-500/20"
            />
            <QuickActionCard
              title="Notifications"
              description="View recent alerts and updates"
              icon={Bell}
              href="/workspace/player/notifications"
              colorClass="text-amber-400 bg-amber-500/10 border-amber-500/20"
              badge={unreadNotificationCount > 0 ? String(unreadNotificationCount) : undefined}
            />
            <QuickActionCard
              title="Rankings"
              description="Check your standing across categories"
              icon={TrendingUp}
              href="/workspace/player/rankings"
              colorClass="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
            />
          </div>
        </div>
      </DashboardGrid>
    </div>
  );
}
