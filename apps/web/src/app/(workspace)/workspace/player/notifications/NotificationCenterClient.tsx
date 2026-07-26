// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { PlayerNotification } from '@/modules/player/types';
import { NotificationCenter } from '@/modules/player/components/NotificationCenter';

export function NotificationCenterClient({ initialNotifications }: { initialNotifications: PlayerNotification[] }) {
  const [notifications, setNotifications] = useState<PlayerNotification[]>(initialNotifications);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <NotificationCenter
      notifications={notifications}
      onMarkAllRead={handleMarkAllRead}
    />
  );
}
