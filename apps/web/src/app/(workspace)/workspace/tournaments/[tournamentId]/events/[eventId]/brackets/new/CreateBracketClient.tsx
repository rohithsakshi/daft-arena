'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { BracketCreateSchema } from '@/modules/brackets/validators/BracketSchema';
import { useCreateBracket } from '@/hooks/useBrackets';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

enum BracketType {
  SingleElimination = 'SingleElimination',
  DoubleElimination = 'DoubleElimination',
  RoundRobin = 'RoundRobin',
  Swiss = 'Swiss',
  League = 'League',
  Pool = 'Pool',
  Hybrid = 'Hybrid',
  Custom = 'Custom'
}

export default function CreateBracketClient({ tournamentId, eventId }: { tournamentId: string, eventId: string }) {
  const router = useRouter();
  const createBracket = useCreateBracket();

  const form = useForm({
    resolver: zodResolver(BracketCreateSchema),
    defaultValues: {
      tournamentId,
      eventId,
      name: '',
      type: BracketType.SingleElimination,
      settings: {
        participantsCount: 8,
        thirdPlaceMatch: false,
        consolationBracket: false,
        pointsForWin: 3,
        pointsForDraw: 1,
        pointsForLoss: 0
      }
    }
  });

  const onSubmit = async (data: any) => {
    try {
      const result = await createBracket.mutateAsync(data);
      toast.success("Bracket created successfully");
      router.push(`/tournaments/${tournamentId}/events/${eventId}/brackets/${result.id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to create bracket");
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Create New Bracket
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Bracket Name</Label>
            <Input id="name" placeholder="e.g. Main Draw" {...form.register('name')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Format</Label>
            <Select 
              onValueChange={(val) => form.setValue('type', val as BracketType)} 
              defaultValue={form.getValues('type')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a format" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(BracketType).map((type) => (
                  <SelectItem key={type} value={type}>{type.replace(/([A-Z])/g, ' $1').trim()}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="participants">Number of Participants</Label>
            <Input 
              id="participants" 
              type="number" 
              {...form.register('settings.participantsCount', { valueAsNumber: true })} 
            />
          </div>

          <CardFooter className="px-0 pt-4 flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={createBracket.isPending}>
              {createBracket.isPending ? 'Creating...' : 'Create Bracket'}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
