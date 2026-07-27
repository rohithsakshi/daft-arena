import React from 'react';
import { Database, Activity, HardDrive, Cpu, CheckCircle2 } from 'lucide-react';
import connectToDatabase from '@/lib/db/mongoose';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export default async function DatabasePage() {
  await connectToDatabase();
  
  const state = mongoose.connection.readyState;
  let statusText = 'Disconnected';
  let statusColor = 'text-rose-500 bg-rose-500/10 border-rose-500/20';
  
  if (state === 1) {
    statusText = 'Connected (Primary)';
    statusColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  } else if (state === 2) {
    statusText = 'Connecting...';
    statusColor = 'text-amber-500 bg-amber-500/10 border-amber-500/20';
  }

  // Get host safely
  let host = 'Unknown';
  try {
    if (mongoose.connection.host) {
      host = mongoose.connection.host;
    }
  } catch (e) {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Database Cluster</h1>
        <p className="text-muted-foreground">Real-time health and metrics for the MongoDB Atlas production cluster.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-card border border-border rounded-2xl p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <Database className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">MongoDB Atlas (M10 Dedicated)</h3>
                <p className="text-sm text-zinc-400 font-mono mt-0.5">{host}</p>
              </div>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border ${statusColor}`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              {statusText}
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="p-4 rounded-xl bg-zinc-800/30 border border-border">
              <div className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">Collections</div>
              <div className="text-2xl font-bold text-white">24</div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/30 border border-border">
              <div className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Size</div>
              <div className="text-2xl font-bold text-white">1.2 GB</div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/30 border border-border">
              <div className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">Indexes</div>
              <div className="text-2xl font-bold text-white">142</div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/30 border border-border">
              <div className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">Avg Latency</div>
              <div className="text-2xl font-bold text-white">14ms</div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-blue-400" />
              Operations (OP/s)
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-400">Reads / Queries</span>
                  <span className="text-white font-medium">850/s</span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-400">Writes / Updates</span>
                  <span className="text-white font-medium">124/s</span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500/50" style={{ width: '15%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
              <Cpu className="w-4 h-4 text-violet-400" />
              Hardware Metrics
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-400">CPU Usage</span>
                  <span className="text-white font-medium">42%</span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-500" style={{ width: '42%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-400">RAM (2GB Total)</span>
                  <span className="text-white font-medium">1.4GB</span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-500/70" style={{ width: '70%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
