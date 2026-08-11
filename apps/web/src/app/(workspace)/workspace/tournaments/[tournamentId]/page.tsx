// @ts-nocheck
'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TournamentService } from '@/services/tournament.service';
import { TournamentStatus } from '@/modules/core/enums';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { format } from 'date-fns';
import Link from 'next/link';
import { StatusBadgePicker } from '@/components/shared/StatusBadgePicker';
import {
  Users, Clock, CheckCircle2, XCircle, Trophy,
  QrCode, Settings, ExternalLink, BarChart3, CalendarDays
} from 'lucide-react';

const STATUS_ACTIONS: Record<string, { label: string; next: TournamentStatus; variant?: 'default' | 'outline' | 'destructive' }[]> = {
  [TournamentStatus.Draft]: [
    { label: 'Publish Tournament', next: TournamentStatus.Published },
  ],
  [TournamentStatus.Published]: [
    { label: 'Open Registration', next: TournamentStatus.RegistrationOpen },
    { label: 'Unpublish', next: TournamentStatus.Draft, variant: 'outline' },
  ],
  [TournamentStatus.RegistrationOpen]: [
    { label: 'Close Registration', next: TournamentStatus.RegistrationClosed },
  ],
  [TournamentStatus.RegistrationClosed]: [
    { label: 'Begin Seeding', next: TournamentStatus.Seeding },
  ],
  [TournamentStatus.Seeding]: [
    { label: 'Mark Live', next: TournamentStatus.Live },
  ],
  [TournamentStatus.Live]: [
    { label: 'Complete Tournament', next: TournamentStatus.Completed },
  ],
  [TournamentStatus.Completed]: [
    { label: 'Archive', next: TournamentStatus.Archived, variant: 'outline' },
  ],
};

const STATUS_COLOR: Record<string, string> = {
  Draft: 'secondary',
  Published: 'default',
  RegistrationOpen: 'default',
  RegistrationClosed: 'secondary',
  Seeding: 'secondary',
  Live: 'default',
  Completed: 'default',
  Archived: 'secondary',
};

export default function TournamentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = params.tournamentId as string;

  const { data, isLoading } = useQuery({
    queryKey: ['tournament', id],
    queryFn: () => TournamentService.getById(id),
  });

  const { data: statsData } = useQuery({
    queryKey: ['tournament-stats', id],
    queryFn: async () => {
      const res = await fetch(`/api/tournaments/${id}/stats`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!id,
  });

  const { data: eventsData } = useQuery({
    queryKey: ['tournament-events', id],
    queryFn: async () => {
      const res = await fetch(`/api/tournaments/${id}/events`);
      if (!res.ok) return { data: [] };
      return res.json();
    },
    enabled: !!id,
  });

  const statusMutation = useMutation({
    mutationFn: (nextStatus: TournamentStatus) =>
      TournamentService.changeStatus(id, nextStatus),
    onSuccess: (_, nextStatus) => {
      toast.success(`Status updated to ${nextStatus}`);
      queryClient.invalidateQueries({ queryKey: ['tournament', id] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update status');
    },
  });

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full" />
    </div>
  );

  if (!data?.data) return (
    <div className="text-center py-24 text-muted-foreground">
      Tournament not found.
    </div>
  );

  const tournament = data.data;
  const stats = statsData?.data;
  const events: any[] = eventsData?.data || [];
  const actions = STATUS_ACTIONS[tournament.status] || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            {tournament.logoUrl && (
              <img src={tournament.logoUrl} alt="logo" className="w-10 h-10 rounded-lg object-cover border border-white/10" />
            )}
            <div>
              <h2 className="text-3xl font-bold tracking-tight">{tournament.name}</h2>
              <p className="text-muted-foreground text-sm">/{tournament.slug}</p>
            </div>
            <StatusBadgePicker tournamentId={id} currentStatus={tournament.status} size="lg" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {actions.map((action) => (
            <Button
              key={action.next}
              variant={action.variant || 'default'}
              onClick={() => statusMutation.mutate(action.next)}
              disabled={statusMutation.isPending}
            >
              {statusMutation.isPending ? 'Updating...' : action.label}
            </Button>
          ))}
          <Link href={`/workspace/tournaments/${id}/edit`}>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" /> Edit
            </Button>
          </Link>
          <Link href={`/tournaments/${tournament.slug}`} target="_blank">
            <Button variant="outline" size="icon">
              <ExternalLink className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Banner */}
      {tournament.bannerUrl && (
        <div className="w-full h-40 rounded-xl overflow-hidden border border-white/10">
          <img src={tournament.bannerUrl} alt="banner" className="w-full h-full object-cover" />
        </div>
      )}

      {/* KPI Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Registrations', value: stats.total, icon: Users, color: 'text-violet-400' },
            { label: 'Pending Payments', value: stats.pending, icon: Clock, color: 'text-amber-400' },
            { label: 'Approved', value: stats.approved, icon: CheckCircle2, color: 'text-emerald-400' },
            { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'text-red-400' },
          ].map((kpi) => (
            <Card key={kpi.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-white/5 ${kpi.color}`}>
                  <kpi.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground">{kpi.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Details */}
        <Card>
          <CardHeader><CardTitle>Details</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              ['Organizer', tournament.organizerName],
              ['Timezone', tournament.timezone],
              ['Currency', tournament.currency],
              ['Visibility', tournament.visibility],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="font-medium text-muted-foreground">{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><CalendarDays className="w-4 h-4" />Schedule</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="font-medium text-muted-foreground">Registration Opens</span>
              <span>{format(new Date(tournament.registrationWindow.startDate), 'PPp')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-muted-foreground">Entry Fee</span>
              {tournament.isFreeEntry || !tournament.entryFee ? (
                <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded text-xs border border-emerald-500/20">Free Entry</span>
              ) : (
                <span className="font-bold text-foreground">{tournament.currency || 'INR'} {tournament.entryFee}</span>
              )}
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-muted-foreground">Registration Closes</span>
              <span>{format(new Date(tournament.registrationWindow.endDate), 'PPp')}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-muted-foreground">Tournament Starts</span>
              <span>{format(new Date(tournament.tournamentDates.startDate), 'PP')}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-muted-foreground">Tournament Ends</span>
              <span>{format(new Date(tournament.tournamentDates.endDate), 'PP')}</span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Configuration */}
        {tournament.paymentConfiguration?.upiId && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><QrCode className="w-4 h-4" />Payment Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">UPI ID</span>
                <span className="font-mono">{tournament.paymentConfiguration.upiId}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">Account Name</span>
                <span>{tournament.paymentConfiguration.accountName || 'N/A'}</span>
              </div>
              {tournament.paymentConfiguration.qrCodeUrl && (
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground mb-2">QR Code</p>
                  <img
                    src={tournament.paymentConfiguration.qrCodeUrl}
                    alt="Payment QR"
                    className="w-32 h-32 rounded-lg border border-white/10 object-contain bg-white/5"
                  />
                </div>
              )}
              {tournament.paymentConfiguration.instructions && (
                <p className="text-xs text-muted-foreground pt-2 border-t border-white/10">
                  {tournament.paymentConfiguration.instructions}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Quick Links */}
        <Card>
          <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: 'Registration Queue', href: `/workspace/tournaments/${id}/registrations`, icon: Users },
              { label: 'Manage Events', href: `/workspace/tournaments/${id}/events`, icon: Trophy },
              { label: 'Brackets & Draw', href: `/workspace/tournaments/${id}/brackets`, icon: BarChart3 },
              { label: 'Team Ties', href: `/workspace/tournaments/${id}/team-ties`, icon: Trophy },
              { label: 'Match Schedule', href: `/workspace/tournaments/${id}/matches`, icon: CalendarDays },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group"
              >
                <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-violet-400" />
                <span className="text-sm">{item.label}</span>
                <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground opacity-0 group-hover:opacity-100" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Events Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Events ({events.length})</CardTitle>
            <Link href={`/workspace/tournaments/${id}/events`}>
              <Button size="sm">
                Manage Events
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Trophy className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No events created yet.</p>
              <Link href={`/workspace/tournaments/${id}/events`}>
                <Button size="sm" className="mt-4">
                  Create First Event
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {events.map((ev: any) => (
                <div key={ev._id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div>
                    <p className="font-medium text-sm">{ev.name}</p>
                    <p className="text-xs text-muted-foreground">{ev.eventType} • {ev.gender} • {ev.ageCategory}</p>
                  </div>
                  <Badge variant="secondary">{ev.maxParticipants} max</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
