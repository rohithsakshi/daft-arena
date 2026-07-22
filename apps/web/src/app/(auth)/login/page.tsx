'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { HeroCard } from '@/components/auth/HeroCard';

import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
type Tab = 'login' | 'register';

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<Tab>('login');
  
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'register') {
      setActiveTab('register');
    } else {
      setActiveTab('login'); // Default
    }
  }, [searchParams]);

  const activeRole = searchParams.get('role');
  const roleDisplay = activeRole === 'admin' ? 'Administrator' : 
                      activeRole === 'sponsor' ? 'Sponsor' : 
                      activeRole === 'player' ? 'Player' : null;

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    
    // Maintain role param in the URL
    const roleParam = activeRole ? `role=${activeRole}` : '';
    const tabParam = tab === 'register' ? 'tab=register' : '';
    
    const params = [tabParam, roleParam].filter(Boolean).join('&');
    const newUrl = params ? `/login?${params}` : '/login';
    
    window.history.pushState({}, '', newUrl);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 min-h-[600px] w-full h-[85vh] max-w-7xl mx-auto">
      {/* Fixed Hero Image Side */}
      <div className="hidden xl:block h-full">
        <HeroCard />
      </div>
      
      {/* Dynamic Content Side */}
      <div className="h-full flex flex-col pt-4 pb-12 relative overflow-hidden">
        
        {/* Optional Portal Header */}
        {roleDisplay && (
          <div className="mb-4 text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-violet-600/10 border border-violet-500/20 text-violet-400 font-medium text-sm">
              {roleDisplay} Portal
            </span>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex items-center justify-center space-x-2 mb-6 bg-card/50 p-1.5 rounded-xl border border-border backdrop-blur-md self-center">
          <button
            onClick={() => handleTabChange('login')}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              activeTab === 'login' 
                ? "bg-primary text-primary-foreground shadow-md" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            Welcome Back
          </button>
          <button
            onClick={() => handleTabChange('register')}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              activeTab === 'register' 
                ? "bg-primary text-primary-foreground shadow-md" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            Create Account
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            {activeTab === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="h-full overflow-y-auto"
              >
                <LoginForm />
              </motion.div>
            )}

            {activeTab === 'register' && (
              <motion.div
                key="register"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <RegisterForm />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="h-[85vh] min-h-[600px] flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
