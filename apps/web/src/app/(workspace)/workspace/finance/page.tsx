'use client';

import React, { useEffect, useState } from 'react';
import { 
  BarChart4, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowUpRight,
  ArrowRightLeft,
  DollarSign,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function FinanceDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchFinanceData = async () => {
    try {
      const res = await fetch('/api/finance/dashboard');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      toast.error('Failed to load finance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground animate-pulse">Loading finance dashboard...</div>;
  }

  const summary = data?.summary || {
    totalRevenue: 0,
    pendingAmount: 0,
    successfulCount: 0,
    pendingCount: 0,
    rejectedCount: 0,
    totalCount: 0
  };

  const payments = data?.payments || [];
  const chartData = data?.chartData || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-10 text-left max-w-6xl">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
          <BarChart4 className="w-8 h-8 text-primary" /> Finance Dashboard
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Central command for Revenue, KPIs, and Settlements.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card rounded-2xl p-6 border border-border shadow-lg flex items-center justify-between">
          <div>
            <h3 className="text-muted-foreground text-sm font-semibold">Total Revenue</h3>
            <p className="text-3xl font-extrabold text-foreground mt-1">₹{summary.totalRevenue.toLocaleString()}</p>
            <span className="text-[10px] text-green-500 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> +12.4% from last week
            </span>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border shadow-lg flex items-center justify-between">
          <div>
            <h3 className="text-muted-foreground text-sm font-semibold">Pending Approvals</h3>
            <p className="text-3xl font-extrabold text-foreground mt-1">₹{summary.pendingAmount.toLocaleString()}</p>
            <span className="text-[10px] text-amber-500 font-medium flex items-center gap-1 mt-1">
              <Clock className="w-3.5 h-3.5" /> {summary.pendingCount} pending verification
            </span>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border shadow-lg flex items-center justify-between">
          <div>
            <h3 className="text-muted-foreground text-sm font-semibold">Approved Payments</h3>
            <p className="text-3xl font-extrabold text-foreground mt-1">{summary.successfulCount}</p>
            <span className="text-[10px] text-green-500 font-medium flex items-center gap-1 mt-1">
              <CheckCircle className="w-3.5 h-3.5" /> Successful transactions
            </span>
          </div>
          <div className="p-3 bg-green-500/10 rounded-xl text-green-500">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border shadow-lg flex items-center justify-between">
          <div>
            <h3 className="text-muted-foreground text-sm font-semibold">Total Payments</h3>
            <p className="text-3xl font-extrabold text-foreground mt-1">{summary.totalCount}</p>
            <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1 mt-1">
              <ArrowRightLeft className="w-3.5 h-3.5" /> All registration efforts
            </span>
          </div>
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <ArrowRightLeft className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-card rounded-2xl p-6 border border-border shadow-lg">
        <h3 className="text-lg font-bold text-foreground mb-4">Revenue Trend</h3>
        <div className="flex items-end gap-3 h-48 pt-4">
          {chartData.map((day: any, idx: number) => {
            const maxVal = Math.max(...chartData.map((d: any) => d.amount)) || 1;
            const percent = (day.amount / maxVal) * 100;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div 
                  className="w-full bg-primary/20 hover:bg-primary rounded-t transition-all duration-300 relative group"
                  style={{ height: `${percent}%` }}
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded border border-border opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg z-10">
                    ₹{day.amount.toLocaleString()}
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground tracking-wider">{day.date}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Navigation and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions list */}
        <div className="lg:col-span-2 bg-card rounded-2xl p-6 border border-border shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-foreground">Recent Transactions</h3>
              <Link href="/workspace/finance/transactions">
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/90">
                  View All <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            {payments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No transactions recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {payments.slice(0, 5).map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between p-3 border border-border rounded-xl bg-muted/10">
                    <div>
                      <p className="font-semibold text-sm text-foreground">{p.playerName}</p>
                      <p className="text-xs text-muted-foreground">{p.tournamentName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-foreground">₹{p.amount}</p>
                      <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-semibold mt-1 ${
                        p.status === 'APPROVED' ? 'bg-green-500/20 text-green-500' :
                        p.status === 'PENDING' ? 'bg-amber-500/20 text-amber-500' :
                        'bg-red-500/20 text-red-500'
                      }`}>
                        {p.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Links Menu */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Quick Links</h3>
            <div className="space-y-2.5">
              <Link href="/workspace/finance/transactions" className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/10 hover:border-primary/30 transition-colors">
                <span className="text-sm font-semibold text-foreground">Verify Payments</span>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
              </Link>
              <Link href="/workspace/finance/coupons" className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/10 hover:border-primary/30 transition-colors">
                <span className="text-sm font-semibold text-foreground">Create Coupons</span>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
              </Link>
              <Link href="/workspace/finance/settlements" className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/10 hover:border-primary/30 transition-colors">
                <span className="text-sm font-semibold text-foreground">Payout Settlements</span>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
