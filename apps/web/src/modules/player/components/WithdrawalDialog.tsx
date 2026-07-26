// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { WithdrawalRequest, PlayerTournament } from '../types';
import { WidgetContainer } from '@/components/shared/WidgetContainer';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Trash2, ArrowRight, History, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WithdrawalDialogProps {
  tournaments: PlayerTournament[];
  pastWithdrawals: WithdrawalRequest[];
  onSubmit: (data: { registrationId: string; tournamentTitle: string; reason: string; details?: string }) => Promise<WithdrawalRequest>;
  className?: string;
}

export function WithdrawalDialog({ tournaments, pastWithdrawals, onSubmit, className }: WithdrawalDialogProps) {
  const [selectedTourIdx, setSelectedTourIdx] = useState(0);
  const [reason, setReason] = useState('Schedule Conflict');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(pastWithdrawals);

  const activeTournament = tournaments[selectedTourIdx];

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTournament) return;

    const check = confirm(
      `CRITICAL WARNING:\nAre you sure you want to withdraw from "${activeTournament.title}"?\n\n` +
      `Your category entries will be voided. Refunds will be processed according to organization policy guidelines.`
    );
    if (!check) return;

    setIsSubmitting(true);
    try {
      const res = await onSubmit({
        registrationId: `reg_${activeTournament.id}`,
        tournamentTitle: activeTournament.title,
        reason,
        details
      });
      setWithdrawals(prev => [res, ...prev]);
      setDetails('');
      alert('Withdrawal request submitted successfully. The organization board will review your request.');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: WithdrawalRequest['status']) => {
    switch (status) {
      case 'REFUNDED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'APPROVED':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }
  };

  return (
    <div className={cn('grid grid-cols-1 lg:grid-cols-3 gap-8', className)}>
      {/* Left dialog request panel */}
      <form onSubmit={handleWithdrawSubmit} className="lg:col-span-2 space-y-6">
        <WidgetContainer className="p-6 space-y-5 border-red-500/20 bg-red-500/5">
          <h3 className="text-base font-bold text-red-400 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5" />
            Tournament Withdrawal Center
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Withdrawing from an active or pending tournament requires organizer review. Approved refunds will be credited back via original transaction methods.
          </p>

          {tournaments.length > 0 ? (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Select Active Tournament
              </label>
              <select
                value={selectedTourIdx}
                onChange={(e) => setSelectedTourIdx(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-xl border border-white/10 bg-black/25 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-red-500/50"
              >
                {tournaments.map((t, idx) => (
                  <option key={t.id} value={idx}>{t.title} ({t.status})</option>
                ))}
              </select>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">You are not registered in any upcoming or active tournaments.</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Primary Withdrawal Reason
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-white/10 bg-black/25 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-red-500/50"
              >
                {['Injury / Medical reasons', 'Schedule Conflict', 'Personal reasons', 'Partner Withdrew', 'Other'].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Additional Details (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Sprained ankle, conflict times..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-white/10 bg-black/25 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || tournaments.length === 0}
            className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg shadow-red-500/20 gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            Confirm Withdrawal & Request Refund
          </Button>
        </WidgetContainer>
      </form>

      {/* Right panel refund status tracking */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1.5">
          <History className="w-4 h-4 text-violet-400" />
          Withdrawal Requests Logs
        </h4>
        <div className="space-y-3">
          {withdrawals.length > 0 ? (
            withdrawals.map((req) => (
              <WidgetContainer key={req.id} className="p-4 space-y-3 border-white/5 bg-card/40">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h5 className="font-bold text-xs text-foreground truncate max-w-[140px]">{req.tournamentTitle}</h5>
                    <span className={cn('inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider mt-1 border', getStatusColor(req.status))}>
                      {req.status}
                    </span>
                  </div>
                  <span className="text-[9px] text-muted-foreground font-mono">
                    {new Date(req.requestedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div className="text-[10px] text-muted-foreground space-y-1">
                  <p>Reason: <span className="text-foreground font-semibold">{req.reason}</span></p>
                  {req.details && <p>Details: <span className="text-foreground">{req.details}</span></p>}
                </div>
              </WidgetContainer>
            ))
          ) : (
            <p className="text-center text-xs text-muted-foreground py-8">No previous withdrawals logged.</p>
          )}
        </div>
      </div>
    </div>
  );
}
