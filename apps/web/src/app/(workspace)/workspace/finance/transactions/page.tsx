'use client';

import React, { useEffect, useState } from 'react';
import { 
  CreditCard, 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock,
  Eye,
  X,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Link from 'next/link';

export default function TransactionsLedgerPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewScreenshotUrl, setViewScreenshotUrl] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/finance/dashboard');
      if (res.ok) {
        const json = await res.json();
        setPayments(json.payments || []);
      }
    } catch {
      toast.error('Failed to load transaction history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleUpdateStatus = async (paymentId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const url = status === 'APPROVED' ? '/api/payments/approve' : '/api/payments/reject';
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId })
      });

      if (res.ok) {
        toast.success(`Transaction successfully ${status.toLowerCase()}!`);
        fetchTransactions();
      } else {
        toast.error('Failed to update transaction status.');
      }
    } catch {
      toast.error('Error updating transaction.');
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground animate-pulse">Loading transaction ledger...</div>;
  }

  // Filter payments
  const filteredPayments = payments.filter((p: any) => {
    const matchesSearch = 
      p.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.playerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.utr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tournamentName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-10 text-left max-w-6xl relative">
      {/* Screenshot Viewer Modal */}
      {viewScreenshotUrl && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border p-4 rounded-2xl max-w-2xl w-full shadow-2xl relative animate-in zoom-in duration-200">
            <button 
              onClick={() => setViewScreenshotUrl(null)} 
              className="absolute top-4 right-4 p-2 rounded-full bg-muted/80 text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h4 className="font-bold text-lg text-foreground mb-4">Proof of Payment</h4>
            <div className="max-h-[70vh] overflow-auto flex justify-center bg-black/10 rounded-xl p-2 border border-border">
              <img src={viewScreenshotUrl} alt="UTR Receipt Proof" className="max-w-full h-auto object-contain rounded-lg" />
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
            <CreditCard className="w-8 h-8 text-primary" /> Transaction Ledger
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Verify, search, and manage participant registrations.</p>
        </div>
        <Link href="/workspace/finance">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by Player, Email, Tournament, or UTR..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 bg-background focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary min-w-[150px]"
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Ledger Table */}
      {filteredPayments.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-2xl bg-muted/5">
          <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h4 className="font-bold text-foreground">No Transactions Found</h4>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-1">
            Try adjusting your search criteria or filters.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-border rounded-xl bg-card shadow-lg">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground uppercase text-[10px] tracking-wider font-semibold border-b border-border">
              <tr>
                <th className="px-6 py-3.5">Participant</th>
                <th className="px-6 py-3.5">Tournament</th>
                <th className="px-6 py-3.5">UTR Reference</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5">Receipt</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-foreground">
                    <div>{p.playerName}</div>
                    <div className="text-[11px] font-normal text-muted-foreground">{p.playerEmail}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground">{p.tournamentName}</td>
                  <td className="px-6 py-4 font-mono text-xs">{p.utr}</td>
                  <td className="px-6 py-4 font-bold text-foreground">₹{p.amount}</td>
                  <td className="px-6 py-4">
                    {p.screenshotUrl ? (
                      <button 
                        onClick={() => setViewScreenshotUrl(p.screenshotUrl)}
                        className="flex items-center gap-1 text-xs text-primary hover:underline font-semibold cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Proof
                      </button>
                    ) : (
                      <span className="text-xs text-muted-foreground">None provided</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                      p.status === 'APPROVED' ? 'bg-green-500/20 text-green-500' :
                      p.status === 'PENDING' ? 'bg-amber-500/20 text-amber-500' :
                      'bg-red-500/20 text-red-500'
                    }`}>
                      {p.status === 'APPROVED' && <CheckCircle className="w-3 h-3" />}
                      {p.status === 'PENDING' && <Clock className="w-3 h-3" />}
                      {p.status === 'REJECTED' && <XCircle className="w-3 h-3" />}
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {p.status === 'PENDING' && (
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleUpdateStatus(p.id, 'APPROVED')} 
                          className="px-2.5 py-1 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded transition-colors cursor-pointer"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(p.id, 'REJECTED')} 
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
      )}
    </div>
  );
}
