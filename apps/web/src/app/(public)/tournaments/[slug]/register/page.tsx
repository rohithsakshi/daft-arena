// @ts-nocheck
'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CloudinaryUploader } from '@/components/shared/CloudinaryUploader';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Trophy, QrCode, CreditCard, Upload, CheckCircle2 } from 'lucide-react';

export default function PublicRegistrationPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [selectedEventId, setSelectedEventId] = React.useState('');
  const [paymentUtr, setPaymentUtr] = React.useState('');
  const [paymentProofUrl, setPaymentProofUrl] = React.useState('');
  const [step, setStep] = React.useState<'event' | 'payment' | 'success'>('event');

  const { data: tournamentData, isLoading } = useQuery({
    queryKey: ['public-tournament', slug],
    queryFn: async () => {
      const res = await fetch(`/api/tournaments/slug/${slug}`);
      if (!res.ok) throw new Error('Tournament not found');
      return res.json();
    },
  });

  const { data: eventsData } = useQuery({
    queryKey: ['public-events', tournamentData?.data?._id],
    queryFn: async () => {
      const res = await fetch(`/api/tournaments/${tournamentData.data._id}/events`);
      if (!res.ok) return { data: [] };
      return res.json();
    },
    enabled: !!tournamentData?.data?._id,
  });

  const registerMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/tournaments/${tournamentData.data._id}/registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: selectedEventId,
          paymentUtr,
          paymentProofUrl,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Registration failed');
      }
      return res.json();
    },
    onSuccess: () => {
      setStep('success');
    },
    onError: (e: any) => toast.error(e.message),
  });

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full" />
    </div>
  );

  const tournament = tournamentData?.data;
  const events: any[] = eventsData?.data || [];

  if (!tournament) return (
    <div className="text-center py-24">
      <p className="text-muted-foreground">Tournament not found.</p>
    </div>
  );

  if (step === 'success') {
    return (
      <div className="max-w-lg mx-auto py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Registration Submitted!</h2>
          <p className="text-muted-foreground mt-2">
            Your registration is <strong>Pending Verification</strong>. The tournament admin will review your payment and approve your entry.
          </p>
        </div>
        <Button onClick={() => router.push('/workspace/player')}>
          Go to My Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-6">
      {/* Tournament Header */}
      <div className="space-y-2">
        {tournament.bannerUrl && (
          <img src={tournament.bannerUrl} alt="banner" className="w-full h-40 object-cover rounded-xl border border-white/10" />
        )}
        <div className="flex items-center gap-3 pt-2">
          {tournament.logoUrl && (
            <img src={tournament.logoUrl} alt="logo" className="w-12 h-12 rounded-lg border border-white/10 object-cover" />
          )}
          <div>
            <h1 className="text-2xl font-bold">{tournament.name}</h1>
            <p className="text-sm text-muted-foreground">{tournament.organizerName}</p>
          </div>
          <Badge className="ml-auto">{tournament.status}</Badge>
        </div>
        {tournament.description && (
          <p className="text-sm text-muted-foreground">{tournament.description}</p>
        )}
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>Registration closes: {format(new Date(tournament.registrationWindow.endDate), 'PP')}</span>
        </div>
      </div>

      {/* Step 1: Select Event */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" /> Choose Your Event
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground">No events available yet.</p>
          ) : events.map((ev: any) => (
            <div
              key={ev._id}
              onClick={() => setSelectedEventId(ev._id)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedEventId === ev._id
                  ? 'border-violet-500 bg-violet-500/10'
                  : 'border-white/10 hover:border-white/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{ev.name}</p>
                  <p className="text-xs text-muted-foreground">{ev.eventType} • {ev.gender} • {ev.ageCategory}</p>
                </div>
                {ev.entryFee > 0 && (
                  <Badge variant="outline">₹{ev.entryFee}</Badge>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Step 2: Payment */}
      {tournament.paymentConfiguration?.upiId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" /> Payment Details
            </CardTitle>
            <CardDescription>Pay via UPI and upload your screenshot to complete registration.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Payment info */}
            <div className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">UPI ID</span>
                <span className="font-mono font-medium">{tournament.paymentConfiguration.upiId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Account Name</span>
                <span className="font-medium">{tournament.paymentConfiguration.accountName}</span>
              </div>
              {tournament.paymentConfiguration.instructions && (
                <p className="text-xs text-muted-foreground border-t border-white/10 pt-3">
                  {tournament.paymentConfiguration.instructions}
                </p>
              )}
            </div>

            {/* QR Code */}
            {tournament.paymentConfiguration.qrCodeUrl && (
              <div className="flex justify-center">
                <div className="text-center">
                  <img
                    src={tournament.paymentConfiguration.qrCodeUrl}
                    alt="Payment QR"
                    className="w-48 h-48 object-contain bg-white rounded-lg p-2 mx-auto"
                  />
                  <p className="text-xs text-muted-foreground mt-2">Scan to pay</p>
                </div>
              </div>
            )}

            {/* UTR Input */}
            <div className="space-y-2">
              <Label>UTR / Transaction ID *</Label>
              <Input
                placeholder="Enter 12-digit UTR number"
                value={paymentUtr}
                onChange={(e) => setPaymentUtr(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Find the UTR in your bank app after payment.</p>
            </div>

            {/* Screenshot Upload */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Upload className="w-4 h-4" /> Upload Payment Screenshot *
              </Label>
              <CloudinaryUploader
                folder="payments"
                value={paymentProofUrl}
                onChange={setPaymentProofUrl}
                label="Click to upload payment screenshot"
                aspectRatio="free"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit */}
      <Button
        className="w-full"
        size="lg"
        disabled={!selectedEventId || registerMutation.isPending || (tournament.paymentConfiguration?.upiId && (!paymentUtr || !paymentProofUrl))}
        onClick={() => registerMutation.mutate()}
      >
        {registerMutation.isPending ? 'Submitting...' : 'Submit Registration'}
      </Button>
      <p className="text-xs text-center text-muted-foreground">
        Your registration will be reviewed by the admin. You&apos;ll receive a notification once approved.
      </p>
    </div>
  );
}
