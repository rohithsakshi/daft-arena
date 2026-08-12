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
  FolderOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Link from 'next/link';

export function OrgDashboard({ orgId }: { orgId: string }) {
  const [org, setOrg] = useState<any>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Team creation states
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamCategory, setTeamCategory] = useState('U-19');

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
    } catch {
      toast.error('Connection error loading organization data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [orgId]);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) {
      toast.error('Please enter a team name.');
      return;
    }

    try {
      const res = await fetch('/api/organizations/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: orgId,
          name: teamName,
          category: teamCategory
        })
      });

      if (res.ok) {
        toast.success('Team created successfully!');
        setTeamName('');
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
          <div className="bg-card rounded-2xl p-6 border border-border shadow-lg flex items-center justify-between">
            <div>
              <h3 className="text-muted-foreground text-sm font-semibold">Active Teams</h3>
              <p className="text-4xl font-extrabold text-foreground mt-1">{teams.length}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-lg flex items-center justify-between">
            <div>
              <h3 className="text-muted-foreground text-sm font-semibold">Transfers Pending</h3>
              <p className="text-4xl font-extrabold text-foreground mt-1">0</p>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400">
              <FolderOpen className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Teams Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-border pb-3">
          <div>
            <h3 className="text-xl font-bold text-foreground">Teams List</h3>
            <p className="text-sm text-muted-foreground">Configure teams, coaches, and rosters for matches.</p>
          </div>
          {!showTeamForm && (
            <Button onClick={() => setShowTeamForm(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Team Name</label>
                  <Input 
                    placeholder="e.g. Under-19 Boys A"
                    value={teamName}
                    onChange={e => setTeamName(e.target.value)}
                    className="bg-background focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Age/Category</label>
                  <select
                    value={teamCategory}
                    onChange={e => setTeamCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-white/10 rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-violet-500"
                  >
                    <option value="U-15">Under-15</option>
                    <option value="U-19">Under-19</option>
                    <option value="Senior">Senior Elite</option>
                    <option value="Veteran">Veteran Masters</option>
                  </select>
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
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-semibold">{team.category}</span>
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
    </div>
  );
}
