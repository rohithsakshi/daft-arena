'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { TournamentService } from '@/services/tournament.service';
import { CreateTournamentSchema } from '@/modules/tournaments/validators/tournament.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

type CreateTournamentFormValues = z.infer<typeof CreateTournamentSchema>;

export default function CreateTournamentPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<any>({
    resolver: zodResolver(CreateTournamentSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      organizerName: '',
      organizationId: '000000000000000000000000', // Mock ObjectId for now
      sportId: '000000000000000000000000',
      rulePackageId: '000000000000000000000000',
      visibility: 'Public',
      timezone: 'UTC',
      currency: 'USD',
      registrationWindow: {
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      },
      tournamentDates: {
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000)
      },
      venueIds: [],
      tags: [],
      documents: [],
    },
  });

  async function onSubmit(data: any) {
    setIsLoading(true);
    try {
      const response = await TournamentService.create(data);
      toast.success("Tournament created successfully as Draft");
      router.push(`/tournaments/${response.data._id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to create tournament");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Create Tournament</h2>
        <p className="text-muted-foreground">Setup a new tournament in Draft mode.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>The core details for your tournament.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tournament Name</Label>
                <Input {...form.register('name')} placeholder="Summer Open 2026" />
                {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message as string}</p>}
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input {...form.register('slug')} placeholder="summer-open-2026" />
                {form.formState.errors.slug && <p className="text-sm text-destructive">{form.formState.errors.slug.message as string}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea {...form.register('description')} placeholder="Brief description of the tournament..." />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Organizer Name</Label>
                <Input {...form.register('organizerName')} placeholder="DAFT Sports" />
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Input {...form.register('timezone')} placeholder="UTC" />
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Create Draft'}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
