import React from 'react';
import { Activity, Server, Database, Globe, Cloud, CheckCircle2 } from 'lucide-react';

export default function HealthPage() {
  const services = [
    { name: 'Core API Services', status: 'Operational', uptime: '99.99%', icon: Server, color: 'text-emerald-400' },
    { name: 'MongoDB Database', status: 'Operational', uptime: '100%', icon: Database, color: 'text-emerald-400' },
    { name: 'Cloudinary CDN', status: 'Operational', uptime: '99.95%', icon: Cloud, color: 'text-emerald-400' },
    { name: 'Authentication (NextAuth)', status: 'Operational', uptime: '99.99%', icon: Globe, color: 'text-emerald-400' },
  ];

  const logs = [
    { time: '10:45 AM', service: 'Core API', message: 'Scale up event triggered. Added 2 instances.' },
    { time: '09:12 AM', service: 'MongoDB', message: 'Automated snapshot backup completed successfully.' },
    { time: '08:30 AM', service: 'Auth', message: 'Key rotation performed with zero downtime.' },
    { time: 'Yesterday', service: 'Cloudinary', message: 'CDN cache invalidated for tenant region EU.' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">System Health</h1>
        <p className="text-muted-foreground">Monitor platform uptime, service health, and system logs.</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500 rounded-full blur animate-pulse opacity-50"></div>
            <div className="relative p-3 bg-emerald-500 rounded-full border border-emerald-400">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">All Systems Operational</h2>
            <p className="text-emerald-400 font-medium mt-1">Global platform uptime: 99.99%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service, i) => (
            <div key={i} className="p-4 rounded-xl bg-zinc-800/30 border border-border flex items-center justify-between group hover:bg-zinc-800/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-zinc-800 rounded-lg">
                  <service.icon className="w-5 h-5 text-zinc-300" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">{service.name}</h4>
                  <div className="text-xs font-mono text-zinc-500 mt-0.5">Uptime: {service.uptime}</div>
                </div>
              </div>
              <span className="text-xs font-medium px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                {service.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-blue-400" />
          Recent System Events
        </h3>
        <div className="space-y-4">
          {logs.map((log, i) => (
            <div key={i} className="flex gap-4 p-3 rounded-lg hover:bg-zinc-800/30 transition-colors">
              <div className="text-xs font-mono text-zinc-500 shrink-0 mt-0.5 w-20">{log.time}</div>
              <div>
                <span className="inline-flex px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                  {log.service}
                </span>
                <p className="text-sm text-zinc-300">{log.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
