import React from 'react';
import Link from 'next/link';
import { 
  User, 
  Trophy, 
  Shield, 
  GraduationCap, 
  Presentation, 
  Flag, 
  Handshake, 
  MapPin, 
  Map, 
  Globe, 
  Settings 
} from 'lucide-react';
import { selectRoleAction } from './actions';

const ROLES = [
  {
    id: 'PLAYER',
    title: 'Player',
    description: 'Compete in tournaments, track stats, and manage your profile.',
    icon: User,
    features: ['Match History', 'Rankings', 'Digital ID'],
    color: 'text-blue-500',
    bg: 'bg-blue-500/10'
  },
  {
    id: 'ORGANIZER',
    title: 'Tournament Organizer',
    description: 'Host, manage, and execute professional tournaments.',
    icon: Trophy,
    features: ['Draws & Brackets', 'Scheduling', 'Check-ins'],
    color: 'text-violet-500',
    bg: 'bg-violet-500/10'
  },
  {
    id: 'CLUB',
    title: 'Club',
    description: 'Manage teams, players, and internal events.',
    icon: Shield,
    features: ['Roster Management', 'Analytics', 'Finance'],
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10'
  },
  {
    id: 'ACADEMY',
    title: 'Academy',
    description: 'Train players and manage coaching programs.',
    icon: GraduationCap,
    features: ['Programs', 'Certifications', 'Progress Tracking'],
    color: 'text-amber-500',
    bg: 'bg-amber-500/10'
  },
  {
    id: 'COACH',
    title: 'Coach',
    description: 'Guide players and manage training schedules.',
    icon: Presentation,
    features: ['Training Plans', 'Player Stats', 'Schedules'],
    color: 'text-orange-500',
    bg: 'bg-orange-500/10'
  },
  {
    id: 'REFEREE',
    title: 'Referee',
    description: 'Officiate matches and record official scores.',
    icon: Flag,
    features: ['Live Scoring', 'Match Reports', 'Assignments'],
    color: 'text-red-500',
    bg: 'bg-red-500/10'
  },
  {
    id: 'SPONSOR',
    title: 'Sponsor',
    description: 'Discover opportunities and manage brand campaigns.',
    icon: Handshake,
    features: ['Campaigns', 'ROI Analytics', 'Contracts'],
    color: 'text-pink-500',
    bg: 'bg-pink-500/10'
  },
  {
    id: 'DISTRICT_ASSOC',
    title: 'District Association',
    description: 'Govern sports at the district level.',
    icon: MapPin,
    features: ['District Rankings', 'Compliance', 'Clubs'],
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10'
  },
  {
    id: 'STATE_ASSOC',
    title: 'State Association',
    description: 'Oversee districts and state-level tournaments.',
    icon: Map,
    features: ['State Rankings', 'Affiliations', 'Reports'],
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10'
  },
  {
    id: 'NATIONAL_FED',
    title: 'National Federation',
    description: 'Top-level governance for the entire sport.',
    icon: Globe,
    features: ['National DB', 'Policies', 'Revenue'],
    color: 'text-teal-500',
    bg: 'bg-teal-500/10'
  },
  {
    id: 'ADMIN',
    title: 'Administrator',
    description: 'System administration and platform support.',
    icon: Settings,
    features: ['System Settings', 'User Management', 'Audit Logs'],
    color: 'text-slate-500',
    bg: 'bg-slate-500/10'
  }
];

export default function RolesPage() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden py-24 px-6 md:px-12">
      {/* Background Ornaments */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-violet-900/20 to-transparent -z-10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            Choose Your Experience
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select the role that best describes you to personalize your DAFT Arena experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ROLES.map((role) => {
            const Icon = role.icon;
            return (
              <form key={role.id} action={selectRoleAction.bind(null, role.id)} className="h-full">
                <button 
                  type="submit" 
                  className="w-full text-left h-full bg-card/50 backdrop-blur-md border border-border/50 hover:border-violet-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,58,237,0.1)] hover:-translate-y-1 flex flex-col group cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${role.bg} ${role.color} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{role.title}</h3>
                  <p className="text-sm text-muted-foreground mb-6 flex-grow">{role.description}</p>
                  
                  <div className="space-y-2 mt-auto">
                    {role.features.map((feature, i) => (
                      <div key={i} className="flex items-center text-xs text-muted-foreground">
                        <div className="w-1 h-1 rounded-full bg-violet-500 mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </button>
              </form>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-violet-500 font-semibold hover:text-violet-400 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
