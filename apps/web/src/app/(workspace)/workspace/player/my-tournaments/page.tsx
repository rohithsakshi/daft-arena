'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { WidgetContainer } from '@/components/shared/WidgetContainer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/EmptyState';
import { Trophy, Search, ExternalLink, Clock, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';

const STATUS_ICON: Record<string, any> = {
  Approved: CheckCircle2,
  Pending: Clock,
  Rejected: XCircle,
};
const STATUS_COLOR: Record<string, string> = {
  Approved: 'text-emerald-400',
  Pending: 'text-amber-400',
  Rejected: 'text-red-400',
};

export default function MyTournamentsPage() {
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState('All');

  const { data, isLoading } = useQuery({
    queryKey: ['my-registrations'],
    queryFn: async () => {
      const res = await fetch('/api/player/registrations');
      if (!res.ok) return { data: [] };
      return res.json();
    },
  });

  const registrations: any[] = (data?.data || []).filter((r: any) => {
    const matchSearch = !search ||
      r.tournamentId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.eventId?.name?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || r.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex items-center justify-between">
        <SectionHeader
          title="My Tournaments"
          description="All your tournament registrations."
          icon={Trophy}
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search tournaments..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1">
          {['All', 'Pending', 'Approved', 'Rejected'].map(f => (
            <Button key={f} size="sm" variant={filter === f ? 'default' : 'outline'} onClick={() => setFilter(f)}>
              {f}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : registrations.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="No registrations yet"
          description="Browse available tournaments and register to participate."
          action={
            <Link
              href="/workspace/player/tournaments"
              className="inline-flex items-center gap-2 h-8 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/80 transition-colors"
            >
              <Search className="w-4 h-4" /> Find Tournaments
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {registrations.map((reg: any) => {
            const Icon = STATUS_ICON[reg.status] || Clock;
            const colorClass = STATUS_COLOR[reg.status] || 'text-muted-foreground';
            const tournament = reg.tournamentId;
            return (
              <WidgetContainer key={reg._id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-white/5 ${colorClass}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold">{tournament?.name || 'Unknown Tournament'}</p>
                      <p className="text-sm text-muted-foreground">{reg.eventId?.name || '—'}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span>Registered: {reg.createdAt ? format(new Date(reg.createdAt), 'PP') : '—'}</span>
                        {reg.paymentUtr && <span>UTR: {reg.paymentUtr}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={reg.status === 'Approved' ? 'default' : 'secondary'}>{reg.status}</Badge>
                    {tournament?.slug && (
                      <Link
                        href={`/workspace/player/tournaments/${String(reg.tournamentId?._id || reg.tournamentId?.id || '')}`}
                        target="_blank"
                        className="inline-flex items-center justify-center h-7 w-7 rounded-md hover:bg-muted transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>

                {reg.status === 'Pending' && (
                  <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-sm text-amber-300">
                    ⏳ Your payment screenshot is being reviewed. You'll be notified once approved.
                  </div>
                )}
                {reg.status === 'Rejected' && (
                  <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-300">
                    ❌ Your registration was rejected. {reg.notes && `Reason: ${reg.notes}`}
                  </div>
                )}
                {reg.status === 'Approved' && reg.paymentProofUrl && (
                  <div className="mt-3 text-xs text-emerald-400">
                    ✅ Payment verified. You are confirmed for this tournament.
                  </div>
                )}
              </WidgetContainer>
            );
          })}
        </div>
      )}
    </div>
  );
}
