import React from 'react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Search, MapPin, Calendar, Users, ArrowRight } from 'lucide-react';
import { WidgetContainer } from '@/components/shared/WidgetContainer';

export const metadata = {
  title: 'Sponsorship Opportunities | DAFT Arena',
  description: 'Discover and compare available tournament sponsorship packages.',
};

const OPPORTUNITIES = [
  {
    name: 'National Pickleball League',
    location: 'Austin, TX',
    date: 'Sep 12 - Sep 15, 2026',
    reach: '15,000+',
    packages: ['Title ($10k)', 'Court ($2k)'],
    image: 'bg-indigo-500'
  },
  {
    name: 'West Coast Badminton Open',
    location: 'San Jose, CA',
    date: 'Oct 01 - Oct 03, 2026',
    reach: '8,000+',
    packages: ['Apparel ($5k)', 'Shuttlecock ($1k)'],
    image: 'bg-emerald-500'
  },
  {
    name: 'Miami Tennis Classic',
    location: 'Miami, FL',
    date: 'Nov 20 - Nov 22, 2026',
    reach: '25,000+',
    packages: ['Title ($25k)', 'Hydration ($3k)'],
    image: 'bg-blue-500'
  }
];

export default function OpportunitiesPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 max-w-6xl">
      <SectionHeader
        title="Sponsorship Opportunities"
        description="Discover tournaments actively seeking brand partners."
        icon={Search}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {OPPORTUNITIES.map((opp, i) => (
          <WidgetContainer key={i} className="overflow-hidden flex flex-col hover:border-violet-500/50 transition-colors">
            <div className={`h-32 w-full ${opp.image} bg-opacity-20 flex items-center justify-center relative`}>
               <div className={`absolute inset-0 bg-gradient-to-t from-background to-transparent`} />
               <h3 className="relative z-10 font-bold text-lg text-white px-4 text-center leading-tight">
                 {opp.name}
               </h3>
            </div>
            <div className="p-5 flex-1 flex flex-col space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-xs text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 mr-2 text-violet-400" /> {opp.location}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5 mr-2 text-violet-400" /> {opp.date}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Users className="w-3.5 h-3.5 mr-2 text-violet-400" /> Expected Reach: <span className="font-semibold text-foreground ml-1">{opp.reach}</span>
                </div>
              </div>
              
              <div className="pt-4 mt-auto border-t border-border">
                <p className="text-xs font-semibold mb-2">Available Packages</p>
                <div className="flex flex-wrap gap-2">
                  {opp.packages.map((pkg, j) => (
                    <span key={j} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-muted-foreground">
                      {pkg}
                    </span>
                  ))}
                </div>
              </div>

              <button className="w-full mt-4 flex items-center justify-center gap-2 py-2 bg-violet-600/20 hover:bg-violet-600/40 text-violet-300 rounded-lg text-sm transition-colors">
                View Details <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </WidgetContainer>
        ))}
      </div>
    </div>
  );
}
