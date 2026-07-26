'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2, Upload, QrCode } from 'lucide-react';

export default function UPISettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [settings, setSettings] = useState({
    upiId: '',
    accountName: '',
    qrImageUrl: '',
    isEnabled: true,
    paymentInstructions: '',
    supportContact: '',
  });

  useEffect(() => {
    fetch('/api/admin/settings/upi')
      .then(res => res.json())
      .then(data => {
        if (data.settings) {
          setSettings(data.settings);
        }
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/admin/settings/upi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      alert('UPI Settings saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'qr');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setSettings({ ...settings, qrImageUrl: data.url });
      } else {
        alert('Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">UPI Configuration</h1>
        <p className="text-muted-foreground mt-2">Manage the manual UPI payment details shown to players during checkout.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manual Payment Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Enable Manual UPI Payments</Label>
              <p className="text-sm text-muted-foreground">Toggle whether manual UPI is offered at checkout.</p>
            </div>
            <Switch 
              checked={settings.isEnabled} 
              onCheckedChange={(v) => setSettings({ ...settings, isEnabled: v })} 
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>UPI ID</Label>
              <Input 
                value={settings.upiId} 
                onChange={e => setSettings({...settings, upiId: e.target.value})} 
                placeholder="e.g. daftarena@okicici" 
              />
            </div>
            <div className="space-y-2">
              <Label>Account Name</Label>
              <Input 
                value={settings.accountName} 
                onChange={e => setSettings({...settings, accountName: e.target.value})} 
                placeholder="DAFT Arena" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>QR Code Image</Label>
            <div className="flex items-start gap-6">
              {settings.qrImageUrl ? (
                <div className="border rounded p-2">
                  <img src={settings.qrImageUrl} alt="UPI QR" className="w-32 h-32 object-contain" />
                </div>
              ) : (
                <div className="border rounded flex items-center justify-center w-32 h-32 bg-muted">
                  <QrCode className="w-8 h-8 text-muted-foreground opacity-50" />
                </div>
              )}
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById('qr-upload')?.click()}
                  disabled={uploading}
                >
                  {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                  Upload New QR Code
                </Button>
                <input id="qr-upload" type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB. This will be uploaded to Cloudinary.</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Payment Instructions</Label>
            <Textarea 
              value={settings.paymentInstructions} 
              onChange={e => setSettings({...settings, paymentInstructions: e.target.value})} 
              placeholder="Instructions for the player..." 
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Support Contact</Label>
            <Input 
              value={settings.supportContact} 
              onChange={e => setSettings({...settings, supportContact: e.target.value})} 
              placeholder="Email or phone number for payment disputes" 
            />
          </div>
          
          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Configuration
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
