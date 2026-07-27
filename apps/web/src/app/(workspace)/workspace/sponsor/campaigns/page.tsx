import React from 'react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { BarChart3, Plus, Play, Pause } from 'lucide-react';
import { WidgetContainer } from '@/components/shared/WidgetContainer';

export const metadata = {
  title: 'Campaigns | DAFT Arena Sponsor',
  description: 'Manage your active and upcoming ad campaigns.',
};

export default function CampaignsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 max-w-6xl">
      <div className="flex items-center justify-between">
        <SectionHeader
          title="Campaigns"
          description="Manage your active and upcoming ad campaigns."
          icon={BarChart3}
        />
        <button className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" /> New Campaign
        </button>
      </div>

      <div className="grid gap-6">
        <WidgetContainer className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold">Summer Smash 2026 Promo</h3>
              <p className="text-sm text-muted-foreground">Display Ads • Geo-targeted</p>
            </div>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Active
            </span>
          </div>
          
          <div className="grid grid-cols-4 gap-4 p-4 bg-background/50 rounded-xl border border-white/5">
            <div>
              <p className="text-xs text-muted-foreground">Impressions</p>
              <p className="text-xl font-bold">45.2K</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Clicks</p>
              <p className="text-xl font-bold">1,204</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">CTR</p>
              <p className="text-xl font-bold">2.6%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Spend</p>
              <p className="text-xl font-bold">₹12,400</p>
            </div>
          </div>
          
          <div className="mt-4 flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-sm font-medium rounded transition-colors text-muted-foreground">
              <Pause className="w-3.5 h-3.5" /> Pause
            </button>
            <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-sm font-medium rounded transition-colors">
              Edit Campaign
            </button>
          </div>
        </WidgetContainer>

        <WidgetContainer className="p-6 opacity-75">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-muted-foreground">Q3 Product Launch</h3>
              <p className="text-sm text-muted-foreground">Email Newsletter • Sponsored Content</p>
            </div>
            <span className="px-3 py-1 bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 rounded-full text-xs font-bold flex items-center gap-1.5">
              <Pause className="w-3 h-3" /> Paused
            </span>
          </div>
          
          <div className="mt-4 flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600/20 hover:bg-violet-600/40 text-violet-300 text-sm font-medium rounded transition-colors">
              <Play className="w-3.5 h-3.5" /> Resume
            </button>
          </div>
        </WidgetContainer>
      </div>
    </div>
  );
}
