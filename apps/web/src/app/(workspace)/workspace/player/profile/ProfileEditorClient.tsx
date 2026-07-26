// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { PlayerProfile } from '@/modules/player/types';
import { ProfileEditor } from '@/modules/player/components/ProfileEditor';
import { PlayerProfileCard } from '@/modules/player/components/PlayerProfileCard';
import { PlayerService } from '@/modules/player/services/player.client.service';
import { Trophy, Shield } from 'lucide-react';
import { WidgetContainer } from '@/components/shared/WidgetContainer';

export function ProfileEditorClient({ initialProfile, topRanking }: { initialProfile: PlayerProfile; topRanking: unknown }) {
  const [profile, setProfile] = useState<PlayerProfile>(initialProfile);

  const handleSave = async (updatedData: Partial<PlayerProfile>) => {
    try {
      const res = await PlayerService.saveProfile(profile.userId, updatedData);
      setProfile(res);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left sidebar info card */}
      <div className="lg:col-span-1 space-y-4">
        <PlayerProfileCard profile={profile} />

        {topRanking && (
          <WidgetContainer className="p-4 bg-violet-500/5 border-violet-500/20 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
              <Trophy className="w-5 h-5 text-violet-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Top Standing</p>
              <p className="text-sm font-bold text-foreground truncate">{topRanking.categoryName}</p>
              <p className="text-xs text-violet-400">District #{topRanking.districtRank}</p>
            </div>
          </WidgetContainer>
        )}
      </div>

      {/* Right form sections */}
      <div className="lg:col-span-2 space-y-6">
        <ProfileEditor profile={profile} onSave={handleSave} />
      </div>
    </div>
  );
}
