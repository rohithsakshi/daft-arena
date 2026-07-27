import React from 'react';
import { ToggleRight, Activity, Cloud, Zap, Shield, Smartphone } from 'lucide-react';

export default function FeaturesPage() {
  const flags = [
    {
      id: 'advanced_matchmaking',
      name: 'Advanced Matchmaking Engine',
      description: 'Enable the new Elo-based matchmaking algorithm for league brackets.',
      icon: Activity,
      enabled: true,
      category: 'Core System'
    },
    {
      id: 'upi_payments',
      name: 'UPI Payments Integration',
      description: 'Allow players to pay tournament registration fees directly via UPI gateways.',
      icon: Zap,
      enabled: true,
      category: 'Finance'
    },
    {
      id: 'sms_notifications',
      name: 'SMS Notifications',
      description: 'Send critical match updates and schedule changes via SMS to players.',
      icon: Smartphone,
      enabled: false,
      category: 'Notifications'
    },
    {
      id: 's3_storage_migration',
      name: 'Cloudinary to S3 Migration',
      description: 'Route all new media uploads to AWS S3 instead of Cloudinary CDN.',
      icon: Cloud,
      enabled: false,
      category: 'Infrastructure'
    },
    {
      id: 'strict_kyc',
      name: 'Strict KYC Verification',
      description: 'Require government ID uploads before organizations can be activated.',
      icon: Shield,
      enabled: false,
      category: 'Security'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Feature Flags</h1>
        <p className="text-muted-foreground">Manage platform capabilities, beta features, and gradual rollouts globally.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {flags.map((flag) => (
          <div key={flag.id} className="bg-card border border-border rounded-2xl p-6 flex items-start gap-4 hover:border-white/10 transition-colors">
            <div className={`p-3 rounded-xl shrink-0 ${flag.enabled ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-800 text-zinc-400'}`}>
              <flag.icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-lg font-bold text-white">{flag.name}</h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={flag.enabled} readOnly />
                  <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2 block">{flag.id}</span>
              <p className="text-sm text-zinc-400">{flag.description}</p>
              
              <div className="mt-4 inline-flex items-center px-2 py-1 bg-zinc-800/50 rounded text-xs text-zinc-400 font-medium">
                {flag.category}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
