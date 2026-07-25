import React from 'react';
import { PlayerRanking } from '../types';
import { Medal, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

import { WidgetContainer } from '@/components/shared/WidgetContainer';

interface RankingCardProps {
  ranking: PlayerRanking;
  className?: string;
}

export function RankingCard({ ranking, className }: RankingCardProps) {
  const maxPoints = Math.max(...ranking.history.map((h) => h.points), 1);
  const latestPoints = ranking.history[ranking.history.length - 1]?.points ?? 0;
  const prevPoints = ranking.history[ranking.history.length - 2]?.points ?? latestPoints;
  const trend = latestPoints - prevPoints;

  return (
    <WidgetContainer
      hoverEffect
      className={cn('p-6', className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20">
            <Medal className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-sm leading-tight">{ranking.categoryName}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Current Standing</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-violet-400 to-purple-500">
            {ranking.points.toLocaleString()}
          </span>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Points</p>
        </div>
      </div>

      {/* Rank tiers */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {[
          { label: 'District', value: ranking.districtRank, color: 'text-amber-400' },
          { label: 'State', value: ranking.stateRank, color: 'text-blue-400' },
          { label: 'National', value: ranking.nationalRank, color: 'text-emerald-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-black/20 rounded-xl p-3 text-center border border-white/5">
            <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">{label}</p>
            <p className={cn('font-black text-xl', value ? color : 'text-white/20')}>
              {value ? `#${value}` : '—'}
            </p>
          </div>
        ))}
      </div>

      {/* Trend indicator */}
      {trend !== 0 && (
        <div className="flex items-center gap-2 mb-4 text-xs">
          {trend > 0 ? (
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              +{trend} pts this period
            </span>
          ) : (
            <span className="flex items-center gap-1 text-red-400 font-semibold">
              <TrendingDown className="w-3.5 h-3.5" />
              {trend} pts this period
            </span>
          )}
        </div>
      )}

      {/* Sparkline bars */}
      <div className="pt-4 border-t border-white/5">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3">Points History</p>
        <div className="flex items-end justify-between gap-1 h-14">
          {ranking.history.map((h, i) => {
            const heightPct = (h.points / maxPoints) * 100;
            const isLatest = i === ranking.history.length - 1;
            return (
              <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                <div
                  className={cn(
                    'w-full rounded-t-sm transition-all',
                    isLatest ? 'bg-violet-500' : 'bg-violet-500/30'
                  )}
                  style={{ height: `${Math.max(heightPct, 8)}%` }}
                />
                <span className="text-[9px] text-muted-foreground">{h.month}</span>
              </div>
            );
          })}
        </div>
      </div>
      </WidgetContainer>
  );
}
