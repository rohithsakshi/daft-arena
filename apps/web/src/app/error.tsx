'use client';
import React, { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="bg-card/20 backdrop-blur-md rounded-2xl border border-white/10 p-8 max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8 text-yellow-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
          <p className="text-muted-foreground text-sm">We've logged the error and are looking into it.</p>
        </div>
        <button onClick={reset} className="inline-flex items-center justify-center bg-violet-600 hover:bg-violet-700 text-white font-medium px-6 py-3 rounded-xl transition-colors">
          Try Again
        </button>
      </div>
    </div>
  );
}
