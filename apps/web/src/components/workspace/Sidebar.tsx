'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Trophy, Calendar, Users, Home, Settings, MapPin, Search,
  User, Medal, Bell, CreditCard, Activity, LogOut, ChevronRight,
  Handshake, BarChart3, FileText, Shield, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  exact?: boolean;
  badge?: string;
}

const playerNavigation: NavItem[] = [
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

const organizerNavigation: NavItem[] = [
  { name: 'Tournaments', href: '/workspace/tournaments', icon: Trophy },
  { name: 'Operations', href: '/workspace/operations', icon: Activity },
  { name: 'Schedules', href: '/workspace/schedules', icon: Calendar },
  { name: 'Participants', href: '/workspace/participants', icon: Users },
  { name: 'Venues', href: '/workspace/venues', icon: MapPin },
  { name: 'Settings', href: '/workspace/settings', icon: Settings },
];

const sponsorNavigation: NavItem[] = [
  { name: 'Dashboard', href: '/workspace/sponsor', icon: Home, exact: true },
  { name: 'Opportunities', href: '/workspace/sponsor/opportunities', icon: Handshake },
  { name: 'Campaigns', href: '/workspace/sponsor/campaigns', icon: BarChart3 },
  { name: 'Analytics', href: '/workspace/sponsor/analytics', icon: BarChart3 },
  { name: 'Contracts', href: '/workspace/sponsor/contracts', icon: FileText },
  { name: 'Payments', href: '/workspace/sponsor/payments', icon: CreditCard },
  { name: 'Settings', href: '/workspace/sponsor/settings', icon: Settings },
];

const adminNavigation: NavItem[] = [
  { name: 'Dashboard', href: '/workspace/tournament-admin', icon: Home, exact: true },
  { name: 'Tournaments', href: '/workspace/tournaments', icon: Trophy },
  { name: 'Operations', href: '/workspace/operations', icon: Activity },
  { name: 'Organizations', href: '/workspace/organizations', icon: Shield },
  { name: 'Finance', href: '/workspace/finance', icon: CreditCard },
  { name: 'Settings', href: '/workspace/tournament-admin/settings', icon: Settings },
];

function getNavigation(role: string): NavItem[] {
  const r = role?.toUpperCase();
  if (r === 'PLAYER') return playerNavigation;
  if (r === 'SPONSOR') return sponsorNavigation;
  if (r === 'TOURNAMENT_ADMIN' || r === 'SUPERADMIN') return adminNavigation;
  return organizerNavigation;
}

function getRoleLabel(role: string): string {
  const r = role?.toUpperCase();
  if (r === 'PLAYER') return 'Competitor';
  if (r === 'SPONSOR') return 'Sponsor Partner';
  if (r === 'TOURNAMENT_ADMIN') return 'Administrator';
  if (r === 'SUPERADMIN') return 'Super Admin';
  if (r === 'ORGANIZER') return 'Tournament Organizer';
  if (r === 'FINANCE') return 'Finance Officer';
  return role || 'User';
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<{ name: string; email: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    document.addEventListener('toggle-mobile-menu', handleToggle);
    return () => document.removeEventListener('toggle-mobile-menu', handleToggle);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data) {
          setUserInfo(data.data);
        }
      })
      .catch(() => {
        // ignore
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const role = userInfo?.role || 'PLAYER';
  const navigation = getNavigation(role);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success('Logged out successfully');
      router.push('/roles?intent=login');
    } catch {
      toast.error('Logout failed. Please try again.');
      setIsLoggingOut(false);
    }
  };

  const initials = userInfo?.name
    ? userInfo.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : role[0]?.toUpperCase() || 'U';

  const NavContent = () => (
    <>
      <div className="h-16 flex items-center justify-between px-6 border-b border-border">
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
          DAFT Arena
        </span>
        <button onClick={() => setIsOpen(false)} className="md:hidden p-2 -mr-2 text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex items-center px-3 py-2.5 rounded-md animate-pulse">
              <div className="h-5 w-5 bg-zinc-800/60 rounded-md mr-3 shrink-0" />
              <div className="h-4 bg-zinc-800/60 rounded-md w-2/3" />
            </div>
          ))
        ) : (
          navigation.map((item) => {
            const isActive =
              'exact' in item && item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.name}
                {item.badge && (
                  <span className="ml-auto text-xs bg-destructive text-destructive-foreground rounded-full px-1.5 py-0.5">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })
        )}
      </nav>

      <div className="p-4 border-t border-border space-y-2">
        {loading ? (
          <div className="flex items-center gap-3 px-2 py-1.5 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-zinc-800/60 shrink-0" />
            <div className="flex-1 space-y-2 min-w-0">
              <div className="h-3 bg-zinc-800/60 rounded w-3/4" />
              <div className="h-2 bg-zinc-800/60 rounded w-1/2" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{userInfo?.name || 'User'}</p>
              <p className="text-xs text-muted-foreground truncate">{getRoleLabel(role)}</p>
            </div>
            <Link
              href={role.toUpperCase() === 'PLAYER' ? '/workspace/player/profile' : '/workspace/settings'}
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-md transition-colors"
        >
          <LogOut className="h-4 w-4" />
          {isLoggingOut ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>
    </>
  );

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-64 border-r border-border bg-card flex flex-col z-50 md:hidden"
            >
              <NavContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col shrink-0">
        <NavContent />
      </aside>
    </>
  );
}
