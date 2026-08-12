'use client';

import React, { useState } from 'react';
import { 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Link from 'next/link';

export default function RefundManagementPage() {
  const [refunds, setRefunds] = useState<any[]>([
    {
      id: 'REF-3001',
      playerName: 'Rishi Rao',
      playerEmail: 'rishi.rao391@example.com',
      tournamentName: 'VIP Badminton Singles Championship',
      amount: 1500,
      reason: 'Medical injury during training session',
      date: '2026-08-11',
      status: 'Pending'
    },
    {
      id: 'REF-3002',
      playerName: 'Rohit Sharma',
      playerEmail: 'rohit.sharma@example.com',
      tournamentName: 'Coimbatore District League',
      amount: 2000,
      reason: 'Clash with university exams schedule',
      date: '2026-08-10',
      status: 'Approved'
    },
    {
      id: 'REF-3003',
      playerName: 'Sakshi Singh',
      playerEmail: 'sakshi.s@example.com',
      tournamentName: 'VIP Badminton Singles Championship',
      amount: 1500,
      reason: 'Accidental double registration payment',
      date: '2026-08-09',
      status: 'Rejected'
    }
  ]);

  const handleUpdateStatus = (id: string, status: 'Approved' | 'Rejected') => {
    setRefunds(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    toast.success(`Refund request ${id} ${status.toLowerCase()} successfully!`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-10 text-left max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
            <RotateCcw className="w-8 h-8 text-primary" /> Refund Management
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Review, approve, and track participant refunds.</p>
        </div>
        <Link href="/workspace/finance">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      {/* Refunds Table */}
      <div className="overflow-x-auto border border-border rounded-xl bg-card shadow-lg">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground uppercase text-[10px] tracking-wider font-semibold border-b border-border">
            <tr>
              <th className="px-6 py-3.5">Refund ID</th>
              <th className="px-6 py-3.5">Player</th>
              <th className="px-6 py-3.5">Tournament</th>
              <th className="px-6 py-3.5">Amount</th>
              <th className="px-6 py-3.5">Reason</th>
              <th className="px-6 py-3.5">Request Date</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {refunds.map((r) => (
              <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 font-mono font-semibold text-primary">{r.id}</td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-foreground">{r.playerName}</div>
                  <div className="text-[11px] text-muted-foreground">{r.playerEmail}</div>
                </td>
                <td className="px-6 py-4 font-medium text-foreground">{r.tournamentName}</td>
                <td className="px-6 py-4 font-bold text-foreground">₹{r.amount}</td>
                <td className="px-6 py-4 italic text-muted-foreground max-w-[200px] truncate" title={r.reason}>
                  {r.reason}
                </td>
                <td className="px-6 py-4 text-muted-foreground">{new Date(r.date).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                    r.status === 'Approved' ? 'bg-green-500/20 text-green-500' :
                    r.status === 'Pending' ? 'bg-amber-500/20 text-amber-500' :
                    'bg-red-500/20 text-red-500'
                  }`}>
                    {r.status === 'Approved' && <CheckCircle className="w-3 h-3" />}
                    {r.status === 'Pending' && <Clock className="w-3 h-3" />}
                    {r.status === 'Rejected' && <XCircle className="w-3 h-3" />}
                    {r.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {r.status === 'Pending' && (
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleUpdateStatus(r.id, 'Approved')} 
                        className="px-2.5 py-1 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded transition-colors cursor-pointer"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(r.id, 'Rejected')} 
                        className="px-2.5 py-1 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded transition-colors cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
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
