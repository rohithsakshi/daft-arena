import React from 'react';
import Sidebar from '@/components/workspace/Sidebar';
import Header from '@/components/workspace/Header';
import { CommandPalette } from '@/components/navigation/CommandPalette';

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}
