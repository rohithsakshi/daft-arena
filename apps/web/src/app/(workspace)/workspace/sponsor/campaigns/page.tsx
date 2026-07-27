'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { CloudinaryUploader } from '@/components/shared/CloudinaryUploader';
import { EmptyState } from '@/components/shared/EmptyState';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { BarChart3, Plus, Play, Pause, Eye, Target } from 'lucide-react';

const SPORTS = ['Badminton', 'Tennis', 'Football', 'Cricket', 'Basketball', 'Volleyball', 'Table Tennis', 'Squash'];

const STATUS_COLORS: Record<string, string> = {
  Draft: 'secondary',
  Active: 'default',
  Paused: 'secondary',
  Completed: 'secondary',
};

export default function CampaignsPage() {
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = React.useState(false);
  const [bannerUrl, setBannerUrl] = React.useState('');
  const [logoUrl, setLogoUrl] = React.useState('');
  const [selectedSports, setSelectedSports] = React.useState<string[]>([]);
  const [form, setForm] = React.useState({
    name: '',
    description: '',
    targetAudience: 'PLAYERS',
    startDate: '',
    endDate: '',
    priority: '5',
    ctaUrl: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['sponsor-campaigns'],
    queryFn: async () => {
      const res = await fetch('/api/sponsor/campaigns');
      if (!res.ok) return { data: [] };
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/sponsor/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          bannerUrl,
          logoUrl,
          sports: selectedSports,
          priority: parseInt(form.priority),
        }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      return res.json();
    },
    onSuccess: () => {
      toast.success('Campaign created!');
      queryClient.invalidateQueries({ queryKey: ['sponsor-campaigns'] });
      setShowCreate(false);
      setBannerUrl('');
      setLogoUrl('');
      setSelectedSports([]);
      setForm({ name: '', description: '', targetAudience: 'PLAYERS', startDate: '', endDate: '', priority: '5', ctaUrl: '' });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const toggleSport = (sport: string) => {
    setSelectedSports(prev =>
      prev.includes(sport) ? prev.filter(s => s !== sport) : [...prev, sport]
    );
  };

  const campaigns: any[] = data?.data || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 max-w-6xl">
      <div className="flex items-center justify-between">
        <SectionHeader
          title="Campaigns"
          description="Create and manage your advertising campaigns."
          icon={BarChart3}
        />
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4 mr-2" /> New Campaign
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : campaigns.length === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="No campaigns yet"
          description="Create your first campaign to start reaching sports players."
          action={<Button onClick={() => setShowCreate(true)}><Plus className="w-4 h-4 mr-2" />Create Campaign</Button>}
        />
      ) : (
        <div className="grid gap-6">
          {campaigns.map((c: any) => (
            <Card key={c._id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {c.logoUrl && (
                    <img src={c.logoUrl} alt="logo" className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold">{c.name}</h3>
                        <p className="text-sm text-muted-foreground">{c.description}</p>
                      </div>
                      <Badge variant={STATUS_COLORS[c.status] as any}>{c.status}</Badge>
                    </div>
                    {c.bannerUrl && (
                      <img src={c.bannerUrl} alt="banner" className="w-full h-28 object-cover rounded-lg border border-white/10 mb-3" />
                    )}
                    <div className="grid grid-cols-4 gap-4 p-4 bg-background/50 rounded-xl border border-white/5 mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Impressions</p>
                        <p className="text-xl font-bold">{c.impressions.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Clicks</p>
                        <p className="text-xl font-bold">{c.clicks.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">CTR</p>
                        <p className="text-xl font-bold">
                          {c.impressions > 0 ? ((c.clicks / c.impressions) * 100).toFixed(1) : '0'}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Priority</p>
                        <p className="text-xl font-bold">{c.priority}/10</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        <span>{c.targetAudience}</span>
                      </div>
                      {c.sports?.length > 0 && (
                        <span>{c.sports.join(', ')}</span>
                      )}
                      <span>{format(new Date(c.startDate), 'PP')} → {format(new Date(c.endDate), 'PP')}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Campaign Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2">
            <div className="space-y-2">
              <Label>Banner Image</Label>
              <CloudinaryUploader
                folder="sponsors"
                value={bannerUrl}
                onChange={setBannerUrl}
                label="Upload campaign banner"
                aspectRatio="banner"
              />
            </div>
            <div className="space-y-2">
              <Label>Logo</Label>
              <CloudinaryUploader
                folder="sponsors"
                value={logoUrl}
                onChange={setLogoUrl}
                label="Upload brand logo"
                aspectRatio="square"
                className="max-w-[150px]"
              />
            </div>
            <div className="space-y-2">
              <Label>Campaign Name *</Label>
              <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Summer Sports Promo" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description..." rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Input type="date" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>End Date *</Label>
                <Input type="date" value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Target Audience</Label>
                <Select value={form.targetAudience} onValueChange={v => setForm(p => ({ ...p, targetAudience: v as string }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PLAYERS">Players Only</SelectItem>
                    <SelectItem value="ADMINS">Tournament Admins Only</SelectItem>
                    <SelectItem value="BOTH">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority (1-10)</Label>
                <Input type="number" min="1" max="10" value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Target Sports (select all that apply)</Label>
              <div className="flex flex-wrap gap-2">
                {SPORTS.map(sport => (
                  <button
                    key={sport}
                    type="button"
                    onClick={() => toggleSport(sport)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      selectedSports.includes(sport)
                        ? 'bg-violet-600 border-violet-600 text-white'
                        : 'border-white/20 text-muted-foreground hover:border-white/40'
                    }`}
                  >
                    {sport}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>CTA URL</Label>
              <Input value={form.ctaUrl} onChange={e => setForm(p => ({ ...p, ctaUrl: e.target.value }))} placeholder="https://yourbrand.com" />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending || !form.name}>
                {createMutation.isPending ? 'Creating...' : 'Create Campaign'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
