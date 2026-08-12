'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Mail, 
  CheckCircle, 
  Clock,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Link from 'next/link';

export default function InvoicingCenterPage() {
  const [invoices, setInvoices] = useState<any[]>([
    {
      id: 'INV-2026-001',
      recipient: 'Rishi Rao',
      email: 'rishi.rao391@example.com',
      description: 'Tournament entry fee: VIP Badminton Singles Championship',
      amount: 1500,
      date: '2026-08-12',
      status: 'Paid'
    },
    {
      id: 'INV-2026-002',
      recipient: 'VIP Badminton Academy',
      email: 'rayaan3535@gmail.com',
      description: 'Monthly Academy Membership Subscription',
      amount: 12000,
      date: '2026-08-11',
      status: 'Paid'
    },
    {
      id: 'INV-2026-003',
      recipient: 'Coimbatore Badminton League Sponsor',
      email: 'sponsor@comleague.com',
      description: 'Tournament Sponsorship Contract - Stage 1',
      amount: 75000,
      date: '2026-08-05',
      status: 'Pending'
    }
  ]);

  const handleDownload = (id: string) => {
    toast.success(`PDF for Invoice ${id} downloaded successfully!`);
  };

  const handleSendEmail = (id: string) => {
    toast.success(`Invoice ${id} has been emailed to the recipient!`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-10 text-left max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
            <FileText className="w-8 h-8 text-primary" /> Invoicing Center
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Generate, download, and email tax-compliant invoices.</p>
        </div>
        <Link href="/workspace/finance">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      {/* Invoices Table */}
      <div className="overflow-x-auto border border-border rounded-xl bg-card shadow-lg">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground uppercase text-[10px] tracking-wider font-semibold border-b border-border">
            <tr>
              <th className="px-6 py-3.5">Invoice ID</th>
              <th className="px-6 py-3.5">Recipient</th>
              <th className="px-6 py-3.5">Description</th>
              <th className="px-6 py-3.5">Amount</th>
              <th className="px-6 py-3.5">Issued Date</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 font-mono font-semibold text-primary">{inv.id}</td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-foreground">{inv.recipient}</div>
                  <div className="text-[11px] text-muted-foreground">{inv.email}</div>
                </td>
                <td className="px-6 py-4 text-muted-foreground max-w-[250px] truncate" title={inv.description}>
                  {inv.description}
                </td>
                <td className="px-6 py-4 font-bold text-foreground">₹{inv.amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-muted-foreground">{new Date(inv.date).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                    inv.status === 'Paid' ? 'bg-green-500/20 text-green-500' : 'bg-amber-500/20 text-amber-500'
                  }`}>
                    {inv.status === 'Paid' && <CheckCircle className="w-3 h-3" />}
                    {inv.status === 'Pending' && <Clock className="w-3 h-3" />}
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleDownload(inv.id)} 
                      className="p-1.5 rounded bg-muted hover:bg-muted/80 text-foreground transition-colors cursor-pointer"
                      title="Download PDF Invoice"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleSendEmail(inv.id)} 
                      className="p-1.5 rounded bg-muted hover:bg-muted/80 text-foreground transition-colors cursor-pointer"
                      title="Email Invoice to Recipient"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
