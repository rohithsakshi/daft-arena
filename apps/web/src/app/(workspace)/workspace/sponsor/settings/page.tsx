// @ts-nocheck
import React from 'react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Settings, Save } from 'lucide-react';
import { WidgetContainer } from '@/components/shared/WidgetContainer';

export const metadata = {
  title: 'Sponsor Settings | DAFT Arena',
  description: 'Manage company profile, billing, contacts, and notifications.',
};

export default function SettingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 max-w-6xl">
      <SectionHeader
        title="Sponsor Settings"
        description="Manage company profile, billing, contacts, and notifications."
        icon={Settings}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-2">
          <button className="w-full text-left px-4 py-2.5 rounded-lg bg-violet-500/10 text-violet-400 font-medium">Company Profile</button>
          <button className="w-full text-left px-4 py-2.5 rounded-lg text-muted-foreground hover:bg-white/5 transition-colors">Billing & Payments</button>
          <button className="w-full text-left px-4 py-2.5 rounded-lg text-muted-foreground hover:bg-white/5 transition-colors">Team Members</button>
          <button className="w-full text-left px-4 py-2.5 rounded-lg text-muted-foreground hover:bg-white/5 transition-colors">Notifications</button>
        </div>
        
        <div className="md:col-span-2 space-y-6">
          <WidgetContainer className="p-6">
            <h3 className="text-lg font-bold mb-4">Company Profile</h3>
            
            <div className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Company Name</label>
                <input type="text" className="h-10 px-3 rounded-md bg-background/50 border border-white/10" defaultValue="DAFT Labs" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Industry</label>
                <select className="h-10 px-3 rounded-md bg-background/50 border border-white/10 text-sm">
                  <option>Sports Technology</option>
                  <option>Apparel</option>
                  <option>Beverages</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Brand Description</label>
                <textarea className="min-h-[100px] p-3 rounded-md bg-background/50 border border-white/10" defaultValue="The ultimate tournament management system." />
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-border flex justify-end">
              <button className="flex items-center gap-2 px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors text-sm font-medium">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </WidgetContainer>
        </div>
      </div>
    </div>
  );
}
