// @ts-nocheck
'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Search, CheckCircle2, XCircle, Eye, UserCheck, Users, AlertCircle } from 'lucide-react';

// ── helpers ──────────────────────────────────────────────────────────────────

function getParticipantName(p: any): string {
  if (!p) return 'Unknown Player';
  if (typeof p === 'string') return 'Unknown Player';
  return p.name?.trim() || p.email?.split('@')[0] || 'Unknown Player';
}

function getParticipantInitials(p: any): string {
  const name = getParticipantName(p);
  return name
    .split(' ')
    .slice(0, 2)
    .map((w: string) => w[0]?.toUpperCase() || '')
    .join('');
}

// ── types ─────────────────────────────────────────────────────────────────────

type FilterType = 'All' | 'Pending' | 'Approved' | 'Rejected';

// ── component ─────────────────────────────────────────────────────────────────

export default function RegistrationsQueuePage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const id = params.tournamentId as string;

  const [selected, setSelected] = React.useState<any>(null);
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState<FilterType>('All');
  const [checkedIds, setCheckedIds] = React.useState<Set<string>>(new Set());

  // ── fetch registrations ───────────────────────────────────────────────────

  const { data, isLoading } = useQuery({
    queryKey: ['tournament-registrations', id, filter],
    queryFn: async () => {
      const res = await fetch(
        `/api/tournaments/${id}/registrations?status=${filter === 'All' ? '' : filter}`,
      );
      if (!res.ok) throw new Error('Failed to fetch registrations');
      return res.json();
    },
  });

  // ── single update mutation ────────────────────────────────────────────────

  const updateMutation = useMutation({
    mutationFn: async ({ regId, status, paymentStatus, notes }: any) => {
      const res = await fetch(`/api/tournaments/${id}/registrations/${regId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, paymentStatus, notes }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to update registration');
      }
      return res.json();
    },
    onSuccess: (_, vars) => {
      toast.success(`Registration ${vars.status.toLowerCase()} successfully`);
      queryClient.invalidateQueries({ queryKey: ['tournament-registrations', id] });
      queryClient.invalidateQueries({ queryKey: ['tournament-stats', id] });
      setSelected(null);
    },
    onError: (e: any) => toast.error(e.message || 'Failed to update registration'),
  });

  // ── bulk action mutation ──────────────────────────────────────────────────

  const bulkMutation = useMutation({
    mutationFn: async ({ registrationIds, action }: { registrationIds: string[]; action: 'approve' | 'reject' }) => {
      const res = await fetch(`/api/tournaments/${id}/registrations/bulk-approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationIds, action }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Bulk action failed');
      }
      return res.json();
    },
    onSuccess: (data, vars) => {
      toast.success(
        `${data.succeeded} registration${data.succeeded !== 1 ? 's' : ''} ${vars.action}d successfully` +
          (data.failed > 0 ? ` (${data.failed} failed)` : ''),
      );
      setCheckedIds(new Set());
      queryClient.invalidateQueries({ queryKey: ['tournament-registrations', id] });
      queryClient.invalidateQueries({ queryKey: ['tournament-stats', id] });
    },
    onError: (e: any) => toast.error(e.message || 'Bulk action failed'),
  });

  // ── derived state ─────────────────────────────────────────────────────────

  const allRegistrations: any[] = data?.data || [];

  const registrations: any[] = allRegistrations.filter((r: any) => {
    if (!search) return true;
    const participants: any[] = r.participantIds || [];
    const q = search.toLowerCase();
    return participants.some(
      (p: any) =>
        getParticipantName(p).toLowerCase().includes(q) ||
        p.email?.toLowerCase().includes(q) ||
        p.phone?.toLowerCase().includes(q),
    );
  });

  const pendingRegistrations = registrations.filter((r) => r.status === 'Pending');
  const selectedCount = checkedIds.size;
  const allPendingSelected =
    pendingRegistrations.length > 0 &&
    pendingRegistrations.every((r) => checkedIds.has(r.id || r._id));

  // ── checkbox handlers ────────────────────────────────────────────────────

  const toggleCheck = (regId: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      next.has(regId) ? next.delete(regId) : next.add(regId);
      return next;
    });
  };

  const toggleAllPending = () => {
    if (allPendingSelected) {
      setCheckedIds(new Set());
    } else {
      setCheckedIds(new Set(pendingRegistrations.map((r) => r.id || r._id)));
    }
  };

  // Clear selections when filter changes
  React.useEffect(() => {
    setCheckedIds(new Set());
  }, [filter]);

  // ── status styling ────────────────────────────────────────────────────────

  const statusVariant: Record<string, any> = {
    Pending: 'secondary',
    Approved: 'default',
    Rejected: 'destructive',
    Waitlisted: 'secondary',
  };

  const statusCounts = React.useMemo(() => {
    return {
      All: allRegistrations.length,
      Pending: allRegistrations.filter((r) => r.status === 'Pending').length,
      Approved: allRegistrations.filter((r) => r.status === 'Approved').length,
      Rejected: allRegistrations.filter((r) => r.status === 'Rejected').length,
    };
  }, [allRegistrations]);

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Registration Queue</h2>
        <p className="text-muted-foreground">Review payment proofs and manage registrations.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-xl border p-3 text-left transition-all hover:border-primary/60 ${
              filter === s
                ? 'border-primary bg-primary/10 shadow-sm'
                : 'border-white/10 bg-white/5 hover:bg-white/8'
            }`}
          >
            <p className="text-xs text-muted-foreground font-medium">{s}</p>
            <p className="text-2xl font-bold mt-1">{statusCounts[s]}</p>
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle>Registrations</CardTitle>
              <CardDescription>
                {registrations.length} entr{registrations.length === 1 ? 'y' : 'ies'}
                {selectedCount > 0 && (
                  <span className="ml-2 text-primary font-semibold">
                    · {selectedCount} selected
                  </span>
                )}
              </CardDescription>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Bulk actions — only shown when checkboxes are selected */}
              {selectedCount > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30">
                  <span className="text-xs font-semibold text-primary">{selectedCount} selected</span>
                  <Button
                    size="sm"
                    variant="default"
                    className="h-7 text-xs gap-1"
                    disabled={bulkMutation.isPending}
                    onClick={() =>
                      bulkMutation.mutate({
                        registrationIds: Array.from(checkedIds),
                        action: 'approve',
                      })
                    }
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    Approve All
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-7 text-xs gap-1"
                    disabled={bulkMutation.isPending}
                    onClick={() =>
                      bulkMutation.mutate({
                        registrationIds: Array.from(checkedIds),
                        action: 'reject',
                      })
                    }
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Reject All
                  </Button>
                </div>
              )}

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
                <Input
                  className="pl-9 w-56"
                  placeholder="Search player..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto custom-scrollbar">
          <Table>
            <TableHeader>
              <TableRow>
                {/* Select all pending checkbox */}
                <TableHead className="w-10 pl-4">
                  {pendingRegistrations.length > 0 && (
                    <Checkbox
                      id="select-all-pending"
                      checked={allPendingSelected}
                      onCheckedChange={toggleAllPending}
                      aria-label="Select all pending registrations"
                    />
                  )}
                </TableHead>
                <TableHead>Participant</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>UTR</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      Loading registrations...
                    </div>
                  </TableCell>
                </TableRow>
              ) : registrations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    No registrations found.
                  </TableCell>
                </TableRow>
              ) : (
                registrations.map((reg: any) => {
                  const participants: any[] = reg.participantIds || [];
                  const isPending = reg.status === 'Pending';
                  const isChecked = checkedIds.has((reg.id || reg._id));
                  const primaryParticipant = participants[0];

                  return (
                    <TableRow
                      key={(reg.id || reg._id)}
                      className={isChecked ? 'bg-primary/5' : undefined}
                    >
                      {/* Checkbox — only enable for pending */}
                      <TableCell className="pl-4">
                        {isPending ? (
                          <Checkbox
                            id={`check-${(reg.id || reg._id)}`}
                            checked={isChecked}
                            onCheckedChange={() => toggleCheck((reg.id || reg._id))}
                            aria-label={`Select registration ${(reg.id || reg._id)}`}
                          />
                        ) : (
                          <span className="w-4 h-4 block" />
                        )}
                      </TableCell>

                      {/* Participant column */}
                      <TableCell>
                        <div className="flex items-start gap-2.5">
                          <Avatar className="w-8 h-8 shrink-0 mt-0.5">
                            <AvatarImage src={primaryParticipant?.avatar} />
                            <AvatarFallback className="text-[10px] font-bold bg-primary/20 text-primary">
                              {getParticipantInitials(primaryParticipant)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            {participants.length > 0 ? (
                              participants.map((p: any, idx: number) => (
                                <div key={(p?.id || p?._id) || `participant-${idx}`}>
                                  <p className="font-medium text-sm leading-tight">
                                    {getParticipantName(p)}
                                  </p>
                                  {p?.email && (
                                    <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                                      {p.email}
                                    </p>
                                  )}
                                  {p?.phone && (
                                    <p className="text-xs text-muted-foreground">{p.phone}</p>
                                  )}
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-muted-foreground italic">No participant data</p>
                            )}
                            {participants.length > 1 && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                                <Users className="w-3 h-3" />
                                {participants.length} players (doubles)
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="text-sm">{reg.eventId?.name || '—'}</TableCell>

                      <TableCell>
                        <Badge variant={statusVariant[reg.status] || 'secondary'}>
                          {reg.status}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <Badge variant={reg.paymentStatus === 'Paid' ? 'default' : 'secondary'}>
                          {reg.paymentStatus || 'Pending'}
                        </Badge>
                      </TableCell>

                      <TableCell className="font-mono text-xs">
                        {reg.paymentUtr || '—'}
                      </TableCell>

                      <TableCell className="text-xs text-muted-foreground">
                        {reg.createdAt ? format(new Date(reg.createdAt), 'dd MMM yyyy') : '—'}
                      </TableCell>

                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => setSelected(reg)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ── Review Dialog ───────────────────────────────────────────────────── */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Review Registration</DialogTitle>
          </DialogHeader>

          {selected && (() => {
            const participants: any[] = selected.participantIds || [];
            const primary = participants[0];
            return (
              <div className="space-y-4 py-2">
                {/* Participant info */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={primary?.avatar} />
                    <AvatarFallback className="text-sm font-bold bg-primary/20 text-primary">
                      {getParticipantInitials(primary)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-base leading-tight">
                      {getParticipantName(primary)}
                    </p>
                    {primary?.email && (
                      <p className="text-sm text-muted-foreground">{primary.email}</p>
                    )}
                    {primary?.phone && (
                      <p className="text-xs text-muted-foreground">{primary.phone}</p>
                    )}
                    {participants.length > 1 && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Partner: {getParticipantName(participants[1])}
                        {participants[1]?.email ? ` · ${participants[1].email}` : ''}
                      </p>
                    )}
                  </div>
                </div>

                {/* Detail grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Event</p>
                    <p className="font-medium">{selected.eventId?.name || '—'}</p>
                    {selected.eventId?.gender && (
                      <p className="text-xs text-muted-foreground capitalize">
                        {selected.eventId.gender} · {selected.eventId.eventType}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Current Status</p>
                    <Badge variant={statusVariant[selected.status] || 'secondary'}>
                      {selected.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">UTR / Transaction ID</p>
                    <p className="font-mono font-medium text-xs break-all">
                      {selected.paymentUtr || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Payment Status</p>
                    <Badge variant={selected.paymentStatus === 'Paid' ? 'default' : 'secondary'}>
                      {selected.paymentStatus || 'Pending'}
                    </Badge>
                  </div>
                  {selected.notes && (
                    <div className="col-span-2">
                      <p className="text-muted-foreground text-xs mb-1">Notes</p>
                      <p className="text-xs bg-white/5 rounded p-2 border border-white/10">
                        {selected.notes}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Submitted</p>
                    <p className="text-sm">
                      {selected.createdAt
                        ? format(new Date(selected.createdAt), 'dd MMM yyyy, hh:mm a')
                        : '—'}
                    </p>
                  </div>
                </div>

                {/* Payment Screenshot */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Payment Screenshot</p>
                  {selected.paymentProofUrl ? (
                    <a href={selected.paymentProofUrl} target="_blank" rel="noopener noreferrer">
                      <img
                        src={selected.paymentProofUrl}
                        alt="Payment proof"
                        className="w-full max-h-64 object-contain rounded-lg border border-white/10 bg-white/5 hover:opacity-90 transition-opacity cursor-zoom-in"
                      />
                    </a>
                  ) : (
                    <div className="h-24 flex items-center justify-center border border-dashed border-white/20 rounded-lg text-muted-foreground text-sm gap-2">
                      <AlertCircle className="w-4 h-4" />
                      No screenshot uploaded
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 pt-2 border-t border-white/10">
                  <Button
                    className="flex-1"
                    onClick={() =>
                      updateMutation.mutate({
                        regId: (selected.id || selected._id),
                        status: 'Approved',
                        paymentStatus: 'Paid',
                      })
                    }
                    disabled={updateMutation.isPending || selected.status === 'Approved'}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Approve & Mark Paid
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() =>
                      updateMutation.mutate({
                        regId: (selected.id || selected._id),
                        status: 'Rejected',
                        paymentStatus: 'Failed',
                        notes: 'Payment could not be verified.',
                      })
                    }
                    disabled={updateMutation.isPending || selected.status === 'Rejected'}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
