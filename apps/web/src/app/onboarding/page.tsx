'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import Select from 'react-select';

const SPORT_OPTIONS = [
  { value: 'Badminton', label: 'Badminton' },
  { value: 'Tennis', label: 'Tennis' },
  { value: 'Pickleball', label: 'Pickleball' },
  { value: 'Table Tennis', label: 'Table Tennis' }
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  const [formData, setFormData] = useState({
    phone: '',
    location: '',
    sport: [] as any[],
    bio: ''
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const { data } = await res.json();
          setFormData(prev => ({
            ...prev,
            phone: data?.phone || '',
          }));
          if (data?.phone) {
            setStep(2); // Auto advance to step 2 if phone is already set (from registration)
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsFetching(false);
      }
    }
    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        body: JSON.stringify({
          ...formData,
          sport: formData.sport.map(s => s.value)
        })
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

  if (isFetching) {
    return <div className="flex h-[300px] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-violet-500" /></div>;
  }

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
                className="h-12 bg-background/50"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="sport">Primary Sports</Label>
              <Select
                isMulti
                name="sport"
                options={SPORT_OPTIONS}
                className="text-black"
                value={formData.sport}
                onChange={(selected) => setFormData({ ...formData, sport: selected as any[] })}
                placeholder="Select your sports..."
              />
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
            <Button type="button" variant="outline" onClick={handleBack} disabled={isLoading} className="h-12 px-6 text-white">
              Back
            </Button>
          ) : (
            <div />
          )}
          
          <Button type="submit" disabled={isLoading} className="h-12 px-8 bg-violet-600 hover:bg-violet-700 text-white border-none">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (step === 1 ? 'Next Step' : 'Complete Setup')}
          </Button>
        </div>
      </form>
    </div>
  );
}

