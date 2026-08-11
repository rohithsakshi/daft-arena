import React from 'react';
import { Bell } from 'lucide-react';
import { SuperAdminSidebar } from './SuperAdminSidebar';

export const metadata = {
  title: 'DAFT Labs | Super Admin Portal',
};

export const dynamic = 'force-dynamic';

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <SuperAdminSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative pt-16 md:pt-0">
        {/* Top Header (Desktop only) */}
        <header className="hidden md:flex h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-10 items-center justify-between px-8">
          <h2 className="text-sm font-medium text-muted-foreground">Platform Administration</h2>
          <div className="flex items-center gap-4">
            <button className="text-muted-foreground hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-violet-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]"></div>
          </div>
        </header>
        
        <div className="p-4 md:p-8 pb-20 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
