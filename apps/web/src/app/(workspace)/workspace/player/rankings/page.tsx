// @ts-nocheck
import React from 'react';
import { PlayerService } from '@/modules/player/services/player.client.service';
import { RankingCard } from '@/modules/player/components/RankingCard';
import { RankingChart } from '@/modules/player/components/RankingChart';
import { AchievementCard } from '@/modules/player/components/AchievementCard';
import { EmptyState } from '@/modules/player/components/EmptyState';
import { MOCK_USER_ID } from '@/modules/player/constants';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { DashboardGrid } from '@/components/shared/DashboardGrid';
import { StatisticWidget } from '@/components/shared/StatisticWidget';
import { Trophy, TrendingUp, Medal, Star, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Rankings | DAFT Arena',
  description: 'Your DAFT Arena point standings across all categories.',
};

export default async function RankingsPage() {
  const [rankings, profile] = await Promise.all([
    PlayerService.getRankings(MOCK_USER_ID),
    PlayerService.getProfile(MOCK_USER_ID),
  ]);

  const totalPoints = rankings.reduce((sum: any, r: any) => sum + r.points, 0);
  const bestNational = rankings
    .filter((r) => r.nationalRank !== null)
    .sort((a: any, b: any) => (a.nationalRank ?? 9999) - (b.nationalRank ?? 9999))[0];
  const bestDistrict = rankings
    .filter((r) => r.districtRank !== null)
    .sort((a: any, b: any) => (a.districtRank ?? 9999) - (b.districtRank ?? 9999))[0];

  const primaryRanking = rankings[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Header */}
      <SectionHeader
        title="Rankings"
        description="Your current DAFT Arena point standings across all categories."
        icon={TrendingUp}
        titleSize="xl"
      />

      {rankings.length > 0 ? (
        <>
          {/* Summary stats */}
          <DashboardGrid cols={4}>
            <StatisticWidget
              title="Total Points"
              value={totalPoints.toLocaleString()}
              icon={Star}
              iconColorClass="text-violet-400 bg-violet-500/10 border-violet-500/20"
            />
            <StatisticWidget
              title="Categories Ranked"
              value={rankings.length}
              icon={Trophy}
              iconColorClass="text-amber-400 bg-amber-500/10 border-amber-500/20"
            />
            <StatisticWidget
              title="Best District Rank"
              value={bestDistrict ? `#${bestDistrict.districtRank}` : '—'}
              subtitle={bestDistrict?.categoryName ?? ''}
              icon={Medal}
              iconColorClass="text-blue-400 bg-blue-500/10 border-blue-500/20"
            />
            <StatisticWidget
              title="Best National Rank"
              value={bestNational ? `#${bestNational.nationalRank}` : '—'}
              subtitle={bestNational?.categoryName ?? 'No national rank yet'}
              icon={TrendingUp}
              iconColorClass="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
            />
          </DashboardGrid>

          {/* Interactive Trends and Stands */}
          <DashboardGrid cols="sidebar">
            <div className="lg:col-span-2 space-y-6">
              {primaryRanking && (
                <RankingChart
                  title={`Points History: ${primaryRanking.categoryName}`}
                  history={primaryRanking.history}
                />
              )}

              {/* Achievements Section */}
              {profile.achievements && profile.achievements.length > 0 && (
                <div>
                  <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-violet-400" />
                    Achievements & Medals
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {profile.achievements.map((ach: any, idx: any) => (
                      <AchievementCard
                        key={idx}
                        achievement={ach}
                        variant={idx === 0 ? 'gold' : 'silver'}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Stands list */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Category Standings</h3>
              {rankings.map((ranking: any) => (
                <RankingCard key={ranking.categoryId} ranking={ranking} />
              ))}
            </div>
          </DashboardGrid>

          {/* Info note */}
          <div className="p-4 rounded-xl border border-white/5 bg-card/30 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground mb-1">How rankings work</p>
            <p>
              Points are earned by participating in sanctioned DAFT Arena tournaments.
              Rankings are updated within 48 hours of match completion.
              Only tournaments tagged as <span className="text-violet-400 font-medium">Ranked</span> contribute to your standing.
            </p>
          </div>
        </>
      ) : (
        <EmptyState
          icon={Trophy}
          title="No Rankings Yet"
          description="Participate in sanctioned tournaments to earn points and establish your rank across District, State, and National levels."
          action={
            <a
              href="/workspace/player/tournaments"
              className="inline-flex items-center gap-2 h-9 px-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              Find Ranked Tournaments
            </a>
          }
        />
      )}
    </div>
  );
}
