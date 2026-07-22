'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Trophy, Shield, Medal } from 'lucide-react';

function CapabilitiesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'login'; // login or register

  const handleRoleSelect = (role: string) => {
    // Navigates to /login with the appropriate role, keeping the register tab if needed
    const tabParam = mode === 'register' ? 'tab=register&' : '';
    router.push(`/login?${tabParam}role=${role}`);
  };

  const roles = [
    { id: 'player', icon: Trophy, title: 'Player', description: 'Join tournaments and compete', color: 'text-purple-600', bg: 'bg-purple-100', hoverBg: 'group-hover:bg-purple-600' },
    { id: 'admin', icon: Shield, title: 'Administrator', description: 'Organize and manage tournaments', color: 'text-blue-600', bg: 'bg-blue-100', hoverBg: 'group-hover:bg-blue-600' },
    { id: 'sponsor', icon: Medal, title: 'Sponsor', description: 'Promote your brand and reach players', color: 'text-green-600', bg: 'bg-green-100', hoverBg: 'group-hover:bg-green-600' },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background gradients for aesthetics */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md z-10 flex flex-col rounded-2xl border border-border bg-card/50 backdrop-blur-xl shadow-2xl p-6 md:p-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
            Choose Your Role
          </h2>
          <p className="text-muted-foreground text-sm">
            Select how you want to use DAFT Arena
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => handleRoleSelect(role.id)}
              className="flex items-start text-left space-x-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className={`mt-0.5 p-3 rounded-xl transition-colors ${role.bg} ${role.color} ${role.hoverBg} group-hover:text-white`}>
                <role.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900">{role.title}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{role.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CapabilitiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CapabilitiesContent />
    </Suspense>
  );
}
