// @ts-nocheck
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TournamentService } from '@/services/tournament.service';
import { DataTable } from '@/components/shared/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { ITournament } from '@/modules/tournaments/models/Tournament';
import { buttonVariants } from '@/components/ui/button';
import { toast } from 'sonner';
import { Plus, GitBranch, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { StatusBadgePicker } from '@/components/shared/StatusBadgePicker';

function StatusCell({ tournament }: { tournament: ITournament }) {
  const id = String(tournament.id || tournament._id);
  return (
    <StatusBadgePicker
      tournamentId={id}
      currentStatus={tournament.status || 'Draft'}
      size="sm"
    />
  );
}

export default function TournamentsPage() {
  const [page, setPage] = React.useState(1);
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['tournaments', page],
    queryFn: () => TournamentService.list({ page, limit }),
  });

  const columns: ColumnDef<ITournament>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <Link href={`/workspace/tournaments/${row.original.id || row.original._id}`} className="font-medium hover:underline text-primary">
          {row.getValue('name')}
        </Link>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusCell tournament={row.original} />,
    },
    {
      accessorFn: (row) => row.tournamentDates?.startDate,
      id: 'startDate',
      header: 'Start Date',
      cell: ({ row }) => {
        const date = row.getValue('startDate') as string;
        return date ? format(new Date(date), 'PP') : 'N/A';
      },
    },
    {
      accessorKey: 'organizerName',
      header: 'Organizer',
    },
    {
      id: 'actions',
      header: 'Quick Actions',
      cell: ({ row }) => {
        const id = String(row.original.id || row.original._id);
        return (
          <div className="flex items-center gap-2">
            {/* Draw & Brackets shortcut */}
            <Link
              href={`/workspace/tournaments/${id}/brackets`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold hover:bg-violet-500/20 transition-colors whitespace-nowrap"
            >
              <GitBranch className="w-3.5 h-3.5" />
              Draw &amp; Brackets
            </Link>
            {/* Open detail */}
            <Link
              href={`/workspace/tournaments/${id}`}
              className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-medium hover:text-foreground hover:bg-muted/80 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tournaments</h2>
          <p className="text-muted-foreground">Manage all tournaments across the platform.</p>
        </div>
        <Link href="/workspace/tournaments/new" className={buttonVariants({ variant: 'default' })}>
          <Plus className="mr-2 h-4 w-4" /> Create Tournament
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        pageCount={data?.meta?.totalPages || -1}
        pagination={{ pageIndex: page - 1, pageSize: limit }}
        onPaginationChange={(pagination) => setPage(pagination.pageIndex + 1)}
      />
    </div>
  );
}
