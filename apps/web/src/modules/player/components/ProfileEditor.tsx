// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { PlayerProfile, MedicalDetails, EmergencyContact } from '../types';
import { Button } from '@/components/ui/button';
import { WidgetContainer } from '@/components/shared/WidgetContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, User, Heart, Shield, ShieldAlert, FileText, Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const SPORT_OPTIONS = [
  { value: 'Badminton', label: 'Badminton' },
  { value: 'Tennis', label: 'Tennis' },
  { value: 'Pickleball', label: 'Pickleball' },
  { value: 'Table Tennis', label: 'Table Tennis' }
];

interface ProfileEditorProps {
  profile: PlayerProfile;
  onSave: (updatedProfile: Partial<PlayerProfile>) => Promise<void>;
  className?: string;
}

export function ProfileEditor({ profile, onSave, className }: ProfileEditorProps) {
  const [activeTab, setActiveTab] = useState('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Forms states
  const [fullName, setFullName] = useState(profile.fullName || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [city, setCity] = useState(profile.city || '');
  const [state, setState] = useState(profile.state || '');
  const [country, setCountry] = useState(profile.country || '');
  const [email, setEmail] = useState(profile.email || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [clubName, setClubName] = useState(profile.clubName || '');
  const [coachName, setCoachName] = useState(profile.coachName || '');
  const [sports, setSports] = useState<string[]>(profile.sports || []);

  const [medical, setMedical] = useState<MedicalDetails>({
    bloodGroup: profile.medicalDetails?.bloodGroup || 'O+',
    allergies: profile.medicalDetails?.allergies || '',
    conditions: profile.medicalDetails?.conditions || '',
    medications: profile.medicalDetails?.medications || ''
  });

  const [emergency, setEmergency] = useState<EmergencyContact>({
    name: profile.emergencyContact?.name || '',
    relation: profile.emergencyContact?.relation || '',
    phone: profile.emergencyContact?.phone || ''
  });

  const handlePersonalSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await onSave({
        fullName,
        bio,
        city,
        state,
        country,
        email,
        phone,
        clubName,
        coachName,
        sports
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleMedicalSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await onSave({
        medicalDetails: medical,
        emergencyContact: emergency
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <WidgetContainer className={cn('p-6', className)}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-white/5 border border-white/5 mb-6 h-10 w-full justify-start">
          <TabsTrigger value="personal" className="text-xs font-semibold gap-1.5 flex-1 md:flex-none">
            <User className="w-3.5 h-3.5" />
            Personal
          </TabsTrigger>
          <TabsTrigger value="medical" className="text-xs font-semibold gap-1.5 flex-1 md:flex-none">
            <Heart className="w-3.5 h-3.5" />
            Medical & Emergency
          </TabsTrigger>
          <TabsTrigger value="documents" className="text-xs font-semibold gap-1.5 flex-1 md:flex-none">
            <FileText className="w-3.5 h-3.5" />
            Documents Verification
          </TabsTrigger>
        </TabsList>

        {/* Personal Form */}
        <TabsContent value="personal" className="space-y-4 focus:outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-white/10 bg-black/25 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-white/10 bg-black/25 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-white/10 bg-black/25 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-white/10 bg-black/25 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Affiliated Club Name</label>
              <input
                type="text"
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-white/10 bg-black/25 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Coach Name</label>
              <input
                type="text"
                value={coachName}
                onChange={(e) => setCoachName(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-white/10 bg-black/25 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              />
            </div>
          </div>

          <div className="pt-2 pb-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Primary Sports</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {SPORT_OPTIONS.map((option) => {
                const isSelected = sports.includes(option.value);
                return (
                  <label key={option.value} className={cn("flex items-center space-x-3 p-2.5 rounded-xl border cursor-pointer transition-all", isSelected ? 'border-violet-500 bg-violet-500/10' : 'border-white/10 bg-black/25 hover:bg-white/5')}>
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500 bg-black" checked={isSelected} onChange={(e) => {
                      if (e.target.checked) setSports([...sports, option.value]);
                      else setSports(sports.filter(s => s !== option.value));
                    }} />
                    <span className="text-xs font-medium text-foreground">{option.label}</span>
                  </label>
                )
              })}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Bio / Description</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-xl border border-white/10 bg-black/25 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handlePersonalSave}
              disabled={isSaving}
              className="bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs h-9 gap-1.5 px-4 rounded-xl shadow-lg shadow-violet-500/20"
            >
              {isSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              ) : saveSuccess ? (
                <Check className="w-3.5 h-3.5 text-white" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              {isSaving ? 'Saving...' : saveSuccess ? 'Saved' : 'Save Details'}
            </Button>
          </div>
        </TabsContent>

        {/* Medical & Emergency Form */}
        <TabsContent value="medical" className="space-y-6 focus:outline-none">
          {/* Medical Information */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground pb-1 border-b border-white/5">
              Medical Credentials
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Blood Group</label>
                <select
                  value={medical.bloodGroup}
                  onChange={(e) => setMedical(prev => ({ ...prev, bloodGroup: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl border border-white/10 bg-black/25 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Known Allergies</label>
                <input
                  type="text"
                  placeholder="e.g. Peanuts, Penicillin..."
                  value={medical.allergies}
                  onChange={(e) => setMedical(prev => ({ ...prev, allergies: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl border border-white/10 bg-black/25 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Medical Conditions</label>
                <input
                  type="text"
                  placeholder="e.g. Asthma, Diabetes..."
                  value={medical.conditions}
                  onChange={(e) => setMedical(prev => ({ ...prev, conditions: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl border border-white/10 bg-black/25 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Current Medications</label>
                <input
                  type="text"
                  placeholder="e.g. Inhaler..."
                  value={medical.medications}
                  onChange={(e) => setMedical(prev => ({ ...prev, medications: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl border border-white/10 bg-black/25 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground pb-1 border-b border-white/5">
              Emergency Contact
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Contact Name</label>
                <input
                  type="text"
                  value={emergency.name}
                  onChange={(e) => setEmergency(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl border border-white/10 bg-black/25 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Relation</label>
                <input
                  type="text"
                  placeholder="Spouse, Parent..."
                  value={emergency.relation}
                  onChange={(e) => setEmergency(prev => ({ ...prev, relation: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl border border-white/10 bg-black/25 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Phone Number</label>
                <input
                  type="text"
                  value={emergency.phone}
                  onChange={(e) => setEmergency(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl border border-white/10 bg-black/25 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleMedicalSave}
              disabled={isSaving}
              className="bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs h-9 gap-1.5 px-4 rounded-xl shadow-lg shadow-violet-500/20"
            >
              {isSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              ) : saveSuccess ? (
                <Check className="w-3.5 h-3.5 text-white" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              {isSaving ? 'Saving...' : saveSuccess ? 'Saved' : 'Save Credentials'}
            </Button>
          </div>
        </TabsContent>

        {/* Documents Verification List */}
        <TabsContent value="documents" className="space-y-4 focus:outline-none">
          <div className="space-y-3">
            {profile.documents && profile.documents.length > 0 ? (
              profile.documents.map((doc, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-black/25 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 text-muted-foreground">
                      <FileText className="w-4 h-4 text-violet-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{doc.title}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">{doc.type}</p>
                    </div>
                  </div>
                  <span className={cn(
                    'px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider',
                    doc.verified
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  )}>
                    {doc.verified ? 'Verified' : 'Pending Verification'}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-xs text-muted-foreground py-8">No documents uploaded yet.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </WidgetContainer>
  );
}
