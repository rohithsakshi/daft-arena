'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TournamentService } from '@/services/tournament.service';
import { TournamentStatus } from '@/modules/core/enums';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function TournamentDetailsPage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const id = params.tournamentId as string;

  const { data, isLoading } = useQuery({
    queryKey: ['tournament', id],
    queryFn: () => TournamentService.getById(id),
  });

  const publishMutation = useMutation({
    mutationFn: () => TournamentService.changeStatus(id, TournamentStatus.Published),
    onSuccess: () => {
      toast.success("Tournament published successfully");
      queryClient.invalidateQueries({ queryKey: ['tournament', id] });
    },
    onError: (error: unknown) => {
      toast.error((error as Error).message || "Failed to publish tournament");
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (!data?.data) return <div>Tournament not found</div>;

  const tournament = data.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-3xl font-bold tracking-tight">{tournament.name}</h2>
            <Badge variant={tournament.status === 'Draft' ? 'secondary' : 'default'}>{tournament.status}</Badge>
          </div>
          <p className="text-muted-foreground">/{tournament.slug}</p>
        </div>
        <div className="flex space-x-2">
          {tournament.status === TournamentStatus.Draft && (
            <Button onClick={() => publishMutation.mutate()} disabled={publishMutation.isPending}>
              {publishMutation.isPending ? 'Publishing...' : 'Publish'}
            </Button>
          )}
          <Button variant="outline">Edit Configuration</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Organizer</span>
              <span className="text-muted-foreground">{tournament.organizerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Timezone</span>
              <span className="text-muted-foreground">{tournament.timezone}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Visibility</span>
              <span className="text-muted-foreground">{tournament.visibility}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Registration Opens</span>
              <span className="text-muted-foreground">
                {format(new Date(tournament.registrationWindow.startDate), 'PPp')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Registration Closes</span>
              <span className="text-muted-foreground">
                {format(new Date(tournament.registrationWindow.endDate), 'PPp')}
              </span>
            </div>
            <div className="flex justify-between mt-4">
              <span className="font-medium">Tournament Starts</span>
              <span className="text-muted-foreground">
                {format(new Date(tournament.tournamentDates.startDate), 'PPp')}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Events</CardTitle>
              <Button size="sm" variant="outline">Manage Events</Button>
            </div>
          </CardHeader>
          <CardContent>
             <div className="h-[150px] flex items-center justify-center text-muted-foreground text-sm border rounded-md border-dashed">
              [Events List Placeholder]
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
