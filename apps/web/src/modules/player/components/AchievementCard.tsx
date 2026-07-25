'use client';

import React from 'react';
import { ProfileAchievement } from '../types';
import { WidgetContainer } from '@/components/shared/WidgetContainer';
import { Award, Trophy, Calendar, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AchievementCardProps {
  achievement: ProfileAchievement;
  variant?: 'gold' | 'silver' | 'bronze' | 'normal';
  className?: string;
}

export function AchievementCard({ achievement, variant = 'normal', className }: AchievementCardProps) {
  const icons = {
    gold: { Icon: Trophy, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    silver: { Icon: Award, color: 'text-slate-300', bg: 'bg-slate-500/10 border-slate-500/20' },
    bronze: { Icon: Award, color: 'text-amber-700', bg: 'bg-amber-700/10 border-amber-700/20' },
    normal: { Icon: Sparkles, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' }
  };

  const config = icons[variant] ?? icons.normal;
  const ActiveIcon = config.Icon;

  return (
    <WidgetContainer hoverEffect className={cn('p-5 flex gap-4', className)}>
      <div className={cn('p-3 rounded-xl border flex-shrink-0 self-start', config.bg)}>
        <ActiveIcon className={cn('w-5 h-5', config.color)} />
      </div>
      <div className="flex-1 min-w-0 space-y-2">
        <div>
          <h4 className="font-bold text-sm text-foreground truncate">{achievement.title}</h4>
          <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
            <Calendar className="w-3 h-3 text-violet-400" />
            {new Date(achievement.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        {achievement.description && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {achievement.description}
          </p>
        )}
      </div>
    </WidgetContainer>
  );
}
