'use client';

import React, { useState } from 'react';
import { PlayerCertificate } from '../types';
import { WidgetContainer } from '@/components/shared/WidgetContainer';
import { Button } from '@/components/ui/button';
import { Trophy, Download, Share2, Award, Calendar, ShieldCheck, Printer } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CertificateViewerProps {
  certificates: PlayerCertificate[];
  className?: string;
}

export function CertificateViewer({ certificates, className }: CertificateViewerProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const activeCert = certificates[selectedIdx];

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert(`Downloading certificate "${activeCert?.tournamentTitle} - ${activeCert?.type}" as official PDF...`);
  };

  const handleShare = () => {
    const url = `${window.location.origin}/certificates/verify/${activeCert?.id}`;
    navigator.clipboard.writeText(url);
    alert(`Verified certificate check link copied to clipboard: ${url}`);
  };

  if (certificates.length === 0) {
    return (
      <WidgetContainer className="p-12 text-center flex flex-col items-center justify-center border-dashed bg-card/10">
        <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center mb-4">
          <Award className="w-8 h-8 text-violet-400 opacity-80" />
        </div>
        <h3 className="text-sm font-bold text-foreground mb-1">No Certificates Found</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          You have not been issued any official tournament certificates yet. Compete in sanctioned DAFT Arena events to earn accolades.
        </p>
      </WidgetContainer>
    );
  }

  return (
    <div className={cn('grid grid-cols-1 lg:grid-cols-3 gap-6', className)}>
      {/* Left List History Panel */}
      <div className="lg:col-span-1 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Certificate History</h4>
        <div className="space-y-2">
          {certificates.map((cert, idx) => {
            const isSelected = selectedIdx === idx;
            return (
              <div
                key={cert.id}
                onClick={() => setSelectedIdx(idx)}
                className={cn(
                  'p-3 rounded-xl border transition-all cursor-pointer flex gap-3 items-center',
                  isSelected
                    ? 'border-violet-500 bg-violet-500/5'
                    : 'border-white/5 bg-black/15 hover:border-white/10'
                )}
              >
                <div className={cn(
                  'p-2 rounded-lg border',
                  cert.type === 'WINNER' ? 'bg-amber-500/10 border-amber-500/25 text-amber-400' :
                  cert.type === 'RUNNER_UP' ? 'bg-slate-500/10 border-slate-500/25 text-slate-300' :
                  'bg-violet-500/10 border-violet-500/25 text-violet-400'
                )}>
                  {cert.type === 'WINNER' ? <Trophy className="w-4 h-4" /> : <Award className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">{cert.tournamentTitle}</p>
                  <p className="text-[10px] text-muted-foreground uppercase mt-0.5">{cert.type}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Preview Panel */}
      <div className="lg:col-span-2 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Visual Preview</h4>
        
        {/* Certificate visual mockup container */}
        <WidgetContainer className="p-8 md:p-12 border-2 border-double border-violet-500/30 bg-gradient-to-b from-card/30 to-background/30 rounded-3xl relative overflow-hidden text-center select-none print:border-black print:text-black print:bg-white shadow-2xl">
          {/* Certificate visual elements */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-emerald-500" />
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-black tracking-widest text-violet-400 uppercase">DAFT Arena</h3>
              <p className="text-[9px] text-muted-foreground uppercase font-semibold">Sanctioned Accolade Certificate</p>
            </div>

            <div className="py-2">
              <p className="text-xs font-serif italic text-muted-foreground">This certifies that</p>
              <h2 className="text-2xl font-black text-foreground mt-2 tracking-wide font-serif">{activeCert.recipientName}</h2>
              <div className="w-24 h-0.5 bg-violet-600/30 mx-auto mt-2" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <p className="text-xs text-muted-foreground leading-relaxed">
                has successfully achieved the rank of <span className="font-bold text-foreground uppercase">{activeCert.type}</span> in the
                <span className="font-bold text-foreground block mt-1 text-sm">{activeCert.tournamentTitle}</span>
              </p>
              {activeCert.description && (
                <p className="text-[11px] text-muted-foreground/80 italic mt-2">
                  "{activeCert.description}"
                </p>
              )}
            </div>

            {/* Verification & Signatures */}
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5 max-w-sm mx-auto text-left text-[9px] text-muted-foreground">
              <div>
                <p className="text-[8px] uppercase tracking-wider mb-1">Date Issued</p>
                <p className="font-semibold text-foreground flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-violet-400" />
                  {new Date(activeCert.issueDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[8px] uppercase tracking-wider mb-1">Verification Stamp</p>
                <p className="font-bold text-emerald-400 flex items-center justify-end gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  DAFT SECURE ID
                </p>
              </div>
            </div>
          </div>
        </WidgetContainer>

        {/* Certificate CTA buttons */}
        <div className="flex items-center gap-3 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="border-white/10 text-xs gap-1.5 shadow-sm rounded-xl"
          >
            <Share2 className="w-3.5 h-3.5 text-violet-400" />
            Share Certification URL
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="border-white/10 text-xs gap-1.5 shadow-sm rounded-xl"
          >
            <Printer className="w-3.5 h-3.5 text-violet-400" />
            Print
          </Button>
          <Button
            size="sm"
            onClick={handleDownload}
            className="bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs h-9 px-4 rounded-xl gap-1 shadow-lg shadow-violet-500/20"
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
