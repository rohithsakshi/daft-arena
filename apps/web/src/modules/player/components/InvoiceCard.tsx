'use client';

import React from 'react';
import { Invoice } from '../types';
import { WidgetContainer } from '@/components/shared/WidgetContainer';
import { Button } from '@/components/ui/button';
import { FileText, Printer, ShieldCheck, Receipt } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InvoiceCardProps {
  invoice: Invoice;
  className?: string;
}

export function InvoiceCard({ invoice, className }: InvoiceCardProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <WidgetContainer className={cn('p-6 bg-card/60 backdrop-blur-md max-w-lg mx-auto shadow-2xl relative border-white/10', className)}>
      {/* Brand & Badge */}
      <div className="flex justify-between items-start pb-4 border-b border-white/5 mb-6">
        <div className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-violet-400" />
          <div>
            <h4 className="text-sm font-black tracking-widest text-foreground uppercase">DAFT Arena</h4>
            <p className="text-[9px] text-muted-foreground uppercase">Sanctioned Receipt</p>
          </div>
        </div>
        <span className={cn(
          'px-2 py-0.5 text-[9px] font-bold rounded border uppercase tracking-wider',
          invoice.status === 'PAID'
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            : invoice.status === 'FAILED'
            ? 'bg-red-500/10 text-red-400 border-red-500/20'
            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
        )}>
          {invoice.status}
        </span>
      </div>

      {/* Meta grid */}
      <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground mb-6">
        <div>
          <p className="text-[9px] uppercase tracking-wider mb-0.5">Invoice Number</p>
          <p className="text-foreground font-semibold font-mono">{invoice.id}</p>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-wider mb-0.5">Registration Ref</p>
          <p className="text-foreground font-semibold font-mono">{invoice.registrationId}</p>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-wider mb-0.5">Date Issued</p>
          <p className="text-foreground font-semibold">
            {new Date(invoice.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-wider mb-0.5">Currency</p>
          <p className="text-foreground font-semibold uppercase">{invoice.currency}</p>
        </div>
      </div>

      {/* Bill summary breakdown */}
      <div className="space-y-3 pt-4 border-t border-white/5 mb-6 text-xs">
        <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-bold mb-2">Invoice summary</p>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tournament Base Fees</span>
          <span className="text-foreground">${invoice.baseAmount}</span>
        </div>

        {invoice.discountAmount > 0 && (
          <div className="flex justify-between text-emerald-400 font-medium">
            <span>Coupon Discount {invoice.couponCode ? `(${invoice.couponCode})` : ''}</span>
            <span>-${invoice.discountAmount}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-muted-foreground">State Organizing Taxes (5%)</span>
          <span className="text-foreground">${invoice.taxAmount}</span>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-white/8 font-bold text-sm">
          <span className="text-foreground">Total Transacted Fee</span>
          <span className="text-lg text-violet-400">${invoice.totalAmount}</span>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/5 flex-wrap">
        <span className="flex items-center gap-1 text-[9px] text-muted-foreground">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Verified Official Payment Receipt
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrint}
          className="border-white/10 text-xs gap-1.5 rounded-xl ml-auto"
        >
          <Printer className="w-3.5 h-3.5" />
          Print Receipt
        </Button>
      </div>
    </WidgetContainer>
  );
}
