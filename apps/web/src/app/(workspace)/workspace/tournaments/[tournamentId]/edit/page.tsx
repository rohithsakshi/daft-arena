// @ts-nocheck
'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TournamentService } from '@/services/tournament.service';
import { UpdateTournamentSchema } from '@/modules/tournaments/validators/tournament.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CloudinaryUploader } from '@/components/shared/CloudinaryUploader';
import { toast } from 'sonner';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

function toLocalDatetimeString(dateInput: string | Date | undefined) {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function EditTournamentPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const tournamentId = params?.tournamentId as string;

  const [bannerUrl, setBannerUrl] = React.useState('');
  const [logoUrl, setLogoUrl] = React.useState('');
  const [qrUrl, setQrUrl] = React.useState('');

  const { data: tournamentData, isLoading, isError } = useQuery({
    queryKey: ['tournament', tournamentId],
    queryFn: () => TournamentService.getById(tournamentId),
    enabled: Boolean(tournamentId),
  });

  const tournament = tournamentData?.data;

  const form = useForm<any>({
    resolver: zodResolver(UpdateTournamentSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      organizerName: '',
      visibility: 'Public',
      timezone: 'Asia/Kolkata',
      currency: 'INR',
      entryFee: 0,
      isFreeEntry: false,
      registrationWindow: {
        startDate: '',
        endDate: '',
      },
      tournamentDates: {
        startDate: '',
        endDate: '',
      },
      paymentConfiguration: {
        upiId: '',
        accountName: '',
        instructions: '',
      },
    },
  });

  // Pre-fill form when tournament loads
  React.useEffect(() => {
    if (tournament) {
      setBannerUrl(tournament.bannerUrl || '');
      setLogoUrl(tournament.logoUrl || '');
      setQrUrl(tournament.paymentConfiguration?.qrCodeUrl || '');

      form.reset({
        name: tournament.name || '',
        slug: tournament.slug || '',
        description: tournament.description || '',
        organizerName: tournament.organizerName || '',
        visibility: tournament.visibility || 'Public',
        status: tournament.status || 'Draft',
        timezone: tournament.timezone || 'Asia/Kolkata',
        currency: tournament.currency || 'INR',
        entryFee: tournament.entryFee ?? tournament.paymentConfiguration?.entryFee ?? 0,
        isFreeEntry: tournament.isFreeEntry ?? tournament.paymentConfiguration?.isFreeEntry ?? false,
        registrationWindow: {
          startDate: toLocalDatetimeString(tournament.registrationWindow?.startDate),
          endDate: toLocalDatetimeString(tournament.registrationWindow?.endDate),
        },
        tournamentDates: {
          startDate: toLocalDatetimeString(tournament.tournamentDates?.startDate),
          endDate: toLocalDatetimeString(tournament.tournamentDates?.endDate),
        },
        paymentConfiguration: {
          upiId: tournament.paymentConfiguration?.upiId || '',
          accountName: tournament.paymentConfiguration?.accountName || '',
          instructions: tournament.paymentConfiguration?.instructions || '',
        },
      });
    }
  }, [tournament, form]);

  const updateMutation = useMutation({
    mutationFn: (formData: any) => {
      const isFree = Boolean(formData.isFreeEntry);
      const fee = isFree ? 0 : (Number(formData.entryFee) || 0);

      return TournamentService.update(tournamentId, {
        ...formData,
        entryFee: fee,
        isFreeEntry: isFree,
        bannerUrl,
        logoUrl,
        paymentConfiguration: {
          ...formData.paymentConfiguration,
          entryFee: fee,
          isFreeEntry: isFree,
          qrCodeUrl: qrUrl,
        },
      });
    },
    onSuccess: () => {
      toast.success('Tournament details updated successfully');
      queryClient.invalidateQueries({ queryKey: ['tournament', tournamentId] });
      router.push(`/workspace/tournaments/${tournamentId}`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update tournament');
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading tournament details...</p>
      </div>
    );
  }

  if (isError || !tournament) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-lg font-semibold text-destructive">Tournament not found or failed to load.</p>
        <Link href="/workspace/tournaments">
          <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Tournaments</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Tournament</h2>
          <p className="text-muted-foreground">Update settings and details for {tournament.name}.</p>
        </div>
        <Link href={`/workspace/tournaments/${tournamentId}`}>
          <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Cancel</Button>
        </Link>
      </div>

      <form onSubmit={form.handleSubmit((d) => updateMutation.mutate(d))} className="space-y-6">
        {/* Banner & Logo Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Tournament Branding</CardTitle>
            <CardDescription>Update banner and logo images.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tournament Banner</Label>
              <CloudinaryUploader
                folder="tournaments"
                value={bannerUrl}
                onChange={setBannerUrl}
                label="Click to upload banner"
                aspectRatio="banner"
              />
            </div>
            <div className="space-y-2">
              <Label>Tournament Logo</Label>
              <CloudinaryUploader
                folder="tournaments"
                value={logoUrl}
                onChange={setLogoUrl}
                label="Click to upload logo"
                aspectRatio="square"
                className="max-w-[200px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Core details of the tournament.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tournament Name *</Label>
                <Input {...form.register('name')} placeholder="Tournament Name" />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">{form.formState.errors.name.message as string}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Slug (URL)</Label>
                <Input {...form.register('slug')} placeholder="slug" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea {...form.register('description')} placeholder="Brief description..." rows={3} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Organizer Name *</Label>
                <Input {...form.register('organizerName')} placeholder="Organizer Name" />
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select onValueChange={(v) => form.setValue('timezone', v)} value={form.watch('timezone')}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="Asia/Dubai">Asia/Dubai</SelectItem>
                    <SelectItem value="Asia/Singapore">Asia/Singapore</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select onValueChange={(v) => form.setValue('currency', v)} value={form.watch('currency')}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">INR (₹)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Visibility</Label>
                <Select onValueChange={(v) => form.setValue('visibility', v)} value={form.watch('visibility')}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Public">Public</SelectItem>
                    <SelectItem value="Private">Private</SelectItem>
                    <SelectItem value="Unlisted">Unlisted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tournament Status</Label>
                <Select onValueChange={(v) => form.setValue('status', v)} value={form.watch('status')}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                    <SelectItem value="RegistrationOpen">Registration Open</SelectItem>
                    <SelectItem value="RegistrationClosed">Registration Closed</SelectItem>
                    <SelectItem value="Seeding">Seeding</SelectItem>
                    <SelectItem value="Live">Live</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Registration Opens</Label>
                <Input
                  type="datetime-local"
                  {...form.register('registrationWindow.startDate')}
                />
              </div>
              <div className="space-y-2">
                <Label>Registration Closes</Label>
                <Input
                  type="datetime-local"
                  {...form.register('registrationWindow.endDate')}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tournament Start Date</Label>
                <Input
                  type="datetime-local"
                  {...form.register('tournamentDates.startDate')}
                />
              </div>
              <div className="space-y-2">
                <Label>Tournament End Date</Label>
                <Input
                  type="datetime-local"
                  {...form.register('tournamentDates.endDate')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment & Entry Fee Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Payment & Registration Fee</CardTitle>
            <CardDescription>Configure entry fees and payment instructions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isFreeEntry"
                  className="w-4 h-4 rounded border-white/20 text-violet-600 focus:ring-violet-500 bg-background accent-violet-600 cursor-pointer"
                  checked={form.watch('isFreeEntry')}
                  onChange={(e) => {
                    form.setValue('isFreeEntry', e.target.checked);
                    if (e.target.checked) {
                      form.setValue('entryFee', 0);
                    }
                  }}
                />
                <Label htmlFor="isFreeEntry" className="font-semibold text-sm cursor-pointer">
                  Free Entry Tournament (No registration fee required)
                </Label>
              </div>

              {!form.watch('isFreeEntry') && (
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="entryFee">Registration Fee Amount ({form.watch('currency') || 'INR'}) *</Label>
                    <Input
                      id="entryFee"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="e.g. 500"
                      {...form.register('entryFee', { valueAsNumber: true })}
                    />
                  </div>
                </div>
              )}
            </div>

            {!form.watch('isFreeEntry') && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>UPI ID</Label>
                    <Input
                      {...form.register('paymentConfiguration.upiId')}
                      placeholder="organizer@ybl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Account Name</Label>
                    <Input
                      {...form.register('paymentConfiguration.accountName')}
                      placeholder="DAFT Sports Pvt Ltd"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Payment QR Code</Label>
                  <CloudinaryUploader
                    folder="qr"
                    value={qrUrl}
                    onChange={setQrUrl}
                    label="Upload UPI QR Code"
                    aspectRatio="square"
                    className="max-w-[200px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Payment Instructions</Label>
                  <Textarea
                    {...form.register('paymentConfiguration.instructions')}
                    placeholder="Pay via UPI and upload screenshot with UTR number..."
                    rows={3}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
