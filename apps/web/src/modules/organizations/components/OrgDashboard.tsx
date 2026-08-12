'use client';

import React, { useEffect, useState } from 'react';
import { 
  Building, 
  Shield, 
  Mail, 
  MapPin, 
  Plus, 
  Users, 
  CheckCircle, 
  Tag, 
  X,
  PlusCircle,
  FolderOpen,
  Edit2,
  Trash2,
  ArrowRightLeft,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import Link from 'next/link';

export function OrgDashboard({ orgId }: { orgId: string }) {
  const [org, setOrg] = useState<any>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [transfers, setTransfers] = useState<any[]>([]);
  const [allPlayers, setAllPlayers] = useState<any[]>([]);
  const [allOrgs, setAllOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Tab state
  const [activeTab, setActiveTab] = useState<'teams' | 'transfers'>('teams');

  // Team creation states
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamCategories, setTeamCategories] = useState<string[]>(['U-19']);

  // Team edit states
  const [editingTeam, setEditingTeam] = useState<any>(null);
  const [editName, setEditName] = useState('');
  const [editCategories, setEditCategories] = useState<string[]>(['U-19']);

  // Transfer creation states
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState('');
  const [transferReason, setTransferReason] = useState('');

  const CATEGORY_OPTIONS = ['U-15', 'U-19', 'Senior', 'Veteran'];

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch org details
      const orgRes = await fetch(`/api/organizations?id=${orgId}`);
      if (orgRes.ok) {
        const orgData = await orgRes.json();
        setOrg(orgData);
      } else {
        toast.error('Organization not found.');
      }

      // Fetch teams
      const teamsRes = await fetch(`/api/organizations/teams?orgId=${orgId}`);
      if (teamsRes.ok) {
        const teamsData = await teamsRes.json();
        setTeams(teamsData);
      }

      // Fetch transfers
      const transfersRes = await fetch(`/api/organizations/transfers?orgId=${orgId}`);
      if (transfersRes.ok) {
        const transfersData = await transfersRes.json();
        setTransfers(transfersData);
      }

      // Fetch all players
      const playersRes = await fetch('/api/players');
      if (playersRes.ok) {
        const playersData = await playersRes.json();
        setAllPlayers(playersData);
      }

      // Fetch all organizations
      const orgsRes = await fetch('/api/organizations');
      if (orgsRes.ok) {
        const orgsData = await orgsRes.json();
        setAllOrgs(orgsData);
      }
    } catch {
      toast.error('Connection error loading organization data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [orgId]);

  const handleToggleCategory = (cat: string, isEdit: boolean) => {
    if (isEdit) {
      setEditCategories(prev => 
        prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
      );
    } else {
      setTeamCategories(prev => 
        prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
      );
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) {
      toast.error('Please enter a team name.');
      return;
    }
    if (teamCategories.length === 0) {
      toast.error('Please select at least one category.');
      return;
    }

    try {
      const res = await fetch('/api/organizations/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: orgId,
          name: teamName,
          categories: teamCategories
        })
      });

      if (res.ok) {
        toast.success('Team created successfully!');
        setTeamName('');
        setTeamCategories(['U-19']);
        setShowTeamForm(false);
        // Refresh teams
        const teamsRes = await fetch(`/api/organizations/teams?orgId=${orgId}`);
        if (teamsRes.ok) {
          const teamsData = await teamsRes.json();
          setTeams(teamsData);
        }
      } else {
        toast.error('Failed to create team.');
      }
    } catch {
      toast.error('Error creating team.');
    }
  };

  const handleStartEditTeam = (team: any) => {
    setEditingTeam(team);
    setEditName(team.name);
    setEditCategories(team.categories && team.categories.length > 0 ? team.categories : (team.category ? [team.category] : ['U-19']));
    setShowTeamForm(false);
  };

  const handleUpdateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error('Please enter a team name.');
      return;
    }
    if (editCategories.length === 0) {
      toast.error('Please select at least one category.');
      return;
    }

    try {
      const res = await fetch('/api/organizations/teams', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingTeam.id,
          name: editName,
          categories: editCategories
        })
      });

      if (res.ok) {
        toast.success('Team updated successfully!');
        setEditingTeam(null);
        // Refresh teams
        const teamsRes = await fetch(`/api/organizations/teams?orgId=${orgId}`);
        if (teamsRes.ok) {
          const teamsData = await teamsRes.json();
          setTeams(teamsData);
        }
      } else {
        toast.error('Failed to update team.');
      }
    } catch {
      toast.error('Error updating team.');
    }
  };

  const handleDeleteTeam = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team?')) return;

    try {
      const res = await fetch(`/api/organizations/teams?id=${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        toast.success('Team deleted successfully!');
        // Refresh teams
        const teamsRes = await fetch(`/api/organizations/teams?orgId=${orgId}`);
        if (teamsRes.ok) {
          const teamsData = await teamsRes.json();
          setTeams(teamsData);
        }
      } else {
        toast.error('Failed to delete team.');
      }
    } catch {
      toast.error('Error deleting team.');
    }
  };

  const handleInitiateTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayerId) {
      toast.error('Please select a player to transfer.');
      return;
    }

    const selectedPlayer = allPlayers.find(p => p.id === selectedPlayerId);

    try {
      const res = await fetch('/api/organizations/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: selectedPlayerId,
          fromOrgId: selectedPlayer?.tenantId || undefined,
          toOrgId: orgId,
          reason: transferReason
        })
      });

      if (res.ok) {
        toast.success('Transfer request initiated successfully!');
        setSelectedPlayerId('');
        setTransferReason('');
        setShowTransferForm(false);
        // Refresh transfers
        const transfersRes = await fetch(`/api/organizations/transfers?orgId=${orgId}`);
        if (transfersRes.ok) {
          const transfersData = await transfersRes.json();
          setTransfers(transfersData);
        }
      } else {
        toast.error('Failed to initiate transfer.');
      }
    } catch {
      toast.error('Error initiating transfer.');
    }
  };

  const handleUpdateTransferStatus = async (id: string, status: 'Approved' | 'Rejected') => {
    try {
      const res = await fetch('/api/organizations/transfers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });

      if (res.ok) {
        toast.success(`Transfer request ${status.toLowerCase()} successfully!`);
        fetchData();
      } else {
        toast.error('Failed to update transfer status.');
      }
    } catch {
      toast.error('Error updating transfer status.');
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground animate-pulse">Loading organization dashboard...</div>;
  }

  if (!org) {
    return (
      <div className="text-center py-12 space-y-4">
        <Shield className="w-12 h-12 text-red-500 mx-auto" />
        <h3 className="text-xl font-bold">Organization Not Found</h3>
        <Link href="/workspace/organizations">
          <Button variant="outline" className="mt-4">Back to Directory</Button>
        </Link>
      </div>
    );
  }

  // Selected player logic
  const selectedPlayer = allPlayers.find(p => p.id === selectedPlayerId);
  const fromOrgName = selectedPlayer?.tenantId 
    ? (allOrgs.find(o => o.id === selectedPlayer.tenantId)?.name || 'Other Club')
    : 'Free Agent';

  return (
    <div className="space-y-8 animate-in fade-in duration-300 text-left">
      {/* Overview Stats & Profile Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-2 bg-card rounded-2xl p-6 border border-border shadow-lg flex flex-col justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-bold text-foreground">{org.name}</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/20 text-primary font-semibold">{org.type}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-muted-foreground" /> {org.contactEmail}
              </p>
              {org.address && (
                <p className="text-sm text-muted-foreground mt-1.5 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-muted-foreground" /> {org.address}
                </p>
              )}
            </div>
          </div>
          
          <div className="border-t border-border pt-4 mt-6 flex justify-between items-center text-xs text-muted-foreground">
            <span>Status: <strong className="text-green-500 font-semibold">{org.status}</strong></span>
            <span>Registered: {new Date(org.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Counter cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
          <div 
            onClick={() => setActiveTab('teams')}
            className={cn(
              "bg-card rounded-2xl p-6 border shadow-lg flex items-center justify-between cursor-pointer transition-colors",
              activeTab === 'teams' ? "border-primary" : "border-border hover:border-primary/40"
            )}
          >
            <div>
              <h3 className="text-muted-foreground text-sm font-semibold">Active Teams</h3>
              <p className="text-4xl font-extrabold text-foreground mt-1">{teams.length}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('transfers')}
            className={cn(
              "bg-card rounded-2xl p-6 border shadow-lg flex items-center justify-between cursor-pointer transition-colors",
              activeTab === 'transfers' ? "border-primary" : "border-border hover:border-primary/40"
            )}
          >
            <div>
              <h3 className="text-muted-foreground text-sm font-semibold">Transfers Pending</h3>
              <p className="text-4xl font-extrabold text-foreground mt-1">
                {transfers.filter(t => t.status === 'Pending').length}
              </p>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400">
              <ArrowRightLeft className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-4 border-b border-border">
        <button 
          onClick={() => setActiveTab('teams')}
          className={cn(
            "pb-3 text-sm font-semibold transition-colors border-b-2 px-1 cursor-pointer",
            activeTab === 'teams' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Teams List ({teams.length})
        </button>
        <button 
          onClick={() => setActiveTab('transfers')}
          className={cn(
            "pb-3 text-sm font-semibold transition-colors border-b-2 px-1 cursor-pointer",
            activeTab === 'transfers' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Transfer Requests ({transfers.length})
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'teams' ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-1">
            <div>
              <h3 className="text-xl font-bold text-foreground">Teams List</h3>
              <p className="text-sm text-muted-foreground">Configure teams, coaches, and rosters for matches.</p>
            </div>
            {!showTeamForm && !editingTeam && (
              <Button onClick={() => { setShowTeamForm(true); setEditingTeam(null); }} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <PlusCircle className="w-4 h-4 mr-2" /> Add Team
              </Button>
            )}
          </div>

          {showTeamForm && (
            <div className="bg-muted/30 p-6 rounded-2xl border border-primary/20 max-w-lg">
              <div className="flex justify-between items-center mb-4 border-b border-border pb-2">
                <h4 className="font-bold text-foreground">Register New Team</h4>
                <button onClick={() => setShowTeamForm(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleCreateTeam} className="space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Team Name</label>
                    <Input 
                      placeholder="e.g. Under-19 Boys A"
                      value={teamName}
                      onChange={e => setTeamName(e.target.value)}
                      className="bg-background focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground block">Age/Categories (Select Multiple)</label>
                    <div className="grid grid-cols-2 gap-2 bg-background p-3 border border-border rounded-md">
                      {CATEGORY_OPTIONS.map(cat => (
                        <label key={cat} className="flex items-center gap-2 text-sm text-foreground cursor-pointer select-none">
                          <input 
                            type="checkbox"
                            checked={teamCategories.includes(cat)}
                            onChange={() => handleToggleCategory(cat, false)}
                            className="rounded border-border text-primary focus:ring-primary"
                          />
                          {cat}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-border">
                  <Button type="button" variant="outline" onClick={() => setShowTeamForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Add Team
                  </Button>
                </div>
              </form>
            </div>
          )}

          {editingTeam && (
            <div className="bg-muted/30 p-6 rounded-2xl border border-primary/20 max-w-lg">
              <div className="flex justify-between items-center mb-4 border-b border-border pb-2">
                <h4 className="font-bold text-foreground">Edit Team</h4>
                <button onClick={() => setEditingTeam(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleUpdateTeam} className="space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Team Name</label>
                    <Input 
                      placeholder="e.g. Under-19 Boys A"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className="bg-background focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground block">Age/Categories (Select Multiple)</label>
                    <div className="grid grid-cols-2 gap-2 bg-background p-3 border border-border rounded-md">
                      {CATEGORY_OPTIONS.map(cat => (
                        <label key={cat} className="flex items-center gap-2 text-sm text-foreground cursor-pointer select-none">
                          <input 
                            type="checkbox"
                            checked={editCategories.includes(cat)}
                            onChange={() => handleToggleCategory(cat, true)}
                            className="rounded border-border text-primary focus:ring-primary"
                          />
                          {cat}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-border">
                  <Button type="button" variant="outline" onClick={() => setEditingTeam(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          )}

          {teams.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-2xl bg-muted/5">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h4 className="font-bold text-foreground">No Teams Registered</h4>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-1">
                Add a club team to start seeding players into tournament matches.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map(team => (
                <div key={team.id} className="p-5 rounded-2xl border border-border bg-card hover:border-primary/10 transition-colors flex flex-col justify-between h-40">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-lg text-foreground">{team.name}</h4>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button 
                          onClick={() => handleStartEditTeam(team)} 
                          className="p-1 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                          title="Edit Team"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteTeam(team.id)} 
                          className="p-1 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                          title="Delete Team"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(team.categories && team.categories.length > 0 ? team.categories : [team.category || 'General']).map((cat: string) => (
                        <span key={cat} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-semibold">{cat}</span>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Members: {team.members?.length || 0} Registered</p>
                  </div>
                  <div className="border-t border-border pt-3 mt-3 flex justify-between items-center text-xs">
                    <span className="text-green-500 font-medium flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> {team.status}
                    </span>
                    <span className="text-muted-foreground">{new Date(team.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex justify-between items-center pb-1">
            <div>
              <h3 className="text-xl font-bold text-foreground">Transfer Requests</h3>
              <p className="text-sm text-muted-foreground">Manage incoming and outgoing player transfers.</p>
            </div>
            {!showTransferForm && (
              <Button onClick={() => setShowTransferForm(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <ArrowRightLeft className="w-4 h-4 mr-2" /> Request Transfer
              </Button>
            )}
          </div>

          {showTransferForm && (
            <div className="bg-muted/30 p-6 rounded-2xl border border-primary/20 max-w-lg mb-6">
              <div className="flex justify-between items-center mb-4 border-b border-border pb-2">
                <h4 className="font-bold text-foreground">Request Player Transfer</h4>
                <button onClick={() => setShowTransferForm(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleInitiateTransfer} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">Select Player</label>
                  <select
                    value={selectedPlayerId}
                    onChange={e => setSelectedPlayerId(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">-- Choose Player --</option>
                    {allPlayers.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.email})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedPlayerId && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/50 p-3 rounded-lg border border-border text-xs">
                    <div>
                      <span className="text-muted-foreground block">Current Organization:</span>
                      <strong className="text-foreground">{fromOrgName}</strong>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Transferring To:</span>
                      <strong className="text-primary">{org.name}</strong>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">Reason / Comments</label>
                  <Input 
                    placeholder="e.g. Joining squad training session"
                    value={transferReason}
                    onChange={e => setTransferReason(e.target.value)}
                    className="bg-background focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-border">
                  <Button type="button" variant="outline" onClick={() => setShowTransferForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Initiate Transfer
                  </Button>
                </div>
              </form>
            </div>
          )}

          {transfers.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-2xl bg-muted/5">
              <ArrowRightLeft className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h4 className="font-bold text-foreground">No Transfers Recorded</h4>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-1">
                Initiate a player transfer request to pull registered players into your club.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-border rounded-xl bg-card shadow-sm">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground uppercase text-[10px] tracking-wider font-semibold border-b border-border">
                  <tr>
                    <th className="px-6 py-3.5">Player</th>
                    <th className="px-6 py-3.5">From Club</th>
                    <th className="px-6 py-3.5">To Club</th>
                    <th className="px-6 py-3.5">Date</th>
                    <th className="px-6 py-3.5">Reason</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {transfers.map((t) => (
                    <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-semibold text-foreground">
                        <div>{t.playerName}</div>
                        <div className="text-[11px] font-normal text-muted-foreground">{t.playerEmail}</div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{t.fromOrgName}</td>
                      <td className="px-6 py-4 font-medium text-foreground">{t.toOrgName}</td>
                      <td className="px-6 py-4 text-muted-foreground">{new Date(t.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 italic text-muted-foreground max-w-[200px] truncate" title={t.reason}>
                        {t.reason || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-semibold",
                          t.status === 'Pending' && "bg-amber-500/20 text-amber-600 dark:text-amber-400",
                          t.status === 'Approved' && "bg-green-500/20 text-green-600 dark:text-green-400",
                          t.status === 'Rejected' && "bg-red-500/20 text-red-600 dark:text-red-400"
                        )}>
                          {t.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {t.status === 'Pending' && t.toOrgId === orgId && (
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleUpdateTransferStatus(t.id, 'Approved')} 
                              className="px-2.5 py-1 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded transition-colors cursor-pointer"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleUpdateTransferStatus(t.id, 'Rejected')} 
                              className="px-2.5 py-1 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded transition-colors cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
