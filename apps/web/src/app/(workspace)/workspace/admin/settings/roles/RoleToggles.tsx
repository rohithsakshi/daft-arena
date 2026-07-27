'use client';

import React, { useEffect, useState } from 'react';
import { Shield, ShieldAlert, Check, Loader2 } from 'lucide-react';

const ALL_ROLES = [
  { id: 'PLAYER', name: 'Player' },
  { id: 'ORGANIZER', name: 'Tournament Organizer' },
  { id: 'CLUB', name: 'Club Manager' },
  { id: 'ACADEMY', name: 'Academy' },
  { id: 'COACH', name: 'Coach' },
  { id: 'REFEREE', name: 'Referee' },
  { id: 'SPONSOR', name: 'Sponsor' },
  { id: 'DISTRICT_ASSOC', name: 'District Association' },
  { id: 'STATE_ASSOC', name: 'State Association' },
  { id: 'NATIONAL_FED', name: 'National Federation' },
  { id: 'ADMIN', name: 'Administrator' }
];

export function RoleToggles({ initialEnabled }: { initialEnabled: string[] }) {
  const [enabledRoles, setEnabledRoles] = useState<string[]>(initialEnabled);
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const toggleRole = async (roleId: string) => {
    setLoading(prev => ({ ...prev, [roleId]: true }));
    try {
      const isCurrentlyEnabled = enabledRoles.includes(roleId);
      const newRoles = isCurrentlyEnabled 
        ? enabledRoles.filter(r => r !== roleId)
        : [...enabledRoles, roleId];

      const res = await fetch('/api/settings/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabledRoles: newRoles })
      });

      if (res.ok) {
        const { data } = await res.json();
        setEnabledRoles(data);
      }
    } catch (error) {
      console.error('Failed to toggle role', error);
    } finally {
      setLoading(prev => ({ ...prev, [roleId]: false }));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {ALL_ROLES.map(role => {
        const isEnabled = enabledRoles.includes(role.id);
        const isLoading = loading[role.id];

        return (
          <div 
            key={role.id} 
            className={`p-6 rounded-xl border transition-all duration-300 flex items-center justify-between ${
              isEnabled 
                ? 'bg-emerald-500/10 border-emerald-500/30' 
                : 'bg-card border-border hover:border-violet-500/30'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isEnabled ? 'bg-emerald-500/20 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                {isEnabled ? <Check className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{role.name}</h3>
                <p className="text-xs text-muted-foreground">{role.id}</p>
              </div>
            </div>

            <button
              onClick={() => toggleRole(role.id)}
              disabled={isLoading}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 ${
                isEnabled ? 'bg-emerald-500' : 'bg-muted-foreground/30'
              }`}
            >
              <span className="sr-only">Toggle {role.name}</span>
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
              {isLoading && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-3 h-3 text-white animate-spin" />
                </span>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}
