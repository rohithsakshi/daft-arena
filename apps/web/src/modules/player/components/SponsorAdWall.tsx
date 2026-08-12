'use client';
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ALL_MOCK_ADS = [
  { id: 1, type: 'IMAGE', url: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop', duration: 5, sponsorName: 'Nike Sports', sport: 'Fitness' },
  { id: 2, type: 'IMAGE', url: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=2069&auto=format&fit=crop', duration: 4, sponsorName: 'Gatorade', sport: 'Tennis' },
  { id: 3, type: 'IMAGE', url: 'https://images.unsplash.com/photo-1627627256672-027a4613d028?q=80&w=2074&auto=format&fit=crop', duration: 4, sponsorName: 'Yonex', sport: 'Badminton' },
  { id: 4, type: 'IMAGE', url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2000&auto=format&fit=crop', duration: 4, sponsorName: 'MRF', sport: 'Cricket' },
];

export function SponsorAdWall({ playerSports = [] }: { playerSports?: string[] }) {
  // Filter ads to only show ones relevant to the player's sports, or generic ones
  const filteredAds = ALL_MOCK_ADS.filter(ad => 
    playerSports.includes(ad.sport) || ad.sport === 'Fitness' || ad.sport === 'All'
  );
  
  const activeAds = filteredAds.length > 0 ? filteredAds : ALL_MOCK_ADS; // Fallback to all if none match

  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Show every time for demonstration purposes (in production, we'd check sessionStorage)
    setIsVisible(true);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const currentAd = activeAds[currentIndex];
    if (!currentAd) {
      handleClose();
      return;
    }

    setProgress(0);
    const intervalTime = 50; // Update every 50ms
    const totalSteps = (currentAd.duration * 1000) / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setProgress((currentStep / totalSteps) * 100);

      if (currentStep >= totalSteps) {
        clearInterval(timer);
        if (currentIndex < activeAds.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          handleClose();
        }
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [currentIndex, isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('hasSeenSponsorAds', 'true');
    document.body.style.overflow = '';
  };

  if (!isVisible) return null;

  const currentAd = activeAds[currentIndex];
  // Allowed to skip ONLY after the first ad!
  const canSkip = currentIndex > 0; 

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center animate-in fade-in duration-500">
      {/* Top Bar */}
      <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
        <div className="text-white">
          <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-1">Sponsored Message</p>
          <p className="font-bold text-lg">{currentAd.sponsorName}</p>
        </div>
        
        {canSkip ? (
          <Button 
            onClick={handleClose}
            variant="ghost" 
            className="text-white hover:bg-white/20 rounded-full px-6 transition-all border border-white/20"
          >
            Skip to Dashboard <X className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <div className="text-xs font-bold text-white/50 uppercase tracking-widest px-4 py-2 border border-white/10 rounded-full">
            Ad {currentIndex + 1} of {activeAds.length}
          </div>
        )}
      </div>

      {/* Media */}
      <div className="relative w-full h-full">
        {currentAd.type === 'IMAGE' ? (
          <img 
            src={currentAd.url} 
            alt={currentAd.sponsorName}
            className="w-full h-full object-cover opacity-80"
          />
        ) : null}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 inset-x-0 h-1.5 bg-white/10">
        <div 
          className="h-full bg-violet-500 transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
