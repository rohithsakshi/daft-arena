import React from 'react';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export default function UnavailablePage() {
  return (
    <main className="min-h-screen bg-background relative flex items-center justify-center p-6">
      {/* Background Ornaments */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-rose-900/10 to-transparent -z-10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-600/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center shadow-2xl">
        <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-8 h-8 text-rose-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mb-4">
          Role Temporarily Unavailable
        </h1>
        
        <p className="text-muted-foreground mb-8">
          The platform role associated with your account is currently disabled for maintenance or upgrades. Please check back later.
        </p>

        <div className="flex flex-col gap-3">
          <Link 
            href="/login" 
            className="w-full py-2.5 px-4 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg transition-colors"
          >
            Return to Login
          </Link>
          <Link 
            href="/" 
            className="w-full py-2.5 px-4 bg-secondary hover:bg-secondary/80 text-foreground font-medium rounded-lg transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
