/* ADMIN-ORGANIZATION REMOVED — entire flow commented out below. Do not delete.

'use client';

import React, { useEffect, useState } from 'react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Shield, Plus, Mail, MapPin, ExternalLink, X, Building } from 'lucide-react';
import { WidgetContainer } from '@/components/shared/WidgetContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Link from 'next/link';

export default function OrganizationsPage() {
  const [orgs, setOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [type, setType] = useState<'Club' | 'Academy' | 'District' | 'State' | 'National'>('Club');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const fetchOrgs = () => {
    setLoading(true);
    fetch('/api/organizations')
      .then((r) => r.json())
      .then((data) => {
        setOrgs(data);
      })
      .catch(() => {
        toast.error('Failed to load organizations.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrgs();
  }, []);

  const handleAddOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error('Please fill in Name and Contact Email.');
      return;
    }

    try {
      const response = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          type,
          contactEmail: email,
          address,
          status: 'Approved',
        }),
      });

      if (response.ok) {
        toast.success('Organization added successfully!');
        setName('');
        setEmail('');
        setAddress('');
        setShowForm(false);
        fetchOrgs();
      } else {
        toast.error('Failed to create organization.');
      }
    } catch {
      toast.error('Network error. Please try again.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 max-w-6xl text-left">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <SectionHeader
          title="Organizations"
          description="Manage connected clubs, academies, and internal structures."
          icon={Shield}
        />
        {orgs.length > 0 && !showForm && (
          <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground self-start sm:self-auto">
            <Plus className="w-4 h-4 mr-2" /> Add Organization
          </Button>
        )}
      </div>

      {showForm && (
        <CardForm
          onSubmit={handleAddOrg}
          onCancel={() => setShowForm(false)}
          name={name}
          setName={setName}
          type={type}
          setType={setType}
          email={email}
          setEmail={setEmail}
          address={address}
          setAddress={setAddress}
        />
      )}

      {loading ? (
        <div className="text-center text-muted-foreground py-12 animate-pulse">Loading connected organizations...</div>
      ) : orgs.length === 0 ? (
        <WidgetContainer className="p-12 text-center flex flex-col items-center justify-center border-dashed bg-card/40">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-primary opacity-80" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1">Organizations Center</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
            You currently have no organizations linked. Add a new organization to start managing members and roles.
          </p>
          {!showForm && (
            <button 
              onClick={() => setShowForm(true)} 
              className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl transition-colors active:scale-95 cursor-pointer"
            >
              Add Organization
            </button>
          )}
        </WidgetContainer>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orgs.map((org) => (
            <WidgetContainer key={org.id} className="p-6 flex flex-col justify-between h-48 border border-border bg-card hover:border-primary/20" hoverEffect glowEffect>
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-foreground truncate max-w-[180px]">{org.name}</h4>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-semibold">{org.type}</span>
                    </div>
                  </div>
                </div>
                
                {org.address && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-3">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="truncate">{org.address}</span>
                  </p>
                )}
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1.5">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="truncate">{org.contactEmail}</span>
                </p>
              </div>

              <div className="mt-4">
                <Link href={`/workspace/organizations/${org.id}`} className="w-full">
                  <Button size="sm" className="w-full bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20">
                    <ExternalLink className="w-3.5 h-3.5 mr-2" /> Manage Organization
                  </Button>
                </Link>
              </div>
            </WidgetContainer>
          ))}
        </div>
      )}
    </div>
  );
}

interface CardFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  name: string;
  setName: (v: string) => void;
  type: 'Club' | 'Academy' | 'District' | 'State' | 'National';
  setType: (v: 'Club' | 'Academy' | 'District' | 'State' | 'National') => void;
  email: string;
  setEmail: (v: string) => void;
  address: string;
  setAddress: (v: string) => void;
}

function CardForm({
  onSubmit,
  onCancel,
  name,
  setName,
  type,
  setType,
  email,
  setEmail,
  address,
  setAddress,
}: CardFormProps) {
  return (
    <WidgetContainer className="p-6 border border-violet-500/20 bg-card/20 max-w-xl">
      <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
        <h4 className="font-bold text-lg text-foreground">Add New Organization</h4>
        <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </button>
      </div>
      <form onSubmit={onSubmit} className="space-y-4 text-left">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Organization Name</label>
            <Input
              placeholder="e.g. Apex Badminton Club"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Organization Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-3 py-2 bg-background border border-white/10 rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              <option value="Club">Club</option>
              <option value="Academy">Academy</option>
              <option value="District">District</option>
              <option value="State">State</option>
              <option value="National">National</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground">Contact Email</label>
          <Input
            placeholder="e.g. contact@apexclub.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-background focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground">Address / Location</label>
          <Input
            placeholder="e.g. 5th Court, Downtown Sports Complex"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="bg-background focus:outline-none"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white">
            Create Organization
          </Button>
        </div>
      </form>
    </WidgetContainer>
  );
}

*/

// Temporarily removed — page returns null until re-enabled
export default function OrganizationsPage() {
  return null;
}
