import React from 'react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { LayoutDashboard, BarChart3, Target, Coins, TrendingUp, Handshake, Eye } from 'lucide-react';
import { WidgetContainer } from '@/components/shared/WidgetContainer';
import connectToDatabase from '@/lib/db/mongoose';
import { UserModel } from '@/modules/iam/models/User';
import { headers } from 'next/headers';

export const metadata = {
  title: 'Sponsor Dashboard | DAFT Arena',
  description: 'Central hub for KPIs, active campaigns, and ROI overview.',
};

export const dynamic = 'force-dynamic';

export default async function SponsorDashboardPage() {
  await connectToDatabase();
  
  const headersList = await headers();
  const userId = headersList.get('x-user-id');
  const user = await UserModel.findById(userId);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 max-w-6xl">
      <SectionHeader
        title={`Welcome, ${user?.name || 'Partner'}`}
        description="Monitor your active campaigns, sponsorships, and platform ROI."
        icon={LayoutDashboard}
        titleSize="xl"
      />

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <WidgetContainer className="p-6 border-indigo-500/20 bg-indigo-500/5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-indigo-400/80">Active Campaigns</p>
              <h4 className="text-2xl font-bold text-indigo-400">3</h4>
            </div>
          </div>
        </WidgetContainer>

        <WidgetContainer className="p-6 border-blue-500/20 bg-blue-500/5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-blue-400/80">Total Impressions</p>
              <h4 className="text-2xl font-bold text-blue-400">124.5K</h4>
            </div>
          </div>
        </WidgetContainer>

        <WidgetContainer className="p-6 border-emerald-500/20 bg-emerald-500/5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-emerald-400/80">Engagement Rate</p>
              <h4 className="text-2xl font-bold text-emerald-400">4.8%</h4>
            </div>
          </div>
        </WidgetContainer>

        <WidgetContainer className="p-6 border-amber-500/20 bg-amber-500/5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-amber-400/80">Spent this Month</p>
              <h4 className="text-2xl font-bold text-amber-400">₹45,000</h4>
            </div>
          </div>
        </WidgetContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Sponsorships */}
        <WidgetContainer className="p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <Handshake className="w-5 h-5 text-violet-400" />
            <h3 className="text-lg font-bold">Active Sponsorships</h3>
          </div>
          
          <div className="space-y-4 flex-1">
            {[
              { name: 'Summer Smash 2026', type: 'Title Sponsor', status: 'Live' },
              { name: 'National Pickleball League', type: 'Court Sponsor', status: 'Upcoming' },
            ].map((tourney, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-white/5 hover:border-violet-500/30 transition-colors">
                <div>
                  <h4 className="font-semibold text-sm">{tourney.name}</h4>
                  <p className="text-xs text-muted-foreground">{tourney.type}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  tourney.status === 'Live' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                }`}>
                  {tourney.status}
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 bg-white/5 hover:bg-white/10 text-sm font-medium rounded-lg transition-colors text-foreground">
            View All Sponsorships
          </button>
        </WidgetContainer>

        {/* Quick Actions */}
        <WidgetContainer className="p-12 text-center flex flex-col items-center justify-center border-dashed bg-card/10">
          <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center mb-4">
            <BarChart3 className="w-8 h-8 text-violet-400 opacity-80" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">Grow Your Brand</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-8">
            Discover new tournaments looking for sponsors or launch a targeted ad campaign across the DAFT Arena network.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl transition-colors text-sm">
              Explore Opportunities
            </button>
            <button className="px-6 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium rounded-xl transition-colors text-sm">
              New Campaign
            </button>
          </div>
        </WidgetContainer>
      </div>
    </div>
  );
}
