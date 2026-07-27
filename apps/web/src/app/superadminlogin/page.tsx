'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Loader2, KeyRound, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/superadmin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to authenticate');
      }

      toast.success('Authentication successful. Redirecting to platform...');
      router.push('/superadmin');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Dynamic Backgrounds */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-rose-900/20 to-transparent -z-10" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-3xl -z-10" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay -z-10" />

      <div className="w-full max-w-md px-6">
        <div className="bg-card/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-500 to-violet-500" />
          
          <div className="text-center mb-8">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500 mb-4 ring-1 ring-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">DAFT Labs Platform</h1>
            <p className="text-sm text-zinc-400">Restricted Access. Employees Only.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="name@daftlabs.com"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all text-white placeholder:text-zinc-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Admin Password</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all text-white placeholder:text-zinc-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-rose-600 hover:bg-rose-500 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:shadow-[0_0_30px_rgba(244,63,94,0.5)] border border-rose-500/50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Secure Login'
              )}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-xs text-zinc-500">
              Unauthorized access to this portal is strictly prohibited and monitored. By logging in, you agree to the internal DAFT Labs Security Policies.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
