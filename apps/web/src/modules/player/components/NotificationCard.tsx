// @ts-nocheck
import React from 'react';
import { PlayerNotification } from '../types';
import { Bell, Trophy, Calendar, DollarSign, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fromNow } from '../utils';

interface NotificationCardProps {
  notification: PlayerNotification;
  className?: string;
}

import { WidgetContainer } from '@/components/shared/WidgetContainer';

const TYPE_CONFIG = {
  MATCH: {
    icon: Calendar,
    iconColor: 'text-blue-400',
    bgColor: 'bg-blue-500/10 border-blue-500/20',
  },
  TOURNAMENT: {
    icon: Trophy,
    iconColor: 'text-amber-400',
    bgColor: 'bg-amber-500/10 border-amber-500/20',
  },
  PAYMENT: {
    icon: DollarSign,
    iconColor: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10 border-emerald-500/20',
  },
  SYSTEM: {
    icon: AlertCircle,
    iconColor: 'text-violet-400',
    bgColor: 'bg-violet-500/10 border-violet-500/20',
  },
} as const;

export function NotificationCard({ notification, className }: NotificationCardProps) {
  const config = TYPE_CONFIG[notification.type] ?? TYPE_CONFIG.SYSTEM;
  const IconComponent = config.icon;

  return (
    <WidgetContainer
      hoverEffect
      animate={false}
      className={cn(
        'relative flex gap-4 p-4 rounded-xl border transition-all duration-200 overflow-hidden',
        notification.isRead
          ? 'bg-transparent border-white/5 opacity-75'
          : 'bg-card/40 border-white/8',
        className
      )}
    >
      {/* Unread accent bar */}
      {!notification.isRead && (
        <div className="absolute left-0 top-3 bottom-3 w-0.5 bg-gradient-to-b from-violet-500 to-purple-600 rounded-r-full" />
      )}

      {/* Icon */}
      <div className={cn(
        'p-2.5 rounded-xl border flex-shrink-0 self-start mt-0.5',
        config.bgColor
      )}>
        <IconComponent className={cn('w-4 h-4', config.iconColor)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h4 className={cn(
            'text-sm font-semibold leading-tight',
            notification.isRead ? 'text-foreground/70' : 'text-foreground'
          )}>
            {notification.title}
          </h4>
          <span className="text-[10px] text-muted-foreground whitespace-nowrap pt-0.5 flex-shrink-0">
            {fromNow(notification.createdAt)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {notification.message}
        </p>
        {notification.actionUrl && (
          <a
            href={notification.actionUrl}
            className="inline-block text-xs text-violet-400 hover:text-violet-300 mt-2 font-medium transition-colors"
          >
            View details →
          </a>
        )}
      </div>

      {/* Read indicator */}
      {notification.isRead && (
        <div className="flex-shrink-0 self-start mt-0.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-muted-foreground/40" />
        </div>
      )}
    </WidgetContainer>
  );
}
