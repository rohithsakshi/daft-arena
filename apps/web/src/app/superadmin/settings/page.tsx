import React from 'react';
import { Settings, Globe, Mail, ShieldAlert, Save } from 'lucide-react';

export default function PlatformSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Platform Settings</h1>
          <p className="text-muted-foreground">Global configuration for DAFT Arena.</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-emerald-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-emerald-400 transition-colors">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
              <Globe className="w-5 h-5 text-zinc-400" />
              General Configuration
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Platform Name</label>
                <input type="text" defaultValue="DAFT Arena" className="w-full bg-zinc-900 border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-white/20 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Support Email</label>
                <input type="email" defaultValue="support@daftlabs.in" className="w-full bg-zinc-900 border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-white/20 transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Default Currency</label>
                  <select className="w-full bg-zinc-900 border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-white/20 transition-colors appearance-none">
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Timezone</label>
                  <select className="w-full bg-zinc-900 border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-white/20 transition-colors appearance-none">
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
              <Mail className="w-5 h-5 text-zinc-400" />
              SMTP Settings
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">SMTP Host</label>
                  <input type="text" defaultValue="smtp.gmail.com" className="w-full bg-zinc-900 border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-white/20 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Port</label>
                  <input type="text" defaultValue="465" className="w-full bg-zinc-900 border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-white/20 transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">SMTP Username</label>
                <input type="text" defaultValue="daftlabs.reply@gmail.com" className="w-full bg-zinc-900 border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-white/20 transition-colors" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 border-rose-500/20">
            <h3 className="text-lg font-bold text-rose-500 flex items-center gap-2 mb-4">
              <ShieldAlert className="w-5 h-5" />
              Danger Zone
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5">
                <h4 className="font-semibold text-white mb-1">Maintenance Mode</h4>
                <p className="text-xs text-zinc-400 mb-3">Disable access for all non-superadmin users globally.</p>
                <button className="bg-zinc-800 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-rose-500 hover:text-black transition-colors w-full">
                  Enable Maintenance
                </button>
              </div>
              
              <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5">
                <h4 className="font-semibold text-white mb-1">Purge Cache</h4>
                <p className="text-xs text-zinc-400 mb-3">Clear Redis cache and force all clients to fetch fresh data.</p>
                <button className="bg-zinc-800 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-rose-500 hover:text-black transition-colors w-full">
                  Purge Global Cache
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
