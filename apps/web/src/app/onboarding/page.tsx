'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    location: '',
    sport: 'Badminton',
    bio: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to save profile');
      
      toast.success('Profile completed!', { description: 'Welcome to DAFT Arena.' });
      
      // Force reload to re-run middleware and get updated JWT
      window.location.href = '/workspace';
    } catch (err: any) {
      toast.error('Error', { description: err.message });
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card/50 backdrop-blur-md border border-border/50 rounded-2xl p-8 shadow-2xl">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-foreground">
          {step === 1 ? 'Complete your Profile' : 'Customize your Experience'}
        </h2>
        <span className="text-sm text-muted-foreground font-mono">Step {step} of 2</span>
      </div>

      <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
        
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                name="phone" 
                placeholder="+1 (555) 000-0000" 
                value={formData.phone} 
                onChange={handleChange} 
                required 
                className="h-12 bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">City / Location</Label>
              <Input 
                id="location" 
                name="location" 
                placeholder="New York, NY" 
                value={formData.location} 
                onChange={handleChange} 
                required 
                className="h-12 bg-background/50"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="sport">Primary Sport</Label>
              <select 
                id="sport" 
                name="sport" 
                value={formData.sport} 
                onChange={handleChange} 
                className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Badminton">Badminton</option>
                <option value="Tennis">Tennis</option>
                <option value="Pickleball">Pickleball</option>
                <option value="Table Tennis">Table Tennis</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio / Short Description (Optional)</Label>
              <Input 
                id="bio" 
                name="bio" 
                placeholder="Tell us a bit about yourself..." 
                value={formData.bio} 
                onChange={handleChange} 
                className="h-12 bg-background/50"
              />
            </div>
          </div>
        )}

        <div className="flex justify-between mt-10 pt-6 border-t border-border/50">
          {step > 1 ? (
            <Button type="button" variant="outline" onClick={handleBack} disabled={isLoading} className="h-12 px-6">
              Back
            </Button>
          ) : (
            <div />
          )}
          
          <Button type="submit" disabled={isLoading} className="h-12 px-8 bg-violet-600 hover:bg-violet-700 text-white">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (step === 1 ? 'Next Step' : 'Complete Setup')}
          </Button>
        </div>
      </form>
    </div>
  );
}
