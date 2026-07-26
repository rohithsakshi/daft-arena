// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { PaymentCard } from '@/modules/player/components/PaymentCard';
import { PlayerService } from '@/modules/player/services/player.client.service';
import { useRouter } from 'next/navigation';
import { EmptyState } from '@/components/shared/EmptyState';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface DraftData {
  tournamentId: string;
  selectedEvents: string[];
  partnerId?: string;
  docUrl?: string;
  baseFee: number;
  currency: string;
  totalAmount: number;
}

export function PaymentCheckoutClient({ tournamentId }: { tournamentId: string }) {
  const router = useRouter();
  const [draft, setDraft] = useState<DraftData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const raw = sessionStorage.getItem(`registration_draft_${tournamentId}`);
    if (raw) {
      try {
        setDraft(JSON.parse(raw));
      } catch (err) {
        console.error('Error parsing registration draft data', err);
      }
    }
    setIsLoading(false);
  }, [tournamentId]);

  const handlePaymentSubmit = async (
    method: 'CARD' | 'UPI' | 'NETBANKING',
    finalBreakdown: {
      baseAmount: number;
      discountAmount: number;
      taxAmount: number;
      totalAmount: number;
      couponCode?: string;
    }
  ) => {
    if (!draft) return;
    try {
      // 1. Submit Registration mock details
      const registration = await PlayerService.submitRegistration(
        draft.tournamentId,
        draft.selectedEvents,
        draft.partnerId,
        draft.docUrl
      );

      // 2. Submit payment and generate invoice/transaction mocks
      const { invoice, transaction } = await PlayerService.processPayment(
        registration.id,
        finalBreakdown.baseAmount,
        finalBreakdown.discountAmount,
        finalBreakdown.taxAmount,
        finalBreakdown.totalAmount,
        draft.currency,
        finalBreakdown.couponCode,
        method
      );

      // 3. Save confirmations in sessionStorage
      const receiptData = {
        registrationId: registration.id,
        invoice,
        transaction,
        playerName: 'Alex Johnson',
        playerId: 'PLR_12345'
      };
      sessionStorage.setItem(`registration_receipt_${tournamentId}`, JSON.stringify(receiptData));

      // Clean registration draft
      sessionStorage.removeItem(`registration_draft_${tournamentId}`);

      // 4. Navigate to success ticket pass page
      router.push(`/workspace/player/tournaments/${tournamentId}/register/success`);
    } catch (err) {
      console.error('Checkout flow failed', err);
      alert('Transaction failed. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="text-center text-xs text-muted-foreground py-10 animate-pulse">Loading draft metadata...</div>;
  }

  if (!draft) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Session Expired"
        description="We couldn't find any draft selection details. Please select your categories again."
        action={
          <Link
            href={`/workspace/player/tournaments/${tournamentId}/register`}
            className="inline-flex items-center gap-2 h-10 px-5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Start Over
          </Link>
        }
      />
    );
  }

  return (
    <PaymentCard
      baseFee={draft.totalAmount}
      currency={draft.currency}
      onPaymentSubmit={handlePaymentSubmit}
    />
  );
}
