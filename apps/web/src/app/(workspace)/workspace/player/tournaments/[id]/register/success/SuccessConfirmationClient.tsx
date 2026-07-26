// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { TournamentDetail, QRPass, Invoice, Transaction } from '@/modules/player/types';
import { QRPassCard } from '@/modules/player/components/QRPassCard';
import { InvoiceCard } from '@/modules/player/components/InvoiceCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { DashboardGrid } from '@/components/shared/DashboardGrid';
import { WidgetContainer } from '@/components/shared/WidgetContainer';
import { formatTournamentDate } from '@/modules/player/utils';
import { AlertCircle, CheckCircle2, Ticket, Receipt, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface SuccessConfirmationClientProps {
  tournament: TournamentDetail;
}

interface ReceiptData {
  registrationId: string;
  invoice: Invoice;
  transaction: Transaction;
  playerName: string;
  playerId: string;
}

export function SuccessConfirmationClient({ tournament }: SuccessConfirmationClientProps) {
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const raw = sessionStorage.getItem(`registration_receipt_${tournament.id}`);
    if (raw) {
      try {
        setReceipt(JSON.parse(raw));
      } catch (err) {
        console.error('Error parsing registration receipt data', err);
      }
    }
    setIsLoading(false);
  }, [tournament.id]);

  if (isLoading) {
    return <div className="text-center text-xs text-muted-foreground py-10 animate-pulse">Retrieving confirmation codes...</div>;
  }

  if (!receipt) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Receipt Not Found"
        description="We couldn't locate active payment confirmation details in your session."
        action={
          <Link
            href="/workspace/player/tournaments"
            className="inline-flex items-center gap-2 h-10 px-5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Find Tournaments
          </Link>
        }
      />
    );
  }

  // Map event IDs back to their names
  const eventNames = receipt.invoice.registrationId
    ? tournament.events.map(e => e.name)
    : [];

  const mockPass: QRPass = {
    passId: `pass_${receipt.registrationId}`,
    registrationId: receipt.registrationId,
    playerName: receipt.playerName,
    playerId: receipt.playerId,
    tournamentTitle: tournament.title,
    venueName: tournament.venueName,
    venueAddress: tournament.venueAddress,
    events: eventNames,
    scheduleDates: formatTournamentDate(tournament.startDate, tournament.endDate),
    emergencyContact: {
      name: 'Jane Johnson',
      phone: '+1 (206) 555-0199'
    },
    qrCodeValue: `daft-pass://reg/${receipt.registrationId}`
  };

  return (
    <div className="space-y-8">
      {/* Visual Success Alert */}
      <WidgetContainer className="p-6 border-emerald-500/20 bg-emerald-500/5 max-w-4xl mx-auto flex items-start gap-4">
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
          <CheckCircle2 className="w-6 h-6 animate-bounce" />
        </div>
        <div className="space-y-2">
          <h3 className="text-base font-bold text-emerald-400">Payment Processed Successfully!</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Congratulations, your category selections are secured. Below is your sanctioned digital QR Ticket and transaction print receipt. Bring this ticket to gate verification to claim your player wristband.
          </p>
          <div className="flex pt-2">
            <Link
              href="/workspace/player/my-tournaments"
              className="text-xs font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
            >
              Go to My Tournaments <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </WidgetContainer>

      {/* Grid of Pass + Receipt */}
      <DashboardGrid cols="sidebar" className="max-w-4xl mx-auto">
        <div className="lg:col-span-2 space-y-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
            <Ticket className="w-4 h-4 text-violet-400" />
            Sanctioned Entry Pass
          </h4>
          <QRPassCard pass={mockPass} />
        </div>
        <div className="space-y-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
            <Receipt className="w-4 h-4 text-violet-400" />
            Receipt Details
          </h4>
          <InvoiceCard invoice={receipt.invoice} />
        </div>
      </DashboardGrid>
    </div>
  );
}
