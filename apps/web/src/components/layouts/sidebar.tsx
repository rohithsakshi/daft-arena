'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard,
  Trophy,
  CalendarDays,
  MapPin,
  Users,
  Settings
} from 'lucide-react';

const navItems = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Tournaments', href: '/tournaments', icon: Trophy },
  { title: 'Events', href: '/events', icon: CalendarDays },
  { title: 'Venues', href: '/venues', icon: MapPin },
  { title: 'Registrations', href: '/registrations', icon: Users },
  { title: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-card hidden md:block">
      <div className="h-16 flex items-center px-6 border-b">
        <span className="font-bold text-lg tracking-tight">DAFT Arena</span>
      </div>
      <nav className="p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
