'use client';

import React from 'react';
import { PlayerStats } from '../types';
import { WidgetContainer } from '@/components/shared/WidgetContainer';
import { StatisticWidget } from '@/components/shared/StatisticWidget';
import { Trophy, Swords, Zap, Activity, Star, Calendar } from 'lucide-react';
import { DashboardGrid } from '@/components/shared/DashboardGrid';
import { cn } from '@/lib/utils';

interface CareerStatisticsProps {
  stats: PlayerStats;
  medals: { gold: number; silver: number; bronze: number };
  winStreak?: number;
  className?: string;
}

export function CareerStatistics({ stats, medals, winStreak = 4, className }: CareerStatisticsProps) {
  const completionRate = 95; // e.g. 95% matches attended

  return (
    <div className={cn('space-y-6', className)}>
      {/* High-level numeric cards */}
      <DashboardGrid cols={4}>
        <StatisticWidget
          title="Matches Played"
          value={stats.matchesPlayed}
          icon={Swords}
          iconColorClass="text-violet-400 bg-violet-500/10 border-violet-500/20"
        />
        <StatisticWidget
          title="Matches Won"
          value={stats.matchesWon}
          icon={Trophy}
          iconColorClass="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        />
        <StatisticWidget
          title="Win Streak"
          value={`${winStreak} Wins`}
          icon={Zap}
          iconColorClass="text-amber-400 bg-amber-500/10 border-amber-500/20"
          subtitle="Active competitor streak"
        />
        <StatisticWidget
          title="Win Ratio"
          value={`${stats.winRatio}%`}
          icon={Activity}
          iconColorClass="text-blue-400 bg-blue-500/10 border-blue-500/20"
        />
      </DashboardGrid>

      {/* Progress & Accolades layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Career Medals Standings */}
        <WidgetContainer className="p-5 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Medals Tally</h4>
          
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
              <Star className="w-6 h-6 text-amber-400 mx-auto mb-1.5 fill-amber-500/10" />
              <p className="text-xl font-black text-foreground">{medals.gold}</p>
              <p className="text-[9px] text-muted-foreground uppercase font-bold mt-0.5">Gold</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-300/5 border border-slate-300/15">
              <Star className="w-6 h-6 text-slate-300 mx-auto mb-1.5 fill-slate-300/10" />
              <p className="text-xl font-black text-foreground">{medals.silver}</p>
              <p className="text-[9px] text-muted-foreground uppercase font-bold mt-0.5">Silver</p>
            </div>
            <div className="p-4 rounded-xl bg-amber-700/5 border border-amber-700/15">
              <Star className="w-6 h-6 text-amber-700 mx-auto mb-1.5 fill-amber-700/10" />
              <p className="text-xl font-black text-foreground">{medals.bronze}</p>
              <p className="text-[9px] text-muted-foreground uppercase font-bold mt-0.5">Bronze</p>
            </div>
          </div>
        </WidgetContainer>

        {/* Completion Indicators */}
        <WidgetContainer className="p-5 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Engagement Metrics</h4>
          
          <div className="space-y-4">
            {/* Completion Percentage */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Match Attendance Rate</span>
                <span className="font-bold text-foreground">{completionRate}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 rounded-full" style={{ width: `${completionRate}%` }} />
              </div>
            </div>

            {/* Tournaments won vs entered ratio */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Tournament Win Ratio</span>
                <span className="font-bold text-foreground">
                  {stats.tournamentsWon} / {stats.tournamentsEntered} Wins
                </span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-violet-600 rounded-full"
                  style={{ width: `${(stats.tournamentsWon / (stats.tournamentsEntered || 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </WidgetContainer>
      </div>
    </div>
  );
}
