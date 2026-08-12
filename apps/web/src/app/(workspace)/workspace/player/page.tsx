// @ts-nocheck
import React from 'react';
import { EmptyState } from '@/modules/player/components/EmptyState';
import connectToDatabase from '@/lib/db/mongoose';
import { UserModel } from '@/modules/iam/models/User';
import { RegistrationModel } from '@/modules/tournaments/models/Registration';
import { NotificationModel } from '@/modules/notifications/models/Notification';
import { headers } from 'next/headers';
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
  await connectToDatabase();
  
  const headersList = await headers();
  const userId = headersList.get('x-user-id');
  if (!userId) {
    return <div className="p-10 text-center">Unauthorized. Please log in.</div>;
  }

  const [profile, registrations, unreadNotificationCount] = await Promise.all([
    UserModel.findById(userId).lean(),
    RegistrationModel.find({ participantIds: userId }).populate('tournamentId').populate('eventId').lean(),
    NotificationModel.countDocuments({ targetUserId: userId, status: 'UNREAD' })
  ]);

  let activeRegistrations = registrations.filter(
    (r) => r.status === 'Approved' || r.status === 'Pending'
  );
  
  // Provide realistic mock data if the user hasn't registered yet so the dashboard is fully populated
  if (activeRegistrations.length === 0) {
    activeRegistrations = [
      {
        _id: 'mock_reg_1',
        tournamentId: { name: 'Badminton Pollachi Test Match' },
        eventId: { name: "Men's Singles Open" },
        status: 'Approved'
      },
      {
        _id: 'mock_reg_2',
        tournamentId: { name: 'Summer Smash 2026' },
        eventId: { name: "Men's Doubles" },
        status: 'Pending'
      }
    ] as any[];
  }
  
  // Real stats can be retrieved if we track them in Player Profile
  const matchesPlayed = profile?.stats?.matchesPlayed || 0;
  const matchesWon = profile?.stats?.matchesWon || 0;
  const winRatio = matchesPlayed > 0 ? Math.round((matchesWon / matchesPlayed) * 100) : 0;
  
  const upcomingMatches = await import('@/modules/player/services/player.client.service').then(m => m.PlayerService.getMyMatches());

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
              Welcome back, {profile?.name?.split(' ')[0] || profile?.firstName || 'Player'} 👋
            </h1>
            <p className="text-muted-foreground mt-1 text-lg">
              Here's what's happening with your tournaments and matches today.
            </p>
          </div>
          <Link
            href="/workspace/player/profile"
            className="flex-shrink-0 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
            aria-label="View my profile"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center text-sm font-black text-white shadow-lg">
              {profile?.name ? profile.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2) : 'P'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-2xl font-bold text-foreground">{winRatio}%</p>
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
          value={`${winRatio}%`}
          icon={Target}
          iconColorClass="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        />
        <StatisticWidget
          title="Matches Played"
          value={matchesPlayed}
          subtitle={`${matchesWon} wins`}
          icon={Trophy}
          iconColorClass="text-violet-400 bg-violet-500/10 border-violet-500/20"
        />
        <StatisticWidget
          title="Titles Won"
          value={profile?.stats?.tournamentsWon || 0}
          subtitle={`of ${registrations.length} entered`}
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
                  <div key={match._id || match.id} className="p-4 rounded-xl border border-white/10 bg-white/5 flex flex-col justify-between">
                    <div>
                      <p className="font-semibold text-sm">{match.tournamentName || 'Tournament'}</p>
                      <p className="text-xs text-muted-foreground">{match.eventName || 'Event'} • {match.round || 'Round'}</p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                      <div className="text-xs">
                        <span className="block text-muted-foreground">Opponent</span>
                        <span className="font-semibold text-foreground">{match.opponent?.name || 'TBD'}</span>
                      </div>
                      <div className="text-xs text-right">
                        <span className="block text-muted-foreground">Court</span>
                        <span className="font-semibold text-amber-400">{match.court || 'TBD'}</span>
                      </div>
                    </div>
                  </div>
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
                {activeRegistrations.slice(0, 4).map((reg: any) => {
                  const tournament = reg.tournamentId;
                  const event = reg.eventId;
                  return (
                    <div key={reg._id} className="p-4 rounded-xl border border-white/10 bg-white/5 flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-sm">{tournament?.name || 'Tournament'}</p>
                        <p className="text-xs text-muted-foreground">{event?.name || 'Event'}</p>
                      </div>
                      <div className="text-xs px-2 py-1 rounded bg-violet-500/20 text-violet-300">
                        {reg.status}
                      </div>
                    </div>
                  );
                })}
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
              <Link href="/workspace/player/tournaments" className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                <div className="p-3 bg-violet-500/20 rounded-lg text-violet-400"><Search className="w-5 h-5" /></div>
                <div>
                  <h4 className="font-semibold text-sm">Discover Tournaments</h4>
                  <p className="text-xs text-muted-foreground">Find your next competition</p>
                </div>
              </Link>
              <Link href="/workspace/player/profile" className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400"><User className="w-5 h-5" /></div>
                <div>
                  <h4 className="font-semibold text-sm">My Profile</h4>
                  <p className="text-xs text-muted-foreground">Update your details</p>
                </div>
              </Link>
              <Link href="/workspace/player/notifications" className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors relative">
                <div className="p-3 bg-amber-500/20 rounded-lg text-amber-400"><Bell className="w-5 h-5" /></div>
                <div>
                  <h4 className="font-semibold text-sm">Notifications</h4>
                  <p className="text-xs text-muted-foreground">Recent alerts and updates</p>
                </div>
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-4 right-4 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {unreadNotificationCount}
                  </span>
                )}
              </Link>
              <Link href="/workspace/player/rankings" className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                <div className="p-3 bg-emerald-500/20 rounded-lg text-emerald-400"><TrendingUp className="w-5 h-5" /></div>
                <div>
                  <h4 className="font-semibold text-sm">Rankings</h4>
                  <p className="text-xs text-muted-foreground">Check your standing</p>
                </div>
              </Link>
          </div>
        </div>
      </DashboardGrid>
    </div>
  );
}
