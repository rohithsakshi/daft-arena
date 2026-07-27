'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, CheckCircle, ArrowRight } from 'lucide-react';

export default function OrganizationSetupWizard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    logoUrl: '',
    address: '',
    sports: 'Badminton, Tennis', // Placeholder string for simplicity
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/organizations/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          sports: formData.sports.split(',').map(s => s.trim())
        })
      });
      if (res.ok) {
        // Redirect to admin dashboard
        router.push('/workspace/tournament-admin');
      } else {
        alert('Setup failed');
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome to DAFT Arena</h1>
            <p className="text-zinc-400 text-sm">Let's configure your organization.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Logo URL (Optional)</label>
            <input 
              type="text" 
              value={formData.logoUrl}
              onChange={e => setFormData({ ...formData, logoUrl: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Headquarters Address</label>
            <textarea 
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="123 Arena Street..."
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Supported Sports (comma separated)</label>
            <input 
              type="text" 
              value={formData.sports}
              onChange={e => setFormData({ ...formData, sports: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="Badminton, Tennis, Cricket"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-black font-bold rounded-xl p-3 hover:bg-emerald-400 transition-colors"
          >
            {loading ? 'Configuring...' : 'Complete Setup'}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
}
