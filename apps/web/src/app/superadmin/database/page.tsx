import React from 'react';

export default function PlaceholderPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
      <div className="w-16 h-16 bg-zinc-800/50 rounded-2xl flex items-center justify-center mb-4">
        <span className="text-zinc-500 text-2xl">🚧</span>
      </div>
      <h1 className="text-2xl font-bold text-white capitalize">database Module</h1>
      <p className="text-zinc-400 max-w-md">
        This module is currently under construction. The backend architecture for multi-tenant database is being provisioned by DAFT Labs.
      </p>
    </div>
  );
}
