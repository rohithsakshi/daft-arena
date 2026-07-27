'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { WidgetContainer } from '@/components/shared/WidgetContainer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, CheckCheck } from 'lucide-react';
import { format } from 'date-fns';

const TYPE_ICONS: Record<string, string> = {
  TOURNAMENT_PUBLISHED: '🏆',
  REGISTRATION_SUBMITTED: '✅',
  PAYMENT_PENDING: '⏳',
  PAYMENT_APPROVED: '🎉',
  PAYMENT_REJECTED: '❌',
  REGISTRATION_CLOSED: '🚫',
  FIXTURE_PUBLISHED: '📋',
  MATCH_TOMORROW: '📅',
  MATCH_TODAY: '⚡',
  MATCH_STARTED: '▶️',
  MATCH_COMPLETED: '🏅',
  RESULTS_PUBLISHED: '🏆',
  CERTIFICATE_AVAILABLE: '🎖️',
};

export default function NotificationsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['player-notifications'],
    queryFn: async () => {
      const res = await fetch('/api/notifications?limit=50');
      if (!res.ok) return { data: [], unreadCount: 0 };
      return res.json();
    },
  });

  const markAllMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true }),
      });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['player-notifications'] });
    },
  });

  const notifications: any[] = data?.data || [];
  const unreadCount: number = data?.unreadCount || 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex items-center justify-between">
        <SectionHeader
          title="Notifications"
          description={`${unreadCount} unread notifications`}
          icon={Bell}
        />
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={() => markAllMutation.mutate()} disabled={markAllMutation.isPending}>
            <CheckCheck className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
        )}
      </div>

      <WidgetContainer>
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-muted-foreground">No notifications yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {notifications.map((n: any) => (
              <div key={n._id} className={`flex items-start gap-4 p-4 transition-colors ${n.status === 'UNREAD' ? 'bg-violet-500/5' : ''}`}>
                <div className="text-2xl shrink-0 mt-0.5">
                  {TYPE_ICONS[n.type] || '🔔'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${n.status === 'UNREAD' ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                    {n.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {n.createdAt ? format(new Date(n.createdAt), 'PPp') : ''}
                  </p>
                </div>
                {n.status === 'UNREAD' && (
                  <div className="w-2 h-2 bg-violet-400 rounded-full shrink-0 mt-2" />
                )}
              </div>
            ))}
          </div>
        )}
      </WidgetContainer>
    </div>
  );
}
