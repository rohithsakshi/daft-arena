'use client';

import React from 'react';
import { Transaction, Invoice } from '../types';
import { WidgetContainer } from '@/components/shared/WidgetContainer';
import { CreditCard, CheckCircle, AlertCircle, RefreshCw, Landmark, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransactionCardProps {
  transaction: Transaction;
  invoice: Invoice;
  className?: string;
}

export function TransactionCard({ transaction, invoice, className }: TransactionCardProps) {
  const isSuccess = transaction.status === 'SUCCESS';
  const isFailed = transaction.status === 'FAILED';
  const isRefunded = invoice.status === 'REFUNDED';

  const methodIcons = {
    CARD: CreditCard,
    UPI: Send,
    NETBANKING: Landmark
  };

  const MethodIcon = methodIcons[transaction.method] ?? CreditCard;

  return (
    <WidgetContainer className={cn('p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-white/5 bg-card/50 hover:border-white/10 transition-all', className)}>
      <div className="flex items-start gap-3 min-w-0">
        <div className={cn(
          'p-2.5 rounded-xl border flex-shrink-0 mt-0.5',
          isSuccess
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            : isFailed
            ? 'bg-red-500/10 border-red-500/20 text-red-400'
            : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
        )}>
          <MethodIcon className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-bold text-xs text-foreground">
              Payment via {transaction.method}
            </h4>
            <span className={cn(
              'px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider',
              isSuccess ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
            )}>
              {transaction.status}
            </span>
            {isRefunded && (
              <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-blue-500/15 text-blue-400 flex items-center gap-0.5">
                <RefreshCw className="w-2 h-2 animate-spin-slow" />
                Refunded
              </span>
            )}
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            Ref: <span className="font-mono text-foreground">{transaction.referenceId}</span> · Invoice: <span className="font-mono">{invoice.id}</span>
          </p>
          <p className="text-[9px] text-muted-foreground mt-0.5">
            {new Date(transaction.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      <div className="text-left sm:text-right flex-shrink-0 self-start sm:self-center">
        <p className="text-sm font-black text-foreground">
          ${transaction.amount}
          <span className="text-[10px] font-normal text-muted-foreground uppercase ml-1">{invoice.currency}</span>
        </p>
        {transaction.refundStatus && transaction.refundStatus !== 'NOT_APPLICABLE' && (
          <p className="text-[9px] font-bold text-blue-400 uppercase tracking-wide mt-0.5">
            Refund: {transaction.refundStatus.replace('_', ' ')}
          </p>
        )}
      </div>
    </WidgetContainer>
  );
}
