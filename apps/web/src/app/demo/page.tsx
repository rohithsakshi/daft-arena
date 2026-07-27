import React from 'react';
import Link from 'next/link';
import {
  User, Trophy, Handshake, Shield, GraduationCap, Settings, ArrowRight, Play
} from 'lucide-react';

export const metadata = {
  title: 'Demo Mode — DAFT Arena',
  description: 'Explore DAFT Arena with a demo account. No sign-up required.',
};

const DEMO_ROLES = [
  {
    id: 'player',
    title: 'Player',
    description: 'Experience the player dashboard, browse tournaments, check rankings, and view match history.',
    icon: User,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    href: '/workspace/player',
    features: ['Tournament browser', 'Match history', 'Rankings', 'Digital ID'],
  },
  {
    id: 'organizer',
    title: 'Tournament Organizer',
    description: 'Create and manage tournaments, draws, courts, schedules, and results.',
    icon: Trophy,
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    href: '/workspace/tournaments',
    features: ['Tournament creation', 'Brackets & draws', 'Court management', 'Live scoring'],
  },
  {
    id: 'sponsor',
    title: 'Sponsor',
    description: 'Browse sponsorship opportunities, manage campaigns, and view ROI analytics.',
    icon: Handshake,
    color: 'text-pink-500',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
    href: '/workspace/sponsor',
    features: ['Campaign management', 'ROI analytics', 'Brand assets', 'Contracts'],
  },
  {
    id: 'admin',
    title: 'Administrator',
    description: 'Full platform control — users, finance, settings, and system configuration.',
    icon: Settings,
    color: 'text-slate-500',
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/20',
    href: '/workspace/admin',
    features: ['User management', 'Financial reports', 'System settings', 'Audit logs'],
  },
  {
    id: 'club',
    title: 'Club Manager',
    description: 'Manage club roster, track player development, and handle finances.',
    icon: Shield,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    href: '/workspace/organizations/demo-club',
    features: ['Roster management', 'Club analytics', 'Finance', 'Events'],
  },
  {
    id: 'federation',
    title: 'Federation',
    description: 'Govern the sport, manage national rankings, approve tournaments, and issue licenses.',
    icon: GraduationCap,
    color: 'text-teal-500',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/20',
    href: '/workspace/federation/national',
    features: ['National rankings', 'License issuance', 'Tournament approvals', 'Policy management'],
  },
];

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden py-24 px-6 md:px-12">
      {/* Background Ornaments */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-violet-900/20 to-transparent -z-10" />
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <Play className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400 tracking-wide">DEMO MODE — No sign-up required</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            Explore DAFT Arena
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose a role to explore that workspace with demo data. No account needed.
          </p>
        </div>

        {/* Role Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEMO_ROLES.map((role) => {
            const Icon = role.icon;
            return (
              <Link
                key={role.id}
                href={role.href}
                className={`group flex flex-col bg-card/50 backdrop-blur-md border ${role.border} hover:border-violet-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,58,237,0.1)] hover:-translate-y-1`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${role.bg} ${role.color} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{role.title}</h3>
                <p className="text-sm text-muted-foreground mb-6 flex-grow">{role.description}</p>

                <div className="space-y-2 mb-6">
                  {role.features.map((feature, i) => (
                    <div key={i} className="flex items-center text-xs text-muted-foreground">
                      <div className="w-1 h-1 rounded-full bg-violet-500 mr-2 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>

                <div className={`flex items-center gap-2 text-sm font-semibold ${role.color} group-hover:gap-3 transition-all`}>
                  Explore as {role.title}
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="mt-16 text-center p-8 rounded-2xl bg-card/50 border border-border/50">
          <h2 className="text-2xl font-bold text-foreground mb-2">Ready to get started?</h2>
          <p className="text-muted-foreground mb-6">
            Create your free account and join thousands of players and organizers on DAFT Arena.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/roles"
              className="inline-flex items-center gap-2 h-12 px-6 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              Create Free Account
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 h-12 px-6 border border-border hover:bg-muted text-foreground rounded-xl text-sm font-semibold transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
