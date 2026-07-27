'use client';

import React, { useState } from 'react';
import { Shield, ShieldAlert, ShieldCheck, Info, Loader2 } from 'lucide-react';
import { SystemRoles } from '@/lib/roles';

type RoleItem = {
  id: string;
  name: string;
  description: string;
  type: string;
};

const ALL_ROLES: RoleItem[] = [
  {
    id: SystemRoles.SUPERADMIN,
    name: 'Super Administrator',
    description: 'Platform owner with unrestricted access to all DAFT Labs infrastructure and tenant management.',
    type: 'platform',
  },
  {
    id: SystemRoles.TOURNAMENT_ADMIN,
    name: 'Tournament Admin',
    description: 'Customer organization owner. Manages tournaments, players, and sponsors within their tenant.',
    type: 'tenant',
  },
  {
    id: SystemRoles.PLAYER,
    name: 'Player',
    description: 'End-user interacting with tournaments. Can register, view brackets, and track progression.',
    type: 'user',
  },
  {
    id: SystemRoles.SPONSOR,
    name: 'Sponsor',
    description: 'Brand or organization sponsoring tournaments. Has access to analytics and ad placement tracking.',
    type: 'user',
  },
  {
    id: 'CLUB_MANAGER',
    name: 'Club Manager',
    description: 'Manages facilities, courts, and internal club rankings.',
    type: 'tenant',
  },
  {
    id: 'FEDERATION',
    name: 'Federation',
    description: 'Regional or national sports governing body. Manages official rankings and sanctions tournaments.',
    type: 'platform',
  }
];

export default function RolesClient({ initialEnabledRoles }: { initialEnabledRoles: string[] }) {
  const [enabledRoles, setEnabledRoles] = useState<string[]>(initialEnabledRoles);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleRole = async (roleId: string) => {
    // Prevent disabling SUPERADMIN
    if (roleId === SystemRoles.SUPERADMIN) return;

    setLoading(true);
    setError('');
    const newRoles = enabledRoles.includes(roleId)
      ? enabledRoles.filter(r => r !== roleId)
      : [...enabledRoles, roleId];

    try {
      const res = await fetch('/api/superadmin/settings/roles', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabledRoles: newRoles })
      });

      if (!res.ok) throw new Error('Failed to update roles');
      
      setEnabledRoles(newRoles);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Role Management</h1>
        <p className="text-muted-foreground">Manage and configure system roles across the multi-tenant architecture.</p>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3 items-start">
        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-200">
          <strong>Note:</strong> Toggling a role instantly enables or disables it across the platform landing pages and authentication portals. Super Admin cannot be disabled.
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ALL_ROLES.map((role) => {
          // SUPERADMIN is inherently always active in our system, but we can treat it visually as enabled.
          const isActive = role.id === SystemRoles.SUPERADMIN ? true : enabledRoles.includes(role.id);
          const isSuperAdmin = role.id === SystemRoles.SUPERADMIN;

          return (
            <div key={role.id} className={`bg-card border rounded-2xl p-6 transition-all ${
              isActive ? 'border-border hover:border-white/10' : 'border-border/50 opacity-60 grayscale'
            } relative`}>
              
              {loading && <div className="absolute inset-0 bg-black/20 rounded-2xl z-10" />}

              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${
                  role.type === 'platform' ? 'bg-rose-500/10 text-rose-500' :
                  role.type === 'tenant' ? 'bg-violet-500/10 text-violet-500' :
                  'bg-emerald-500/10 text-emerald-500'
                }`}>
                  {isSuperAdmin ? <ShieldAlert className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
                </div>
                
                <label className={`relative inline-flex items-center ${isSuperAdmin ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={isActive} 
                    disabled={isSuperAdmin || loading}
                    onChange={() => toggleRole(role.id)}
                  />
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
                {!isActive && (
                  <span className="text-xs text-amber-500 font-medium">Disabled</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
