import React from 'react';
import { Shield, ShieldAlert, ShieldCheck, Info } from 'lucide-react';
import { SystemRoles } from '@/lib/roles';

export default function RolesPage() {
  const roles = [
    {
      id: SystemRoles.SUPERADMIN,
      name: 'Super Administrator',
      description: 'Platform owner with unrestricted access to all DAFT Labs infrastructure and tenant management.',
      type: 'platform',
      status: 'active'
    },
    {
      id: SystemRoles.TOURNAMENT_ADMIN,
      name: 'Tournament Admin',
      description: 'Customer organization owner. Manages tournaments, players, and sponsors within their tenant.',
      type: 'tenant',
      status: 'active'
    },
    {
      id: SystemRoles.PLAYER,
      name: 'Player',
      description: 'End-user interacting with tournaments. Can register, view brackets, and track progression.',
      type: 'user',
      status: 'active'
    },
    {
      id: SystemRoles.SPONSOR,
      name: 'Sponsor',
      description: 'Brand or organization sponsoring tournaments. Has access to analytics and ad placement tracking.',
      type: 'user',
      status: 'active'
    },
    {
      id: 'CLUB_MANAGER',
      name: 'Club Manager',
      description: 'Manages facilities, courts, and internal club rankings.',
      type: 'tenant',
      status: 'disabled'
    },
    {
      id: 'FEDERATION',
      name: 'Federation',
      description: 'Regional or national sports governing body. Manages official rankings and sanctions tournaments.',
      type: 'platform',
      status: 'disabled'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Role Management</h1>
        <p className="text-muted-foreground">Manage and configure system roles across the multi-tenant architecture.</p>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3 items-start">
        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-200">
          <strong>Note:</strong> Some roles are disabled per Phase 22.1 MVP requirements. You can toggle role availability for customer tenants below.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div key={role.id} className={`bg-card border rounded-2xl p-6 transition-all ${
            role.status === 'active' ? 'border-border hover:border-white/10' : 'border-border/50 opacity-60 grayscale'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${
                role.type === 'platform' ? 'bg-rose-500/10 text-rose-500' :
                role.type === 'tenant' ? 'bg-violet-500/10 text-violet-500' :
                'bg-emerald-500/10 text-emerald-500'
              }`}>
                {role.id === SystemRoles.SUPERADMIN ? <ShieldAlert className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={role.status === 'active'} readOnly />
                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
            
            <h3 className="text-lg font-bold text-white mb-1">{role.name}</h3>
            <div className="text-xs font-mono text-zinc-500 mb-3">{role.id}</div>
            <p className="text-sm text-zinc-400 line-clamp-3">
              {role.description}
            </p>
            
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Scope: {role.type}</span>
              {role.status === 'disabled' && (
                <span className="text-xs text-amber-500 font-medium">Coming Soon</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
