// @ts-nocheck
'use client';

import React, { useEffect, useState } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users,
  Swords,
  Layers,
  MapPin,
  Shield,
  Search,
  Plus,
  AlertOctagon,
  UserCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function OperationsDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'courts' | 'checkins' | 'incidents' | 'officials'>('overview');
  
  // Tab-specific states
  const [courts, setCourts] = useState<any[]>([]);
  const [checkIns, setCheckIns] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [officials, setOfficials] = useState<any[]>([]);
  
  // Interactive UI states
  const [searchQuery, setSearchQuery] = useState('');
  const [showIncidentForm, setShowIncidentForm] = useState(false);
  const [incidentType, setIncidentType] = useState('Medical');
  const [incidentSeverity, setIncidentSeverity] = useState('Medium');
  const [incidentDescription, setIncidentDescription] = useState('');

  const fetchDashboard = () => {
    setLoading(true);
    fetch('/api/operations/dashboard?tournamentId=current')
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          setData(result.data);
        } else {
          toast.error(result.error || 'Failed to fetch dashboard metrics.');
        }
      })
      .catch(() => toast.error('Connection error fetching metrics.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    if (activeTab === 'courts') {
      fetch('/api/operations/courts?tournamentId=current')
        .then(res => res.json())
        .then(res => res.success ? setCourts(res.data) : toast.error('Failed to load courts.'))
        .catch(() => toast.error('Error loading courts.'));
    } else if (activeTab === 'checkins') {
      fetch('/api/operations/check-ins?tournamentId=current')
        .then(res => res.json())
        .then(res => res.success ? setCheckIns(res.data) : toast.error('Failed to load check-ins.'))
        .catch(() => toast.error('Error loading check-ins.'));
    } else if (activeTab === 'incidents') {
      fetch('/api/operations/incidents?tournamentId=current')
        .then(res => res.json())
        .then(res => res.success ? setIncidents(res.data) : toast.error('Failed to load incidents.'))
        .catch(() => toast.error('Error loading incidents.'));
    } else if (activeTab === 'officials') {
      fetch('/api/operations/officials?tournamentId=current')
        .then(res => res.json())
        .then(res => res.success ? setOfficials(res.data) : toast.error('Failed to load officials.'))
        .catch(() => toast.error('Error loading officials.'));
    }
  }, [activeTab]);

  const handleCreateIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentDescription.trim()) {
      toast.error('Please enter incident description.');
      return;
    }

    try {
      const response = await fetch('/api/operations/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tournamentId: 'current',
          type: incidentType,
          severity: incidentSeverity,
          description: incidentDescription,
          status: 'Open',
          reporterId: 'admin'
        })
      });
      const result = await response.json();
      if (result.success) {
        toast.success('Incident reported successfully.');
        setIncidents(prev => [result.data, ...prev]);
        setIncidentDescription('');
        setShowIncidentForm(false);
        // Refresh dashboard metrics count
        fetchDashboard();
      } else {
        toast.error(result.error || 'Failed to submit incident.');
      }
    } catch {
      toast.error('Network error creating incident.');
    }
  };

  const handleToggleCheckIn = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'CheckedIn' ? 'Pending' : 'CheckedIn';
    setCheckIns(prev => 
      prev.map(c => c.id === id ? { ...c, status: nextStatus, checkInTime: nextStatus === 'CheckedIn' ? new Date().toISOString() : undefined } : c)
    );
    toast.success(`Check-in status updated successfully.`);
  };

  const handleToggleCourt = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Available' ? 'Maintenance' : 'Available';
    setCourts(prev =>
      prev.map(c => c.id === id ? { ...c, status: nextStatus } : c)
    );
    toast.success(`Court status updated to ${nextStatus}.`);
  };

  if (loading && !data) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading Operations Center...</div>;
  }

  if (!data) {
    return (
      <div className="p-8 text-center max-w-md mx-auto space-y-4">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
        <h3 className="text-xl font-bold">Failed to load operations dashboard</h3>
        <p className="text-sm text-muted-foreground">The operations service layer is currently unreachable or database seeds are missing.</p>
        <Button onClick={fetchDashboard}>Retry Connection</Button>
      </div>
    );
  }

  const filteredPlayers = checkIns.filter(p => 
    p.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Operations Center</h2>
          <p className="text-sm text-muted-foreground">Live tournament command center, official scheduling, and court allocation.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-red-500/20 text-red-400 hover:bg-red-500/10" onClick={() => toast.success('Emergency broadcast sent to all officials.')}>
            Emergency Broadcast
          </Button>
          <Button className="bg-violet-600 hover:bg-violet-700 text-white" onClick={() => { setActiveTab('incidents'); setShowIncidentForm(true); }}>
            <Plus className="w-4 h-4 mr-2" /> Report Incident
          </Button>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex gap-2 border-b border-white/5 pb-1 overflow-x-auto">
        {(['overview', 'courts', 'checkins', 'incidents', 'officials'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-all capitalize whitespace-nowrap ${
              activeTab === tab 
                ? 'border-violet-500 text-violet-400' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab === 'checkins' ? 'Player Check-ins' : tab}
          </button>
        ))}
      </div>

      {/* Main Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 text-left">
            <Card className="bg-card/40 border-white/5 backdrop-blur-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Live Matches</CardTitle>
                <Activity className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.liveMatchesCount}</div>
                <p className="text-xs text-muted-foreground">Currently active on courts</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/40 border-white/5 backdrop-blur-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Delayed Matches</CardTitle>
                <Clock className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.delayedMatchesCount}</div>
                <p className="text-xs text-muted-foreground">Requires assignment / behind schedule</p>
              </CardContent>
            </Card>

            <Card className="bg-card/40 border-white/5 backdrop-blur-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                <Swords className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.upcomingEventsCount}</div>
                <p className="text-xs text-muted-foreground">Scheduled in next 2 hours</p>
              </CardContent>
            </Card>

            <Card className="bg-card/40 border-white/5 backdrop-blur-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Registered / Approved</CardTitle>
                <CheckCircle className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.checkedInPlayersCount}</div>
                <p className="text-xs text-muted-foreground">Participants approved in active draws</p>
              </CardContent>
            </Card>

            <Card className="bg-card/40 border-white/5 backdrop-blur-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.openIncidentsCount}</div>
                <p className="text-xs text-muted-foreground">Require onsite resolution</p>
              </CardContent>
            </Card>

            <Card className="bg-card/40 border-white/5 backdrop-blur-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Officials</CardTitle>
                <Users className="h-4 w-4 text-zinc-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.activeOfficialsCount}</div>
                <p className="text-xs text-muted-foreground">Umpires and Referees checked in</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 text-left">
            <Card className="bg-card/20 border-white/5">
              <CardHeader>
                <CardTitle className="text-lg">Recent Incidents</CardTitle>
                <CardDescription>Logs and safety reports raised during matches.</CardDescription>
              </CardHeader>
              <CardContent>
                {data.recentIncidents.length === 0 ? (
                  <div className="text-center py-6 text-sm text-muted-foreground">No active incidents reported.</div>
                ) : (
                  <div className="space-y-4">
                    {data.recentIncidents.map((inc: any) => (
                      <div key={inc.id} className="flex flex-col space-y-1 p-3 border border-white/10 rounded-lg">
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-sm">{inc.type}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            inc.status === 'Open' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                          }`}>
                            {inc.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{inc.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card/20 border-white/5">
              <CardHeader>
                <CardTitle className="text-lg">Active Officials</CardTitle>
                <CardDescription>Umpires and referees assigned to current courts.</CardDescription>
              </CardHeader>
              <CardContent>
                {data.activeOfficials.length === 0 ? (
                  <div className="text-center py-6 text-sm text-muted-foreground">No officials checked in yet.</div>
                ) : (
                  <div className="space-y-4">
                    {data.activeOfficials.map((off: any) => (
                      <div key={off.id} className="flex justify-between items-center p-3 border border-white/10 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs">
                            {off.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{off.name}</p>
                            <p className="text-xs text-muted-foreground">{off.role}</p>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          off.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {off.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'courts' && (
        <Card className="bg-card/20 border-white/5">
          <CardHeader className="text-left">
            <CardTitle>Courts Manager</CardTitle>
            <CardDescription>View live status of venue courts and allocate matches.</CardDescription>
          </CardHeader>
          <CardContent>
            {courts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No playing areas or courts defined. Allocate courts in your organization settings.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-left">
                {courts.map((court: any) => (
                  <div key={court.id} className={`p-4 border rounded-xl flex flex-col justify-between h-40 transition-colors ${
                    court.status === 'Occupied' 
                      ? 'border-purple-500/30 bg-purple-950/10' 
                      : court.status === 'Maintenance' 
                        ? 'border-amber-500/30 bg-amber-950/10' 
                        : 'border-white/5 bg-zinc-900/20'
                  }`}>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-lg">{court.name}</h4>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                          court.status === 'Occupied'
                            ? 'bg-purple-500/20 text-purple-400'
                            : court.status === 'Maintenance'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-green-500/20 text-green-400'
                        }`}>
                          {court.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {court.status === 'Occupied' 
                          ? (court.currentMatchTitle || 'Active Match in Progress')
                          : 'No active match'
                        }
                      </p>
                      {court.nextMatchTime && (
                        <p className="text-xs text-zinc-500 mt-1">Next: {court.nextMatchTime}</p>
                      )}
                    </div>
                    <div className="mt-4">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full text-xs"
                        disabled={court.status === 'Occupied'}
                        onClick={() => handleToggleCourt(court.id, court.status)}
                      >
                        {court.status === 'Maintenance' ? 'Complete Maintenance' : 'Set to Maintenance'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'checkins' && (
        <Card className="bg-card/20 border-white/5 text-left">
          <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <CardTitle>Player Onsite Check-ins</CardTitle>
              <CardDescription>Verify player attendance and issue credentials.</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search players..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 bg-background/50 animate-none focus:outline-none"
              />
            </div>
          </CardHeader>
          <CardContent>
            {filteredPlayers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No players found matching query.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-muted-foreground">
                      <th className="py-3 px-4 font-semibold">Participant Name</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                      <th className="py-3 px-4 font-semibold">Check-in Time</th>
                      <th className="py-3 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlayers.map((player: any) => (
                      <tr key={player.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 font-medium">{player.participantName}</td>
                        <td className="py-3 px-4">
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                            player.status === 'CheckedIn'
                              ? 'bg-green-500/20 text-green-400'
                              : player.status === 'Late'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-zinc-800 text-zinc-400'
                          }`}>
                            {player.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground text-xs">
                          {player.checkInTime ? new Date(player.checkInTime).toLocaleTimeString() : '—'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button 
                            size="sm" 
                            variant="secondary"
                            onClick={() => handleToggleCheckIn(player.id, player.status)}
                          >
                            <UserCheck className="w-4 h-4 mr-2" />
                            {player.status === 'CheckedIn' ? 'Undo Check-in' : 'Check In'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'incidents' && (
        <div className="space-y-6 text-left">
          {showIncidentForm && (
            <Card className="bg-card/30 border-violet-500/30">
              <CardHeader>
                <CardTitle>Raise Incident Report</CardTitle>
                <CardDescription>Document and tag any medical, court, or equipment issues.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateIncident} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground">Incident Type</label>
                      <select 
                        value={incidentType}
                        onChange={e => setIncidentType(e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-white/10 rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-violet-500"
                      >
                        <option>Medical</option>
                        <option>Equipment</option>
                        <option>Conduct</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground">Severity</label>
                      <select 
                        value={incidentSeverity}
                        onChange={e => setIncidentSeverity(e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-white/10 rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-violet-500"
                      >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                        <option>Critical</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Description</label>
                    <Input 
                      placeholder="Details of the incident (e.g. Player A injured on Court 3)..."
                      value={incidentDescription}
                      onChange={e => setIncidentDescription(e.target.value)}
                      className="bg-background focus:outline-none"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" onClick={() => setShowIncidentForm(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white">
                      Submit Incident
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <Card className="bg-card/20 border-white/5">
            <CardHeader>
              <CardTitle>Onsite Incidents Register</CardTitle>
              <CardDescription>Safety and operational incident logs.</CardDescription>
            </CardHeader>
            <CardContent>
              {incidents.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">No incidents logged. Great job keeping the tournament safe!</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-muted-foreground">
                        <th className="py-3 px-4 font-semibold">Incident Type</th>
                        <th className="py-3 px-4 font-semibold">Severity</th>
                        <th className="py-3 px-4 font-semibold">Status</th>
                        <th className="py-3 px-4 font-semibold">Description</th>
                        <th className="py-3 px-4 font-semibold text-right">Logged Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {incidents.map((inc: any) => (
                        <tr key={inc.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4 font-medium">{inc.type}</td>
                          <td className="py-3 px-4">
                            <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                              inc.severity === 'Critical' || inc.severity === 'High'
                                ? 'bg-red-500/20 text-red-400'
                                : inc.severity === 'Medium'
                                  ? 'bg-amber-500/20 text-amber-400'
                                  : 'bg-blue-500/20 text-blue-400'
                            }`}>
                              {inc.severity}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                              inc.status === 'Open'
                                ? 'bg-red-950 text-red-400 border border-red-500/30'
                                : 'bg-green-950 text-green-400 border border-green-500/30'
                            }`}>
                              {inc.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">{inc.description}</td>
                          <td className="py-3 px-4 text-right text-muted-foreground text-xs">
                            {new Date(inc.createdAt).toLocaleTimeString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'officials' && (
        <Card className="bg-card/20 border-white/5 text-left">
          <CardHeader>
            <CardTitle>Officials Rostering</CardTitle>
            <CardDescription>Track umpire shifts, assignment details, and performance ratings.</CardDescription>
          </CardHeader>
          <CardContent>
            {officials.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No officials currently assigned. Assign officials in Umpire settings.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-muted-foreground">
                      <th className="py-3 px-4 font-semibold">Official Name</th>
                      <th className="py-3 px-4 font-semibold">Designated Role</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                      <th className="py-3 px-4 font-semibold">Umpire Rating</th>
                      <th className="py-3 px-4 font-semibold text-right">Current Assignment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {officials.map((off: any) => (
                      <tr key={off.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 font-medium">{off.name}</td>
                        <td className="py-3 px-4 text-muted-foreground">{off.role}</td>
                        <td className="py-3 px-4">
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                            off.status === 'Active'
                              ? 'bg-green-500/20 text-green-400'
                              : off.status === 'Assigned'
                                ? 'bg-purple-500/20 text-purple-400'
                                : 'bg-zinc-800 text-zinc-400'
                          }`}>
                            {off.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {off.rating ? `⭐ ${off.rating}` : '—'}
                        </td>
                        <td className="py-3 px-4 text-right text-muted-foreground">
                          {off.currentAssignmentId ? `Match #${off.currentAssignmentId}` : 'None'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
