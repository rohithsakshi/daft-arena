'use client';

import React, { useEffect, useState } from 'react';
import { 
  Settings, 
  CreditCard, 
  ShieldAlert, 
  HelpCircle, 
  Globe, 
  Mail, 
  Phone, 
  DollarSign, 
  Save, 
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function AdminSystemSettingsPage() {
  const [settings, setSettings] = useState({
    platformName: '',
    supportEmail: '',
    supportPhone: '',
    registrationFeeDefault: 500
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings/general')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Failed to load system configurations.');
        setLoading(false);
      });
  }, []);

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings/general', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        toast.success('General system configurations saved successfully!');
      } else {
        toast.error('Failed to save general configurations.');
      }
    } catch {
      toast.error('Connection error saving configurations.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground animate-pulse">Loading system settings...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-10 text-left max-w-6xl">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
          <Settings className="w-8 h-8 text-primary" /> System Settings
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Global configuration, API gateways, and role permissions.</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: General System Settings Form */}
        <div className="lg:col-span-2 bg-card rounded-2xl p-6 border border-border shadow-lg space-y-6">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Globe className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">General Configuration</h3>
          </div>
          <form onSubmit={handleSaveGeneral} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Platform Name</label>
                <Input 
                  placeholder="e.g. DAFT Arena"
                  value={settings.platformName}
                  onChange={e => setSettings({ ...settings, platformName: e.target.value })}
                  className="bg-background focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Default Entry Fee (₹)</label>
                <Input 
                  type="number"
                  placeholder="500"
                  value={settings.registrationFeeDefault}
                  onChange={e => setSettings({ ...settings, registrationFeeDefault: Number(e.target.value) })}
                  className="bg-background focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Support Contact Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="support@daftarena.com"
                    value={settings.supportEmail}
                    onChange={e => setSettings({ ...settings, supportEmail: e.target.value })}
                    className="pl-10 bg-background focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Support Helpline Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="+91 9999999999"
                    value={settings.supportPhone}
                    onChange={e => setSettings({ ...settings, supportPhone: e.target.value })}
                    className="pl-10 bg-background focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-border">
              <Button type="submit" disabled={saving} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {saving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Settings</>}
              </Button>
            </div>
          </form>
        </div>

        {/* Right Side: Quick Links cards */}
        <div className="space-y-6">
          <Link href="/workspace/tournament-admin/settings/payments/upi" className="block group">
            <div className="p-6 bg-card border border-border rounded-2xl shadow-lg hover:border-primary/30 transition-colors space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-105 transition-transform">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                  UPI Configuration <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h4>
                <p className="text-xs text-muted-foreground mt-1">Configure UPI IDs and manual QR codes for registrations.</p>
              </div>
            </div>
          </Link>

          <Link href="/workspace/tournament-admin/settings/roles" className="block group">
            <div className="p-6 bg-card border border-border rounded-2xl shadow-lg hover:border-primary/30 transition-colors space-y-4">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                  Role Feature Flags <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h4>
                <p className="text-xs text-muted-foreground mt-1">Enable or disable roles and assign global IAM permissions.</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
