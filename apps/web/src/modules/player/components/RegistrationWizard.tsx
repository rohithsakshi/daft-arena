// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { TournamentDetail, TournamentEvent } from '../types';
import { PlayerService } from '../services/player.client.service';
import { Button } from '@/components/ui/button';
import { WidgetContainer } from '@/components/shared/WidgetContainer';
import { Check, User, Upload, ArrowRight, ArrowLeft, Search, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RegistrationWizardProps {
  tournament: TournamentDetail;
  onSubmit: (data: { selectedEvents: string[]; partnerId?: string; docUrl?: string }) => void;
  onCancel: () => void;
}

export function RegistrationWizard({ tournament, onSubmit, onCancel }: RegistrationWizardProps) {
  const [step, setStep] = useState(1);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [partnerQuery, setPartnerQuery] = useState('');
  const [partnerResults, setPartnerResults] = useState<{ id: string; fullName: string; city: string }[]>([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>('');
  const [selectedPartnerName, setSelectedPartnerName] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);
  const [uploadedDocName, setUploadedDocName] = useState('');
  const [eligibilityChecked, setEligibilityChecked] = useState(true);

  // Partner search trigger
  useEffect(() => {
    if (!partnerQuery) {
      setPartnerResults([]);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await PlayerService.searchPartners(partnerQuery);
        setPartnerResults(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [partnerQuery]);

  const handleEventToggle = (eventId: string) => {
    setSelectedEvents(prev =>
      prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedDocName(file.name);
    }
  };

  const totalFee = selectedEvents.reduce((sum, eventId) => {
    const ev = tournament.events.find(e => e.id === eventId);
    return sum + (ev?.entryFee ?? 0);
  }, 0);

  const hasDoublesSelected = selectedEvents.some(id => {
    const ev = tournament.events.find(e => e.id === id);
    return ev?.name.toLowerCase().includes('doubles');
  });

  const nextStep = () => {
    if (step === 1 && !hasDoublesSelected) {
      setStep(3); // Skip partner step
    } else {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (step === 3 && !hasDoublesSelected) {
      setStep(1); // Skip partner step
    } else {
      setStep(prev => prev - 1);
    }
  };

  return (
    <WidgetContainer className="p-6 max-w-2xl mx-auto">
      {/* Stepper Progress Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
        {[
          { label: 'Events', num: 1 },
          { label: 'Partner', num: 2, disabled: !hasDoublesSelected },
          { label: 'Documents', num: 3 },
          { label: 'Review', num: 4 }
        ].map((s, idx) => (
          <div key={idx} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2">
              <span className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors border",
                step === s.num
                  ? "bg-violet-600 border-violet-500 text-white"
                  : step > s.num
                  ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                  : "bg-white/5 border-white/10 text-muted-foreground"
              )}>
                {step > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
              </span>
              <span className={cn(
                "text-xs font-bold hidden sm:inline",
                step === s.num ? "text-foreground" : "text-muted-foreground"
              )}>
                {s.label}
              </span>
            </div>
            {idx < 3 && (
              <div className="flex-1 mx-4 h-px bg-white/5 hidden sm:block" />
            )}
          </div>
        ))}
      </div>

      {/* Stepper Content */}
      <div className="min-h-[250px] mb-8">
        {/* Step 1: Category Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-foreground mb-1">Select Events</h3>
              <p className="text-xs text-muted-foreground">Select the event categories you wish to participate in.</p>
            </div>
            <div className="space-y-3">
              {tournament.events.map((event) => (
                <div
                  key={event.id}
                  onClick={() => handleEventToggle(event.id)}
                  className={cn(
                    'p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between',
                    selectedEvents.includes(event.id)
                      ? 'border-violet-500 bg-violet-500/5'
                      : 'border-white/5 bg-black/20 hover:border-white/10'
                  )}
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">{event.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Fee: ${event.entryFee} · Limit: {event.maxParticipants} players
                    </p>
                  </div>
                  <div className={cn(
                    "w-5 h-5 rounded border flex items-center justify-center",
                    selectedEvents.includes(event.id)
                      ? "bg-violet-600 border-violet-500 text-white"
                      : "border-white/20"
                  )}>
                    {selectedEvents.includes(event.id) && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Doubles Partner Search */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-foreground mb-1">Doubles Partner</h3>
              <p className="text-xs text-muted-foreground">Search and select your partner by username, name or city.</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Type partner name..."
                value={partnerQuery}
                onChange={(e) => setPartnerQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-4 rounded-xl border border-white/10 bg-black/20 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              />
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {isSearching ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center py-4">
                  <Loader2 className="w-4 h-4 animate-spin text-violet-400" /> Searching...
                </div>
              ) : partnerResults.length > 0 ? (
                partnerResults.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedPartnerId(p.id);
                      setSelectedPartnerName(p.fullName);
                    }}
                    className={cn(
                      'p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between',
                      selectedPartnerId === p.id
                        ? 'border-violet-500 bg-violet-500/5'
                        : 'border-white/5 bg-black/10 hover:bg-white/5'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{p.fullName}</p>
                        <p className="text-[10px] text-muted-foreground">{p.city}</p>
                      </div>
                    </div>
                    {selectedPartnerId === p.id && <Check className="w-4 h-4 text-violet-400" />}
                  </div>
                ))
              ) : partnerQuery ? (
                <p className="text-center text-xs text-muted-foreground py-4">No matching partners found.</p>
              ) : null}
            </div>
            {selectedPartnerName && (
              <div className="p-3 bg-violet-600/10 border border-violet-500/20 text-xs text-violet-400 rounded-lg">
                Selected Partner: <span className="font-bold">{selectedPartnerName}</span>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Document Uploads */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-foreground mb-1">Verify Credentials</h3>
              <p className="text-xs text-muted-foreground">Upload your state board license or age declaration cert for eligibility checking.</p>
            </div>
            <div className="border border-dashed border-white/10 rounded-xl p-8 text-center bg-black/15">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground mb-1">Select credential files to upload</p>
              <p className="text-[10px] text-muted-foreground mb-4">Accepts PDF, PNG, JPG files up to 5MB</p>
              <input
                type="file"
                id="doc-upload"
                className="hidden"
                onChange={handleFileChange}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('doc-upload')?.click()}
                className="border-white/10 text-xs gap-1.5"
              >
                Choose File
              </Button>
            </div>
            {uploadedDocName && (
              <div className="flex items-center gap-2 p-3 bg-white/5 border border-white/5 rounded-lg text-xs text-foreground">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Uploaded: {uploadedDocName}</span>
              </div>
            )}
            <div className="flex items-center gap-2.5 pt-2">
              <input
                type="checkbox"
                id="eligibility"
                checked={eligibilityChecked}
                onChange={(e) => setEligibilityChecked(e.target.checked)}
                className="w-4 h-4 rounded border-white/10 bg-black text-violet-600"
              />
              <label htmlFor="eligibility" className="text-xs text-muted-foreground cursor-pointer">
                I declare that all uploaded credentials are valid and true.
              </label>
            </div>
          </div>
        )}

        {/* Step 4: Summary checkout overview */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-foreground mb-1">Confirm Registration details</h3>
              <p className="text-xs text-muted-foreground">Review your entry selection before proceeding to checkout.</p>
            </div>
            <div className="p-4 rounded-xl border border-white/5 bg-black/20 space-y-4">
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Event Selection</span>
                <span className="text-xs font-bold text-foreground">{selectedEvents.length} Selected</span>
              </div>
              <div className="space-y-2">
                {selectedEvents.map(eventId => {
                  const ev = tournament.events.find(e => e.id === eventId);
                  return (
                    <div key={eventId} className="flex justify-between text-xs">
                      <span className="text-foreground">{ev?.name}</span>
                      <span className="text-muted-foreground">${ev?.entryFee}</span>
                    </div>
                  );
                })}
              </div>
              {selectedPartnerName && (
                <div className="flex justify-between text-xs pt-3 border-t border-white/5">
                  <span className="text-muted-foreground">Partner</span>
                  <span className="text-foreground font-bold">{selectedPartnerName}</span>
                </div>
              )}
              {uploadedDocName && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Uploaded Documents</span>
                  <span className="text-foreground">{uploadedDocName}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-3 border-t border-white/8 font-bold">
                <span className="text-sm text-foreground">Total Entry Fee</span>
                <span className="text-lg text-violet-400">${totalFee}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Stepper Controls */}
      <div className="flex items-center justify-between border-t border-white/5 pt-4">
        <Button
          variant="ghost"
          onClick={step === 1 ? onCancel : prevStep}
          className="text-xs text-muted-foreground hover:text-foreground h-9"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          {step === 1 ? 'Cancel' : 'Back'}
        </Button>

        <Button
          onClick={step === 4 ? () => onSubmit({ selectedEvents, partnerId: selectedPartnerId, docUrl: uploadedDocName }) : nextStep}
          disabled={
            (step === 1 && selectedEvents.length === 0) ||
            (step === 2 && hasDoublesSelected && !selectedPartnerId) ||
            (step === 3 && (!uploadedDocName || !eligibilityChecked))
          }
          className="bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs h-9 px-4 rounded-xl gap-1 shadow-lg shadow-violet-500/20"
        >
          {step === 4 ? 'Confirm & Checkout' : 'Continue'}
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </div>
    </WidgetContainer>
  );
}
