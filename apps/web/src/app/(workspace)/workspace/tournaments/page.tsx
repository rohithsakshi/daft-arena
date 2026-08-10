// @ts-nocheck
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TournamentService } from '@/services/tournament.service';
import { DataTable } from '@/components/shared/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { ITournament } from '@/modules/tournaments/models/Tournament';
import { buttonVariants } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
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
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tournaments</h2>
          <p className="text-muted-foreground">Manage all tournaments across the platform.</p>
        </div>
        <Link href="/workspace/tournaments/new" className={buttonVariants({ variant: "default" })}>
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
