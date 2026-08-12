'use client';

import React, { useState } from 'react';
import { 
  Landmark, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Plus, 
  User,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Link from 'next/link';

export default function SettlementCenterPage() {
  const [settlements, setSettlements] = useState<any[]>([
    {
      id: 'SET-99881',
      recipient: 'VIP Badminton Academy',
      type: 'Club/Academy',
      amount: 45000,
      platformFee: 2250,
      netPayout: 42750,
      status: 'Settled',
      date: '2026-08-11',
      reference: 'TXN-918239812A'
    },
    {
      id: 'SET-99882',
      recipient: 'Coimbatore District Badminton Association',
      type: 'District Federation',
      amount: 15000,
      platformFee: 750,
      netPayout: 14250,
      status: 'Processing',
      date: '2026-08-12',
      reference: 'TXN-Pending'
    },
    {
      id: 'SET-99883',
      recipient: 'National Arbiter Panel',
      type: 'Officials Fee',
      amount: 8500,
      platformFee: 0,
      netPayout: 8500,
      status: 'Held',
      date: '2026-08-10',
      reference: 'Hold - Awaiting KYC'
    }
  ]);

  const handleReleasePayout = (id: string) => {
    setSettlements(prev => prev.map(s => s.id === id ? { ...s, status: 'Settled', reference: 'TXN-' + Math.random().toString(36).substring(2, 11).toUpperCase() } : s));
    toast.success(`Payout released successfully for ${id}!`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-10 text-left max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
            <Landmark className="w-8 h-8 text-primary" /> Settlement Center
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Manage payouts, commissions, and platform distributions.</p>
        </div>
        <Link href="/workspace/finance">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      {/* Settlements Table */}
      <div className="overflow-x-auto border border-border rounded-xl bg-card shadow-lg">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground uppercase text-[10px] tracking-wider font-semibold border-b border-border">
            <tr>
              <th className="px-6 py-3.5">Settlement ID</th>
              <th className="px-6 py-3.5">Recipient</th>
              <th className="px-6 py-3.5">Gross Amount</th>
              <th className="px-6 py-3.5">Platform Fee (5%)</th>
              <th className="px-6 py-3.5">Net Payout</th>
              <th className="px-6 py-3.5">Date</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Reference / Payout Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {settlements.map((s) => (
              <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 font-mono font-semibold text-primary">{s.id}</td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-foreground">{s.recipient}</div>
                  <div className="text-[11px] text-muted-foreground">{s.type}</div>
                </td>
                <td className="px-6 py-4 font-medium">₹{s.amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-muted-foreground">₹{s.platformFee.toLocaleString()}</td>
                <td className="px-6 py-4 font-bold text-foreground">₹{s.netPayout.toLocaleString()}</td>
                <td className="px-6 py-4 text-muted-foreground">{new Date(s.date).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                    s.status === 'Settled' ? 'bg-green-500/20 text-green-500' :
                    s.status === 'Processing' ? 'bg-amber-500/20 text-amber-500' :
                    'bg-red-500/20 text-red-500'
                  }`}>
                    {s.status === 'Settled' && <CheckCircle2 className="w-3 h-3" />}
                    {s.status === 'Processing' && <Clock className="w-3 h-3" />}
                    {s.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {s.status !== 'Settled' ? (
                    <button 
                      onClick={() => handleReleasePayout(s.id)}
                      className="px-3 py-1 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 text-xs transition-colors cursor-pointer"
                    >
                      Release Funds
                    </button>
                  ) : (
                    <span className="font-mono text-xs text-muted-foreground">{s.reference}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
