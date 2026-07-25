import React from 'react';
import { PlayerService } from '@/modules/player/services/player.service';
import { MOCK_USER_ID } from '@/modules/player/constants';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Bell } from 'lucide-react';
import { NotificationCenterClient } from './NotificationCenterClient';

export const metadata = {
  title: 'Notifications | DAFT Arena',
  description: 'Alerts about your matches, tournaments, and account.',
};

export default async function NotificationsPage() {
  const notifications = await PlayerService.getNotifications(MOCK_USER_ID);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 max-w-3xl">
      {/* Header */}
      <SectionHeader
        title="Notifications Center"
        description="Alerts about your matches, tournaments, and payments."
        icon={Bell}
        titleSize="xl"
        badge={
          unreadCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-violet-500 text-white text-[10px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )
        }
      />

      <NotificationCenterClient initialNotifications={notifications} />
    </div>
  );
}
