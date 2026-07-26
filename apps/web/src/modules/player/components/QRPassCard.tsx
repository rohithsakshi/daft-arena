// @ts-nocheck
'use client';

import React from 'react';
import { QRPass } from '../types';
import { WidgetContainer } from '@/components/shared/WidgetContainer';
import { Button } from '@/components/ui/button';
import { QrCode, Download, Share2, MapPin, Calendar, User, Phone, ShieldCheck, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QRPassCardProps {
  pass: QRPass;
  className?: string;
}

export function QRPassCard({ pass, className }: QRPassCardProps) {
  const handleDownload = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${pass.tournamentTitle} Entry Pass`,
        text: `Check out my entry ticket for ${pass.tournamentTitle}!`,
        url: window.location.href,
      }).catch(err => console.error(err));
    } else {
      alert(`Copied link to clipboard: ${window.location.href}`);
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      <WidgetContainer className="p-6 md:p-8 bg-gradient-to-b from-card/60 via-card/40 to-background/40 max-w-md mx-auto border-violet-500/20 overflow-hidden relative shadow-2xl">
        {/* Decorative corner indicators */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-violet-500/40 rounded-tl-xl" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-violet-500/40 rounded-tr-xl" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-violet-500/40 rounded-bl-xl" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-violet-500/40 rounded-br-xl" />

        {/* Brand */}
        <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-6">
          <div>
            <h4 className="text-sm font-black tracking-widest text-violet-400 uppercase">DAFT Arena</h4>
            <p className="text-[9px] text-muted-foreground uppercase">Sanctioned Entry Ticket</p>
          </div>
          <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
            CONFIRMED
          </span>
        </div>

        {/* QR Block */}
        <div className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl border border-white/5 mb-6">
          <div className="p-4 bg-white rounded-xl shadow-lg relative">
            {/* Custom styled mock QR Code */}
            <div className="w-40 h-40 bg-black flex items-center justify-center rounded">
              <QrCode className="w-36 h-36 text-white" />
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground uppercase mt-3 font-semibold tracking-wider">Pass ID: {pass.passId}</p>
        </div>

        {/* Pass Details */}
        <div className="space-y-4">
          <div>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">Tournament</p>
            <h3 className="font-extrabold text-base text-foreground leading-tight">{pass.tournamentTitle}</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
            <div>
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-0.5">Player Name</p>
              <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-violet-400" />
                {pass.playerName}
              </p>
            </div>
            <div>
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-0.5">Player ID</p>
              <p className="text-xs font-semibold text-foreground">{pass.playerId}</p>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/5 text-xs text-muted-foreground">
            <div className="flex items-start gap-2">
              <Calendar className="w-3.5 h-3.5 text-violet-400 mt-0.5 flex-shrink-0" />
              <span>{pass.scheduleDates}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-foreground font-semibold">{pass.venueName}</p>
                {pass.venueAddress && <p className="text-[10px] text-muted-foreground mt-0.5">{pass.venueAddress}</p>}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground">Emergency Contact</p>
                <p className="text-foreground font-semibold text-[11px]">{pass.emergencyContact.name} ({pass.emergencyContact.phone})</p>
              </div>
            </div>
          </div>

          {/* Registered Categories list */}
          <div className="pt-3 border-t border-white/5">
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1.5">Registered Categories</p>
            <div className="flex flex-wrap gap-1.5">
              {pass.events.map((evName, idx) => (
                <span
                  key={idx}
                  className="text-[10px] bg-white/5 border border-white/5 px-2 py-0.5 rounded text-foreground font-medium"
                >
                  {evName}
                </span>
              ))}
            </div>
          </div>
        </div>
      </WidgetContainer>

      {/* Stepper controls */}
      <div className="flex items-center justify-center gap-3">
        <Button
          variant="outline"
          onClick={handleDownload}
          className="border-white/10 text-xs gap-1.5 shadow-sm rounded-xl"
        >
          <Download className="w-4 h-4 text-violet-400" />
          Download Ticket PDF
        </Button>
        <Button
          variant="outline"
          onClick={handleShare}
          className="border-white/10 text-xs gap-1.5 shadow-sm rounded-xl"
        >
          <Share2 className="w-4 h-4 text-violet-400" />
          Share Ticket link
        </Button>
      </div>
    </div>
  );
}
