'use client';

import React, { useState } from 'react';
import { PlayerNotification } from '../types';
import { NotificationCard } from './NotificationCard';
import { EmptyState } from './EmptyState';
import { Button } from '@/components/ui/button';
import { Bell, CheckCheck, SlidersHorizontal, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationCenterProps {
  notifications: PlayerNotification[];
  onMarkAllRead?: () => void;
  className?: string;
}

export function NotificationCenter({ notifications, onMarkAllRead, className }: NotificationCenterProps) {
  const [filter, setFilter] = useState<'ALL' | 'TOURNAMENT' | 'MATCH' | 'PAYMENT'>('ALL');
  const [showPreferences, setShowPreferences] = useState(false);

  const filteredNotifs = notifications.filter(n => {
    if (filter === 'ALL') return true;
    return n.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Action Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-white/5">
        <div className="flex gap-1.5 overflow-x-auto py-1">
          {[
            { id: 'ALL', label: 'All' },
            { id: 'TOURNAMENT', label: 'Tournaments' },
            { id: 'MATCH', label: 'Matches' },
            { id: 'PAYMENT', label: 'Payments' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as unknown)}
              className={cn(
                'text-xs font-bold px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap',
                filter === tab.id
                  ? 'bg-violet-600 border-violet-500 text-white'
                  : 'bg-white/5 border-white/5 text-muted-foreground hover:bg-white/8'
              )}
            >
              {tab.label}
              {tab.id === 'ALL' && unreadCount > 0 && (
                <span className="ml-1.5 text-[9px] bg-white/20 text-white px-1.5 py-0.5 rounded-md font-black">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && onMarkAllRead && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAllRead}
              className="text-xs text-muted-foreground hover:text-foreground gap-1.5 h-8"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List Grid */}
      {filteredNotifs.length > 0 ? (
        <div className="space-y-3">
          {filteredNotifs.map((n) => (
            <NotificationCard key={n.id} notification={n} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bell}
          title="No Notifications Found"
          description={
            filter === 'ALL'
              ? "All caught up! You don't have any notifications right now."
              : `You don't have any notifications under ${filter.toLowerCase()} category.`
          }
        />
      )}
    </div>
  );
}
