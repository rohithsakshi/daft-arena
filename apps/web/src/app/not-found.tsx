import React from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="bg-card/20 backdrop-blur-md rounded-2xl border border-white/10 p-8 max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">404 - Not Found</h1>
          <p className="text-muted-foreground">The resource you requested could not be found.</p>
        </div>
        <Link href="/" className="inline-flex items-center justify-center bg-violet-600 hover:bg-violet-700 text-white font-medium px-6 py-3 rounded-xl transition-colors">
          Return Home
        </Link>
      </div>
    </div>
  );
}
