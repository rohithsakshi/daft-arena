import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function SuspendedPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-900 border border-rose-500/20 rounded-3xl p-8 text-center shadow-2xl">
        <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Account Suspended</h1>
        <p className="text-zinc-400 mb-8">
          Your organization's subscription has expired or been suspended. Please contact DAFT Labs to renew your license and restore access to your tournaments.
        </p>
        <Link 
          href="/login" 
          className="block w-full py-3 bg-zinc-800 text-white rounded-xl font-semibold hover:bg-zinc-700 transition-colors"
        >
          Return to Login
        </Link>
      </div>
    </div>
  );
}
