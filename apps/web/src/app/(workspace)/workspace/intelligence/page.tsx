import React from 'react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { StatisticWidget } from '@/components/shared/StatisticWidget';
import { BrainCircuit, LineChart, Target, Zap } from 'lucide-react';

export default function BusinessIntelligencePage() {
  return (
    <div className="p-8 text-white space-y-8">
      <SectionHeader title="Business Intelligence & AI Platform" description="AI-powered insights, recommendations, and analytics for DAFT Arena." icon={BrainCircuit} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatisticWidget title="Insights Generated" value="1,204" icon={Zap} trend={{ value: 12, label: 'vs last month' }} />
        <StatisticWidget title="Schedule Conflicts Avoided" value="142" icon={Target} trend={{ value: 5, label: 'vs last month' }} />
        <StatisticWidget title="Revenue Forecast" value="$124k" icon={LineChart} trend={{ value: 8, label: 'projected growth' }} />
        <StatisticWidget title="AI Confidence Score" value="94%" icon={BrainCircuit} />
      </div>

      <div className="bg-card/20 backdrop-blur-md rounded-2xl border border-white/10 p-6 min-h-[400px]">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <BrainCircuit className="text-violet-400" />
          AI Assistant
        </h3>
        <div className="text-muted-foreground text-sm">
          Ask me anything about your tournaments, finances, or player stats...
        </div>
        {/* Chat Interface Placeholder */}
        <div className="mt-8 relative">
           <input type="text" placeholder="Ask AI..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500" />
           <button className="absolute right-2 top-2 bg-violet-600 hover:bg-violet-700 px-4 py-1.5 rounded-lg font-medium text-sm transition-colors">
             Send
           </button>
        </div>
      </div>
    </div>
  );
}
