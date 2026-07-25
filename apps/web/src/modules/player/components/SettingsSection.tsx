'use client';

import React, { useState } from 'react';
import { WidgetContainer } from '@/components/shared/WidgetContainer';
import { Button } from '@/components/ui/button';
import { Globe, Sun, Moon, Bell, Eye, Laptop, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsSectionProps {
  className?: string;
}

export function SettingsSection({ className }: SettingsSectionProps) {
  const [lang, setLang] = useState('en');
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');
  const [notifs, setNotifs] = useState({
    matchSchedule: true,
    paymentReceipts: true,
    organizerAnnouncements: false,
  });
  const [privacy, setPrivacy] = useState({
    publicStats: true,
    showEmail: false,
  });

  const handleDeleteAccount = () => {
    const check = confirm('WARNING: Are you sure you want to request account deletion? This action is irreversible.');
    if (check) {
      alert('Your account deletion request has been submitted to the DAFT Arena compliance team.');
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Preferences Section */}
      <WidgetContainer className="p-6">
        <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-violet-400" />
          General Preferences
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Language selection */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Interface Language
            </label>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-white/10 bg-black/25 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            >
              <option value="en">English (US)</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>

          {/* Theme selection */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Display Theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'dark', label: 'Dark', Icon: Moon },
                { id: 'light', label: 'Light', Icon: Sun },
                { id: 'system', label: 'System', Icon: Laptop }
              ].map((t) => {
                const ActiveIcon = t.Icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id as unknown)}
                    className={cn(
                      'h-10 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all',
                      theme === t.id
                        ? 'border-violet-500 bg-violet-500/5 text-violet-400'
                        : 'border-white/5 bg-black/10 text-muted-foreground hover:bg-white/5'
                    )}
                  >
                    <ActiveIcon className="w-4 h-4" />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </WidgetContainer>

      {/* Notifications Section */}
      <WidgetContainer className="p-6">
        <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-violet-400" />
          Notification Toggles
        </h3>

        <div className="space-y-4">
          {[
            { id: 'matchSchedule', label: 'Match Schedule & Court Changes', desc: 'Receive instant alerts for scheduled times or court relocations.' },
            { id: 'paymentReceipts', label: 'Payment Receipts & Checkout Logs', desc: 'Get invoice copies and verification checks immediately.' },
            { id: 'organizerAnnouncements', label: 'Local Organizer Announcements', desc: 'Hear news and rules updates from tournament administrators.' }
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3 p-3 bg-black/25 border border-white/5 rounded-xl">
              <div>
                <p className="text-xs font-bold text-foreground">{item.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
              <input
                type="checkbox"
                checked={notifs[item.id as keyof typeof notifs]}
                onChange={(e) => setNotifs(prev => ({ ...prev, [item.id]: e.target.checked }))}
                className="w-4 h-4 rounded border-white/10 bg-black text-violet-600 focus:ring-violet-500"
              />
            </div>
          ))}
        </div>
      </WidgetContainer>

      {/* Privacy Section */}
      <WidgetContainer className="p-6">
        <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5 text-violet-400" />
          Workspace Visibility
        </h3>

        <div className="space-y-4">
          {[
            { id: 'publicStats', label: 'Public Profile Visibility', desc: 'Let other competitors search and view your ranking points and match history.' },
            { id: 'showEmail', label: 'Display Contact Coordinates', desc: 'Show email to verified partners and bracket organizers.' }
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3 p-3 bg-black/25 border border-white/5 rounded-xl">
              <div>
                <p className="text-xs font-bold text-foreground">{item.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
              <input
                type="checkbox"
                checked={privacy[item.id as keyof typeof privacy]}
                onChange={(e) => setPrivacy(prev => ({ ...prev, [item.id]: e.target.checked }))}
                className="w-4 h-4 rounded border-white/10 bg-black text-violet-600 focus:ring-violet-500"
              />
            </div>
          ))}
        </div>
      </WidgetContainer>

      {/* Account Deletion Danger Area */}
      <WidgetContainer className="p-6 border-red-500/20 bg-red-500/5">
        <h3 className="text-base font-bold text-red-400 mb-2 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5" />
          Danger Zone
        </h3>
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
          Requesting account deletion will archive your registration history and permanently remove all accumulated DAFT Arena ranking points.
        </p>
        <Button
          variant="destructive"
          onClick={handleDeleteAccount}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs h-9 rounded-xl shadow-md"
        >
          Delete Account
        </Button>
      </WidgetContainer>
    </div>
  );
}
