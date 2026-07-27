import React from 'react';
import { HardDrive, Image as ImageIcon, FileText, Video, Server } from 'lucide-react';

export default function StoragePage() {
  const totalStorage = 100; // GB
  const usedStorage = 42.5; // GB
  const percentage = (usedStorage / totalStorage) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Storage & Assets</h1>
        <p className="text-muted-foreground">Monitor Cloudinary CDN usage, media assets, and storage limits across all tenants.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Storage Overview */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <HardDrive className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Cloudinary Production Storage</h3>
              <p className="text-sm text-zinc-400">Total volume across all data centers.</p>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-end mb-2">
              <span className="text-3xl font-bold text-white">{usedStorage} <span className="text-lg text-zinc-400 font-normal">GB</span></span>
              <span className="text-sm font-medium text-zinc-500">of {totalStorage} GB allocated</span>
            </div>
            <div className="h-4 bg-zinc-800 rounded-full overflow-hidden flex">
              <div className="h-full bg-blue-500 rounded-l-full" style={{ width: '60%' }} title="Images"></div>
              <div className="h-full bg-emerald-500" style={{ width: '15%' }} title="Videos"></div>
              <div className="h-full bg-violet-500 rounded-r-full" style={{ width: '25%' }} title="Documents"></div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-zinc-800/30 border border-border flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-500 shrink-0"></div>
              <div>
                <div className="text-sm text-zinc-400">Images (Avatars/Logos)</div>
                <div className="font-bold text-white">25.5 GB</div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/30 border border-border flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 shrink-0"></div>
              <div>
                <div className="text-sm text-zinc-400">Videos (Highlights)</div>
                <div className="font-bold text-white">6.4 GB</div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/30 border border-border flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-violet-500 shrink-0"></div>
              <div>
                <div className="text-sm text-zinc-400">Docs (Licenses/KYC)</div>
                <div className="font-bold text-white">10.6 GB</div>
              </div>
            </div>
          </div>
        </div>

        {/* CDN Stats */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
            <Server className="w-5 h-5 text-emerald-400" />
            CDN Bandwidth
          </h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-400">This Month (Total)</span>
                <span className="text-white font-medium">1.2 TB / 5 TB</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: '24%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-400">Peak Daily Transfer</span>
                <span className="text-white font-medium">45 GB</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500/50" style={{ width: '45%' }}></div>
              </div>
            </div>

            <div className="pt-4 border-t border-border mt-4">
              <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Top Consumers (Tenants)</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-300">Elite Tennis Academy</span>
                  <span className="text-white font-medium">450 GB</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-300">Pro Badminton League</span>
                  <span className="text-white font-medium">320 GB</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-300">National Squash</span>
                  <span className="text-white font-medium">180 GB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
