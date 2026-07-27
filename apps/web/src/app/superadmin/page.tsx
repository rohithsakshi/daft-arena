import React from 'react';
import { 
  Building2, Users, Database, Server, Activity, ArrowUpRight, 
  CreditCard, HardDrive, Cpu, ShieldAlert, BadgeCheck, Timer, Trophy
} from 'lucide-react';

import connectToDatabase from '@/lib/db/mongoose';
import { TenantModel } from '@/modules/tenant/models/TenantModel';
import { UserModel } from '@/modules/iam/models/User';
import { LicenseModel } from '@/modules/tenant/models/LicenseModel';
import { TournamentModel } from '@/modules/tournaments/models/Tournament';
import { RegistrationModel } from '@/modules/tournaments/models/Registration';

export const dynamic = 'force-dynamic';

export default async function SuperAdminDashboard() {
  await connectToDatabase();
  
  const [orgCount, userCount, licenseCount, tournamentCount, registrationCount, sponsorCount] = await Promise.all([
    TenantModel.countDocuments({ status: 'ACTIVE' }).catch(() => 0),
    UserModel.countDocuments().catch(() => 0),
    LicenseModel.countDocuments({ isActive: true }).catch(() => 0),
    TournamentModel.countDocuments().catch(() => 0),
    RegistrationModel.countDocuments().catch(() => 0),
    UserModel.countDocuments({ systemRole: 'SPONSOR' }).catch(() => 0),
  ]);

  const metrics = [
    { label: 'Active Organizations', value: orgCount.toString(), trend: 'up', change: '+2', icon: Building2, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Active Licenses', value: licenseCount.toString(), trend: 'neutral', change: '0', icon: BadgeCheck, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { label: 'Platform Users', value: userCount.toString(), trend: 'up', change: '+124', icon: Users, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { label: 'Tournaments Created', value: tournamentCount.toString(), trend: 'up', change: '+15', icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Total Registrations', value: registrationCount.toString(), trend: 'up', change: '+450', icon: CreditCard, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Active Sponsors', value: sponsorCount.toString(), trend: 'neutral', change: '+1', icon: Building2, color: 'text-pink-500', bg: 'bg-pink-500/10' },
  ];

  const systems = [
    { name: 'MongoDB Cluster', status: 'Healthy', ping: '12ms', icon: Database },
    { name: 'Redis Cache', status: 'Healthy', ping: '2ms', icon: Cpu },
    { name: 'Cloudinary CDN', status: 'Optimal', usage: '45%', icon: HardDrive },
    { name: 'SMTP Gateway', status: 'Active', sent: '1.2k today', icon: Activity },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Platform Overview</h1>
        <p className="text-muted-foreground">Monitor DAFT Arena's multi-tenant ecosystem, infrastructure, and revenue.</p>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-6 hover:border-white/10 transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${metric.bg} ${metric.color}`}>
                <metric.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                metric.trend === 'up' ? 'text-emerald-400 bg-emerald-400/10' : 'text-zinc-400 bg-zinc-800'
              }`}>
                {metric.change}
                {metric.trend === 'up' && <ArrowUpRight className="w-3 h-3" />}
              </div>
            </div>
            <h3 className="text-zinc-400 text-sm font-medium">{metric.label}</h3>
            <p className="text-3xl font-bold text-white mt-1">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-violet-400" />
              Infrastructure Health
            </h3>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              All Systems Operational
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            {systems.map((sys, i) => (
              <div key={i} className="bg-background/50 border border-border rounded-xl p-4 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-zinc-800/50">
                  <sys.icon className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{sys.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs text-zinc-400">{sys.status} • {sys.ping || sys.usage || sys.sent}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Alerts */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            Security Alerts
          </h3>
          
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/10">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-rose-400">Failed Admin Logins</h4>
                  <p className="text-xs text-zinc-400 mt-1">3 failed attempts on /superadminlogin from IP 192.168.1.4</p>
                  <span className="text-[10px] text-zinc-500 mt-2 block">10 minutes ago</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
              <div className="flex items-start gap-3">
                <Timer className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-amber-400">License Expiring</h4>
                  <p className="text-xs text-zinc-400 mt-1">Organization 'Elite Tennis' trial expires in 48 hours.</p>
                  <span className="text-[10px] text-zinc-500 mt-2 block">2 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
