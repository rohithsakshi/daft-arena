import React from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, Building2, CreditCard, Shield, Users, 
  Settings, Database, Server, LogOut, HardDrive, Bell, Activity, Key
} from 'lucide-react';

export const metadata = {
  title: 'DAFT Labs | Super Admin Portal',
};

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

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/50 flex flex-col h-full shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <div className="flex items-center gap-2 text-rose-500">
            <Shield className="w-6 h-6" />
            <span className="font-bold tracking-tight text-white">DAFT Labs</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </div>

        <div className="p-4 border-t border-border">
          <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-colors">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Top Header */}
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-8">
          <h2 className="text-sm font-medium text-muted-foreground">Platform Administration</h2>
          <div className="flex items-center gap-4">
            <button className="text-muted-foreground hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-violet-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]"></div>
          </div>
        </header>
        
        <div className="p-8 pb-20 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
