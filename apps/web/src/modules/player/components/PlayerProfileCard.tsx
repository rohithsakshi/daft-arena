// @ts-nocheck
import React from 'react';
import { PlayerProfile } from '../types';
import { getInitials } from '../utils';
import { User, Medal, Trophy, Activity, MapPin, Mail, Phone, Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

import { WidgetContainer } from '@/components/shared/WidgetContainer';

interface PlayerProfileCardProps {
  profile: PlayerProfile;
  className?: string;
}

export function PlayerProfileCard({ profile, className }: PlayerProfileCardProps) {
  return (
    <WidgetContainer className={className}>
      {/* Hero banner */}
      <div className="h-36 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
        <div className="absolute top-4 right-4">
          <Button variant="secondary" size="sm"
            className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-md text-xs h-8">
            <Edit3 className="w-3.5 h-3.5 mr-1.5" />
            Edit Profile
          </Button>
        </div>
        {/* Avatar */}
        <div className="absolute -bottom-12 left-6">
          <div className="w-24 h-24 rounded-2xl bg-card border-4 border-background flex items-center justify-center shadow-2xl overflow-hidden">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.fullName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-violet-400 to-purple-500">
                {getInitials(profile.fullName)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="pt-16 pb-6 px-6">
        <div className="flex items-start justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-2xl font-extrabold text-foreground">{profile.fullName}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">ID: {profile.id}</p>
          </div>
          {/* Medals */}
          <div className="flex items-center gap-2 mt-1">
            {profile.medals.gold > 0 && (
              <span className="flex items-center gap-1 text-sm font-bold text-amber-400">
                <Medal className="w-4 h-4" />{profile.medals.gold}
              </span>
            )}
            {profile.medals.silver > 0 && (
              <span className="flex items-center gap-1 text-sm font-bold text-slate-300">
                <Medal className="w-4 h-4" />{profile.medals.silver}
              </span>
            )}
            {profile.medals.bronze > 0 && (
              <span className="flex items-center gap-1 text-sm font-bold text-amber-700">
                <Medal className="w-4 h-4" />{profile.medals.bronze}
              </span>
            )}
          </div>
        </div>

        {/* Contact info */}
        {(profile.city || profile.email || profile.phone) && (
          <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
            {profile.city && (
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-violet-400/70" />
                <span>{[profile.city, profile.state, profile.country].filter(Boolean).join(', ')}</span>
              </div>
            )}
            {profile.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-violet-400/70" />
                <span>{profile.email}</span>
              </div>
            )}
            {profile.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-violet-400/70" />
                <span>{profile.phone}</span>
              </div>
            )}
          </div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
              <Activity className="w-3 h-3" /> Win Ratio
            </span>
            <span className="text-2xl font-black text-emerald-400">{profile.stats.winRatio}%</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
              <Trophy className="w-3 h-3" /> Matches
            </span>
            <span className="text-2xl font-black text-foreground">
              {profile.stats.matchesWon}
              <span className="text-sm font-normal text-muted-foreground">/{profile.stats.matchesPlayed}</span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
              <Medal className="w-3 h-3 text-amber-400" /> Titles
            </span>
            <span className="text-2xl font-black text-amber-400">{profile.stats.tournamentsWon}</span>
          </div>
        </div>
      </div>
    </WidgetContainer>
  );
}
