import React from 'react';
import { Shield, Trophy, Users, Flag, Building2, Medal } from 'lucide-react';

const roles = [
  { icon: Trophy, title: 'Player', description: 'Track your stats, matches, and progression' },
  { icon: Shield, title: 'Tournament Organizer', description: 'Run complex brackets and schedules effortlessly' },
  { icon: Building2, title: 'Club', description: 'Manage teams, rosters, and memberships' },
  { icon: Flag, title: 'Official', description: 'Input live scoring and manage match states' },
  { icon: Users, title: 'Association', description: 'Govern regional rankings and regulations' },
  { icon: Medal, title: 'Sponsor', description: 'Analyze reach and tournament demographics' },
];

export function RoleInfoCard() {
  return (
    <div className="h-full flex flex-col rounded-2xl border border-border bg-card/50 backdrop-blur-xl shadow-lg p-6 md:p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
          Built for Every Participant
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          The DAFT Arena unified workspace automatically adapts its tools, dashboards, and capabilities based on your verified credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 overflow-y-auto pr-2">
        {roles.map((role, idx) => (
          <div key={idx} className="flex items-start space-x-4 p-4 rounded-xl border border-white/5 bg-white/5 transition-colors hover:bg-white/10">
            <div className="mt-1 bg-primary/20 p-2 rounded-lg text-primary">
              <role.icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-foreground">{role.title}</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-snug">{role.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <span>Enterprise-grade RBAC</span>
        <span>Zero-trust architecture</span>
      </div>
    </div>
  );
}
