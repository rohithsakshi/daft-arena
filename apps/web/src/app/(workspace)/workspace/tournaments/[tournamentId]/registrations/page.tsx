// @ts-nocheck
'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Search, CheckCircle2, XCircle, MessageSquare, Eye } from 'lucide-react';

export default function RegistrationsQueuePage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const id = params.tournamentId as string;
  const [selected, setSelected] = React.useState<any>(null);
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');

  const { data, isLoading } = useQuery({
    queryKey: ['tournament-registrations', id, filter],
    queryFn: async () => {
      const res = await fetch(`/api/tournaments/${id}/registrations?status=${filter === 'All' ? '' : filter}`);
      if (!res.ok) throw new Error('Failed to fetch registrations');
      return res.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ regId, status, paymentStatus, notes }: any) => {
      const res = await fetch(`/api/tournaments/${id}/registrations/${regId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, paymentStatus, notes }),
      });
      if (!res.ok) throw new Error('Failed to update registration');
      return res.json();
    },
    onSuccess: (_, vars) => {
      toast.success(`Registration ${vars.status}`);
      queryClient.invalidateQueries({ queryKey: ['tournament-registrations', id] });
      queryClient.invalidateQueries({ queryKey: ['tournament-stats', id] });
      setSelected(null);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const registrations: any[] = (data?.data || []).filter((r: any) => {
    if (!search) return true;
    const participants = r.participantIds || [];
    return participants.some((p: any) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase())
    );
  });

  const statusColor: any = {
    Pending: 'secondary',
    Approved: 'default',
    Rejected: 'destructive',
    Waitlisted: 'secondary',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Registration Queue</h2>
        <p className="text-muted-foreground">Review payment proofs and manage registrations.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle>Registrations</CardTitle>
              <CardDescription>{registrations.length} entries</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
                <Input
                  className="pl-9 w-64"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-1">
                {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((f) => (
                  <Button
                    key={f}
                    size="sm"
                    variant={filter === f ? 'default' : 'outline'}
                    onClick={() => setFilter(f)}
                  >
                    {f}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
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
                <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">Loading...</TableCell></TableRow>
              ) : registrations.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">No registrations found.</TableCell></TableRow>
              ) : registrations.map((reg: any) => (
                <TableRow key={reg._id}>
                  <TableCell>
                    {(reg.participantIds || []).map((p: any) => (
                      <div key={p._id || p}>
                        <p className="font-medium text-sm">{p.name || 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground">{p.email}</p>
                      </div>
                    ))}
                  </TableCell>
                  <TableCell className="text-sm">{reg.eventId?.name || '—'}</TableCell>
                  <TableCell>
                    <Badge variant={statusColor[reg.status] || 'secondary'}>{reg.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={reg.paymentStatus === 'Paid' ? 'default' : 'secondary'}>
                      {reg.paymentStatus || 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{reg.paymentUtr || '—'}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {reg.createdAt ? format(new Date(reg.createdAt), 'PP') : '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelected(reg)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Review Registration</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Participant</p>
                  <p className="font-medium">{selected.participantIds?.[0]?.name || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Event</p>
                  <p className="font-medium">{selected.eventId?.name || '—'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">UTR / Transaction ID</p>
                  <p className="font-mono font-medium">{selected.paymentUtr || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Current Status</p>
                  <Badge variant={statusColor[selected.status] || 'secondary'}>{selected.status}</Badge>
                </div>
              </div>

              {/* Payment Proof Screenshot */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Payment Screenshot</p>
                {selected.paymentProofUrl ? (
                  <img
                    src={selected.paymentProofUrl}
                    alt="Payment proof"
                    className="w-full max-h-64 object-contain rounded-lg border border-white/10 bg-white/5"
                  />
                ) : (
                  <div className="h-24 flex items-center justify-center border border-dashed border-white/20 rounded-lg text-muted-foreground text-sm">
                    No screenshot uploaded
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2 border-t border-white/10">
                <Button
                  className="flex-1"
                  onClick={() => updateMutation.mutate({
                    regId: selected._id,
                    status: 'Approved',
                    paymentStatus: 'Paid',
                  })}
                  disabled={updateMutation.isPending || selected.status === 'Approved'}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Approve & Mark Paid
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => updateMutation.mutate({
                    regId: selected._id,
                    status: 'Rejected',
                    paymentStatus: 'Failed',
                    notes: 'Payment could not be verified.',
                  })}
                  disabled={updateMutation.isPending || selected.status === 'Rejected'}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
