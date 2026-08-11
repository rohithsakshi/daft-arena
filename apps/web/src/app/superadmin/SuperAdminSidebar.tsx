'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Building2, CreditCard, Shield, Users, 
  Settings, Database, Server, LogOut, HardDrive, Bell, Activity, Key, Menu, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const navigation = [
  { name: 'Dashboard', href: '/superadmin', icon: LayoutDashboard },
  { name: 'Organizations', href: '/superadmin/organizations', icon: Building2 },
  { name: 'Subscriptions', href: '/superadmin/subscriptions', icon: CreditCard },
  { name: 'Users', href: '/superadmin/users', icon: Users },
  { name: 'Role Management', href: '/superadmin/roles', icon: Shield },
  { name: 'Feature Flags', href: '/superadmin/features', icon: Activity },
  { name: 'Storage', href: '/superadmin/storage', icon: HardDrive },
  { name: 'Database', href: '/superadmin/database', icon: Database },
  { name: 'System Health', href: '/superadmin/health', icon: Server },
  { name: 'API Keys', href: '/superadmin/api-keys', icon: Key },
  { name: 'Platform Settings', href: '/superadmin/settings', icon: Settings },
];

export function SuperAdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/roles?intent=login');
    } catch {
      setIsLoggingOut(false);
    }
  };

  const NavLinks = () => (
    <>
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/superadmin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-rose-500/10 text-rose-500" 
                  : "text-muted-foreground hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-border">
        <button 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          {isLoggingOut ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header Toggle */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-border bg-background/90 backdrop-blur-md z-40 flex items-center px-4">
        <button onClick={() => setIsOpen(true)} className="p-2 -ml-2 text-foreground">
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2 text-rose-500 ml-2">
          <Shield className="w-5 h-5" />
          <span className="font-bold tracking-tight text-white">DAFT Labs</span>
        </div>
      </div>

      {/* Mobile Drawer */}
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
              <div className="h-16 flex items-center justify-between px-6 border-b border-border">
                <div className="flex items-center gap-2 text-rose-500">
                  <Shield className="w-6 h-6" />
                  <span className="font-bold tracking-tight text-white">DAFT Labs</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 -mr-2 text-muted-foreground hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <NavLinks />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-border bg-card/50 flex-col h-full shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <div className="flex items-center gap-2 text-rose-500">
            <Shield className="w-6 h-6" />
            <span className="font-bold tracking-tight text-white">DAFT Labs</span>
          </div>
        </div>
        <NavLinks />
      </aside>
    </>
  );
}
