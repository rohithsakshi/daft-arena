'use client';

import React from 'react';
import Link from 'next/link';
import { Trophy, Calendar, Users, Home, Settings, MapPin, Search, User, Medal, Bell, CreditCard, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const adminNavigation = [
  { name: 'Dashboard', href: '/workspace', icon: Home },
  { name: 'Tournaments', href: '/workspace/tournaments', icon: Trophy },
  { name: 'Schedules', href: '/workspace/schedules', icon: Calendar },
  { name: 'Participants', href: '/workspace/participants', icon: Users },
  { name: 'Venues', href: '/workspace/venues', icon: MapPin },
  { name: 'Settings', href: '/workspace/settings', icon: Settings },
];

const playerNavigation = [
  { name: 'Dashboard', href: '/workspace/player', icon: Home, exact: true },
  { name: 'Discover Tournaments', href: '/workspace/player/tournaments', icon: Search },
  { name: 'My Tournaments', href: '/workspace/player/my-tournaments', icon: Trophy },
  { name: 'Matches', href: '/workspace/player/matches', icon: Calendar },
  { name: 'Rankings', href: '/workspace/player/rankings', icon: Medal },
  { name: 'Notifications', href: '/workspace/player/notifications', icon: Bell },
  { name: 'Transactions', href: '/workspace/player/transactions', icon: CreditCard },
  { name: 'Profile', href: '/workspace/player/profile', icon: User },
  { name: 'Settings', href: '/workspace/player/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const isPlayerMode = pathname.startsWith('/workspace/player');
  const navigation = isPlayerMode ? playerNavigation : adminNavigation;

  return (
    <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
          DAFT Arena
        </span>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = 'exact' in item && item.exact 
            ? pathname === item.href 
            : pathname.startsWith(item.href);
            
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      {/* IAM Placeholder User Profile Area */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {isPlayerMode ? 'P' : 'A'}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{isPlayerMode ? 'Player User' : 'Admin User'}</p>
            <p className="text-xs text-muted-foreground">{isPlayerMode ? 'Competitor' : 'Workspace Owner'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
