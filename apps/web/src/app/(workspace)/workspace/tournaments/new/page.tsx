// @ts-nocheck
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { TournamentService } from '@/services/tournament.service';
import { CreateTournamentSchema } from '@/modules/tournaments/validators/tournament.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CloudinaryUploader } from '@/components/shared/CloudinaryUploader';
import { toast } from 'sonner';

export default function CreateTournamentPage() {
  const router = useRouter();
  const [bannerUrl, setBannerUrl] = React.useState('');
  const [logoUrl, setLogoUrl] = React.useState('');
  const [qrUrl, setQrUrl] = React.useState('');

  const form = useForm<any>({
    resolver: zodResolver(CreateTournamentSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      organizerName: '',
      organizationId: '000000000000000000000000',
      sportId: '000000000000000000000000',
      rulePackageId: '000000000000000000000000',
      visibility: 'Public',
      timezone: 'Asia/Kolkata',
      currency: 'INR',
      registrationWindow: {
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      tournamentDates: {
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
      },
      venueIds: [],
      tags: [],
      documents: [],
    },
  });

  // Auto-generate slug from name
  const watchName = form.watch('name');
  React.useEffect(() => {
    if (watchName) {
      form.setValue('slug', watchName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  }, [watchName]);

  const createMutation = useMutation({
    mutationFn: (data: any) => TournamentService.create({
      ...data,
      bannerUrl,
      logoUrl,
      paymentConfiguration: {
        ...data.paymentConfiguration,
        qrCodeUrl: qrUrl,
      },
    }),
    onSuccess: (response: any) => {
      toast.success('Tournament created successfully as Draft');
      router.push(`/workspace/tournaments/${response.data._id}`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create tournament');
    },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Create Tournament</h2>
        <p className="text-muted-foreground">Set up a new tournament in Draft mode.</p>
      </div>

      <form onSubmit={form.handleSubmit((d) => createMutation.mutate(d))} className="space-y-6">
        {/* Banner & Logo Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Tournament Branding</CardTitle>
            <CardDescription>Upload a banner and logo for your tournament.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tournament Banner</Label>
              <CloudinaryUploader
                folder="tournaments"
                value={bannerUrl}
                onChange={setBannerUrl}
                label="Click to upload banner (3:1 ratio recommended)"
                aspectRatio="banner"
              />
            </div>
            <div className="space-y-2">
              <Label>Tournament Logo</Label>
              <CloudinaryUploader
                folder="tournaments"
                value={logoUrl}
                onChange={setLogoUrl}
                label="Click to upload logo (square)"
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
            <CardDescription>Core details for your tournament.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tournament Name *</Label>
                <Input {...form.register('name')} placeholder="Summer Open 2026" />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">{form.formState.errors.name.message as string}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Slug (URL)</Label>
                <Input {...form.register('slug')} placeholder="summer-open-2026" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea {...form.register('description')} placeholder="Brief description of the tournament..." rows={3} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Organizer Name *</Label>
                <Input {...form.register('organizerName')} placeholder="Pollachi Sports Club" />
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select onValueChange={(v) => form.setValue('timezone', v)} defaultValue="Asia/Kolkata">
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select onValueChange={(v) => form.setValue('currency', v)} defaultValue="INR">
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
                <Select onValueChange={(v) => form.setValue('visibility', v)} defaultValue="Public">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Public">Public</SelectItem>
                    <SelectItem value="Private">Private</SelectItem>
                    <SelectItem value="Unlisted">Unlisted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Registration & Tournament Dates */}
        <Card>
          <CardHeader>
            <CardTitle>Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Registration Opens *</Label>
                <Input
                  type="datetime-local"
                  {...form.register('registrationWindow.startDate')}
                />
              </div>
              <div className="space-y-2">
                <Label>Registration Closes *</Label>
                <Input
                  type="datetime-local"
                  {...form.register('registrationWindow.endDate')}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tournament Start Date *</Label>
                <Input
                  type="datetime-local"
                  {...form.register('tournamentDates.startDate')}
                />
              </div>
              <div className="space-y-2">
                <Label>Tournament End Date *</Label>
                <Input
                  type="datetime-local"
                  {...form.register('tournamentDates.endDate')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Configuration</CardTitle>
            <CardDescription>How players should pay the registration fee.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Creating...' : 'Create Draft Tournament'}
          </Button>
        </div>
      </form>
    </div>
  );
}
