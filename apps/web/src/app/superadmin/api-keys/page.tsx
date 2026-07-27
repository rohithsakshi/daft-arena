import React from 'react';
import { Key, Plus, Shield, Copy, Clock } from 'lucide-react';

export default function ApiKeysPage() {
  const keys = [
    { id: 'key_1', name: 'Production Integration', prefix: 'daft_live_x8F...', scope: 'Full Access', lastUsed: '2 hours ago', created: '2024-01-15' },
    { id: 'key_2', name: 'Stripe Webhook Sync', prefix: 'daft_test_m2A...', scope: 'Read Only', lastUsed: 'Just now', created: '2024-02-20' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">API Keys</h1>
          <p className="text-muted-foreground">Manage programmatic access tokens for the DAFT Arena API.</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-zinc-200 transition-colors">
          <Plus className="w-4 h-4" />
          Generate New Key
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-4 bg-zinc-900/50 border-b border-border flex items-center gap-3">
          <Shield className="w-5 h-5 text-amber-500" />
          <p className="text-sm text-zinc-300">Keep your API keys secure. Do not expose them in client-side code or public repositories.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-400 bg-zinc-900/20 uppercase border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Key Name</th>
                <th className="px-6 py-4 font-medium">Token Prefix</th>
                <th className="px-6 py-4 font-medium">Scope</th>
                <th className="px-6 py-4 font-medium">Last Used</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {keys.map((key) => (
                <tr key={key.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-zinc-800 rounded-lg">
                        <Key className="w-4 h-4 text-zinc-300" />
                      </div>
                      <span className="font-semibold text-white">{key.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded font-mono">
                      {key.prefix}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-zinc-800 text-zinc-300 text-xs rounded-full">
                      {key.scope}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-zinc-400">
                      <Clock className="w-3.5 h-3.5" />
                      {key.lastUsed}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-zinc-400 hover:text-white transition-colors" title="Revoke Key">
                      Revoke
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
