// @ts-nocheck
'use client';

import React from 'react';
import { TimelineEvent } from '../types';
import { WidgetContainer } from '@/components/shared/WidgetContainer';
import {
  Trophy, CreditCard, BarChart3, Calendar, CheckCircle2, Star, Award, ShieldCheck, Mail, Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityTimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export function ActivityTimeline({ events, className }: ActivityTimelineProps) {
  const getIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'REGISTRATION':
        return { Icon: Trophy, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' };
      case 'PAYMENT':
        return { Icon: CreditCard, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' };
      case 'DRAW_RELEASED':
        return { Icon: BarChart3, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' };
      case 'MATCH_SCHEDULED':
        return { Icon: Calendar, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' };
      case 'MATCH_COMPLETED':
        return { Icon: CheckCircle2, color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20' };
      case 'RANKING_UPDATED':
        return { Icon: Star, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' };
      case 'CERTIFICATE_ISSUED':
        return { Icon: Award, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' };
      default:
        return { Icon: Trophy, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' };
    }
  };

  if (events.length === 0) {
    return (
      <WidgetContainer className="p-12 text-center flex flex-col items-center justify-center border-dashed bg-card/10">
        <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center mb-4">
          <Activity className="w-8 h-8 text-violet-400 opacity-80" />
        </div>
        <h3 className="text-sm font-bold text-foreground mb-1">No Activity Yet</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          No recent activities logged on your profile timeline. Register for tournaments to start building your activity feed.
        </p>
      </WidgetContainer>
    );
  }

  return (
    <div className={cn('relative pl-6 space-y-6 border-l border-white/5', className)}>
      {events.map((event, idx) => {
        const config = getIcon(event.type);
        const ActiveIcon = config.Icon;

        return (
          <div key={event.id} className="relative">
            {/* Timeline pointer bullet */}
            <span className={cn(
              'absolute -left-[37px] top-0 p-1.5 rounded-full border bg-background flex items-center justify-center shadow-sm',
              config.bg
            )}>
              <ActiveIcon className={cn('w-3.5 h-3.5', config.color)} />
            </span>

            {/* Event Content Box */}
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-3">
                <h4 className="font-bold text-xs text-foreground">{event.title}</h4>
                <span className="text-[9px] text-muted-foreground font-mono">
                  {new Date(event.timestamp).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {event.description}
              </p>
              {event.referenceId && (
                <p className="text-[9px] font-mono text-violet-400 mt-1">
                  Reference: {event.referenceId}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
