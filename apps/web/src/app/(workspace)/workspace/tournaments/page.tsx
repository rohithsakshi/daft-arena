'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { TournamentService } from '@/services/tournament.service';
import { DataTable } from '@/components/shared/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { ITournament } from '@/modules/tournaments/models/Tournament';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';

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
        <Link href={`/tournaments/${row.original._id}`} className="font-medium hover:underline text-primary">
          {row.getValue('name')}
        </Link>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return <Badge variant={status === 'Draft' ? 'secondary' : 'default'}>{status}</Badge>;
      },
    },
    {
      accessorFn: (row) => row.tournamentDates.startDate,
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
        <Link href="/tournaments/new" className={buttonVariants({ variant: "default" })}>
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
