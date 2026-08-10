'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Trash2, Building2, ExternalLink, Loader2 } from 'lucide-react';
import { SponsorTier } from '@/modules/sponsors/models/Sponsor';

export default function SponsorsAdminPage() {
  const params = useParams();
  const tournamentId = params?.tournamentId as string;
  const queryClient = useQueryClient();

  const [formData, setFormData] = React.useState({
    name: '',
    logoUrl: '',
    websiteUrl: '',
    tier: SponsorTier.Silver,
    description: ''
  });

  const { data: res, isLoading } = useQuery({
    queryKey: ['sponsors', tournamentId],
    queryFn: async () => {
      const response = await fetch(`/api/tournaments/${tournamentId}/sponsors`);
      if (!response.ok) throw new Error('Failed to load sponsors');
      return response.json();
    }
  });

  const addSponsorMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/tournaments/${tournamentId}/sponsors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to add sponsor');
      return response.json();
    },
    onSuccess: () => {
      setFormData({ name: '', logoUrl: '', websiteUrl: '', tier: SponsorTier.Silver, description: '' });
      queryClient.invalidateQueries({ queryKey: ['sponsors', tournamentId] });
      toast.success('Sponsor added successfully!');
    }
  });

  const sponsors = res?.data || [];

  const handleAddSponsor = () => {
    if (!formData.name || !formData.logoUrl) {
      toast.error('Name and Logo URL are required');
      return;
    }
    
    // Only allow one Title sponsor for simplicity in this demo
    if (formData.tier === SponsorTier.Title && sponsors.some((s: any) => s.tier === SponsorTier.Title)) {
      toast.error('There is already a Title Sponsor. Only one Title Sponsor is allowed.');
      return;
    }

    addSponsorMutation.mutate(formData);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case SponsorTier.Title: return 'bg-violet-600 border-violet-500 text-white';
      case SponsorTier.Gold: return 'bg-amber-500/20 border-amber-500/50 text-amber-400';
      case SponsorTier.Silver: return 'bg-slate-300/20 border-slate-300/50 text-slate-300';
      case SponsorTier.Bronze: return 'bg-orange-800/20 border-orange-800/50 text-orange-400';
      default: return '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Sponsors & Partners</h2>
          <p className="text-muted-foreground">Add sponsors to unlock monetization. Title sponsors get prime real estate on public pages.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Add Form */}
        <div className="lg:col-span-1">
          <Card className="bg-zinc-900/50 border-white/10 sticky top-6">
            <CardHeader>
              <CardTitle>Add New Sponsor</CardTitle>
              <CardDescription>Enter the sponsor details and assets.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Sponsor Name</label>
                <Input 
                  placeholder="e.g. Yonex" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Sponsorship Tier</label>
                <Select value={formData.tier} onValueChange={(val) => val && setFormData({ ...formData, tier: val as SponsorTier })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SponsorTier.Title}>Title (Main Sponsor)</SelectItem>
                    <SelectItem value={SponsorTier.Gold}>Gold</SelectItem>
                    <SelectItem value={SponsorTier.Silver}>Silver</SelectItem>
                    <SelectItem value={SponsorTier.Bronze}>Bronze</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Logo URL</label>
                <Input 
                  placeholder="https://..." 
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Website URL (Optional)</label>
                <Input 
                  placeholder="https://..." 
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                />
              </div>

              <Button 
                className="w-full mt-4 bg-violet-600 hover:bg-violet-500" 
                onClick={handleAddSponsor}
                disabled={addSponsorMutation.isPending}
              >
                {addSponsorMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                Add Sponsor
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Sponsor List */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-violet-500" /></div>
          ) : sponsors.length === 0 ? (
            <Card className="bg-transparent border border-dashed border-white/20 h-64 flex flex-col items-center justify-center text-muted-foreground">
              <Building2 className="w-12 h-12 mb-4 opacity-20" />
              <p>No sponsors have been added yet.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {sponsors.sort((a: any, b: any) => {
                const order = { [SponsorTier.Title]: 1, [SponsorTier.Gold]: 2, [SponsorTier.Silver]: 3, [SponsorTier.Bronze]: 4 };
                return (order[a.tier as SponsorTier] || 9) - (order[b.tier as SponsorTier] || 9);
              }).map((sponsor: any) => (
                <Card key={sponsor._id} className="bg-zinc-900/30 border-white/5 overflow-hidden">
                  <div className="flex flex-col sm:flex-row items-center p-4 gap-6">
                    <div className="w-32 h-20 bg-white rounded-lg flex items-center justify-center p-2 shrink-0">
                      <img src={sponsor.logoUrl} alt={sponsor.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    
                    <div className="flex-1 text-center sm:text-left">
                      <h4 className="text-xl font-bold mb-1">{sponsor.name}</h4>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                        <Badge variant="outline" className={`${getTierColor(sponsor.tier)}`}>
                          {sponsor.tier} Sponsor
                        </Badge>
                        {sponsor.websiteUrl && (
                          <a href={sponsor.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline flex items-center gap-1">
                            Visit Site <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                    
                    <div className="shrink-0">
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
