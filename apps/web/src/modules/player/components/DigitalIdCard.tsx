'use client';

import React, { useState } from 'react';
import { PlayerProfile } from '../types';
import { WidgetContainer } from '@/components/shared/WidgetContainer';
import { Button } from '@/components/ui/button';
import { QrCode, Download, Share2, Camera, Star, Award, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DigitalIdCardProps {
  profile: PlayerProfile;
  className?: string;
}

export function DigitalIdCard({ profile, className }: DigitalIdCardProps) {
  const [photo, setPhoto] = useState<string | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhoto(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const url = `${window.location.origin}/player/${profile.id}`;
    if (navigator.share) {
      navigator.share({
        title: `${profile.fullName} Public Player Profile`,
        url,
      }).catch(err => console.error(err));
    } else {
      navigator.clipboard.writeText(url);
      alert(`Profile link copied: ${url}`);
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      <WidgetContainer className="p-6 max-w-sm mx-auto bg-gradient-to-b from-violet-950/45 via-card/50 to-background/50 border-violet-500/25 shadow-2xl relative overflow-hidden rounded-3xl select-none print:shadow-none print:border-black">
        {/* Holographic header indicator */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-violet-600/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />

        {/* Brand visual header */}
        <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-6">
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-violet-400">DAFT Arena</h4>
            <p className="text-[8px] text-muted-foreground uppercase font-semibold">Competitor Membership Card</p>
          </div>
          <span className="px-2 py-0.5 text-[8px] font-bold rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-400">
            ACTIVE
          </span>
        </div>

        {/* Identity block */}
        <div className="flex gap-4 items-center mb-6">
          <div className="relative group">
            <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden relative shadow-md">
              {photo ? (
                <img src={photo} alt="Player avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <Camera className="w-6 h-6 text-muted-foreground/50" />
                  <span className="text-[8px] mt-1 font-bold uppercase tracking-wider text-muted-foreground/45">Photo</span>
                </div>
              )}
            </div>
            <label className="absolute -bottom-1 -right-1 p-1 bg-violet-600 hover:bg-violet-700 text-white rounded-lg border border-background shadow-md cursor-pointer transition-colors">
              <Camera className="w-3 h-3" />
              <input type="file" onChange={handlePhotoUpload} className="hidden" accept="image/*" />
            </label>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-extrabold text-base text-foreground leading-tight truncate">{profile.fullName}</h3>
            <p className="text-[10px] font-semibold text-violet-400 mt-1 uppercase font-mono tracking-wider">ID: {profile.id}</p>
            <p className="text-[9px] text-muted-foreground mt-0.5">{profile.clubName ?? 'Independent Player'}</p>
          </div>
        </div>

        {/* Details values */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-[10px] pb-4 border-b border-white/5 mb-4">
          <div>
            <p className="text-[8px] text-muted-foreground uppercase tracking-wider mb-0.5">District / State</p>
            <p className="font-semibold text-foreground truncate">{profile.city || '—'}, {profile.state || '—'}</p>
          </div>
          <div>
            <p className="text-[8px] text-muted-foreground uppercase tracking-wider mb-0.5">National Standing</p>
            <p className="font-bold text-emerald-400 flex items-center gap-0.5">
              <Star className="w-3 h-3 fill-emerald-500/20" />
              #145 Singles
            </p>
          </div>
          <div>
            <p className="text-[8px] text-muted-foreground uppercase tracking-wider mb-0.5">Emergency Mobile</p>
            <p className="font-semibold text-foreground truncate">{profile.emergencyContact?.phone || '—'}</p>
          </div>
          <div>
            <p className="text-[8px] text-muted-foreground uppercase tracking-wider mb-0.5">Blood Group</p>
            <p className="font-bold text-red-400 uppercase">{profile.medicalDetails?.bloodGroup || '—'}</p>
          </div>
        </div>

        {/* Barcode / Scan codes */}
        <div className="flex items-center justify-between gap-4 bg-black/20 rounded-2xl p-3 border border-white/5">
          <div className="text-[8px] text-muted-foreground leading-relaxed">
            <p className="font-bold uppercase text-foreground">Sanctioned QR Code</p>
            <p className="mt-0.5">Valid Until: Dec 31, 2026</p>
            <p className="text-[7px] text-muted-foreground/60 uppercase mt-2">Scan at registration counter</p>
          </div>
          <div className="p-1 bg-white rounded-lg flex-shrink-0">
            <QrCode className="w-12 h-12 text-black" />
          </div>
        </div>
      </WidgetContainer>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-3">
        <Button
          variant="outline"
          onClick={handlePrint}
          className="border-white/10 text-xs gap-1.5 shadow-sm rounded-xl"
        >
          <Download className="w-4 h-4 text-violet-400" />
          Download ID Card
        </Button>
        <Button
          variant="outline"
          onClick={handleShare}
          className="border-white/10 text-xs gap-1.5 shadow-sm rounded-xl"
        >
          <Share2 className="w-4 h-4 text-violet-400" />
          Share Profile Link
        </Button>
      </div>
    </div>
  );
}
