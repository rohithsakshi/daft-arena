// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { Transaction, Invoice } from '@/modules/player/types';
import { TransactionCard } from '@/modules/player/components/TransactionCard';
import { InvoiceCard } from '@/modules/player/components/InvoiceCard';
import { DataList } from '@/components/shared/DataList';
import { DashboardGrid } from '@/components/shared/DashboardGrid';
import { WidgetContainer } from '@/components/shared/WidgetContainer';
import { CreditCard, Eye, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TransactionItem {
  invoice: Invoice;
  transaction: Transaction;
}

interface TransactionsWorkspaceClientProps {
  initialTransactions: TransactionItem[];
}

export function TransactionsWorkspaceClient({ initialTransactions }: TransactionsWorkspaceClientProps) {
  const [items, setItems] = useState<TransactionItem[]>(initialTransactions);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const activeItem = items[selectedIndex];

  const handleRefundRequest = (idx: number) => {
    const check = confirm('Request a refund for this transaction? The organizer compliance rules will apply.');
    if (!check) return;

    setItems(prev => prev.map((item, i) => {
      if (i !== idx) return item;
      return {
        ...item,
        transaction: {
          ...item.transaction,
          refundStatus: 'REQUESTED'
        }
      };
    }));
    alert('Refund request submitted successfully.');
  };

  return (
    <DashboardGrid cols="sidebar">
      {/* Left List Pane */}
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Recent Transactions</h3>
        <DataList
          items={items}
          layout="list"
          emptyTitle="No Transaction Records"
          emptyDescription="You haven't transacted for any tournament registrations yet."
          emptyIcon={CreditCard}
          renderItem={(item) => {
            const idx = items.findIndex(i => i.transaction.id === item.transaction.id);
            const isSelected = idx === selectedIndex;
            return (
              <div className="relative group/tx">
                <div
                  onClick={() => setSelectedIndex(idx)}
                  className={cn(
                    'cursor-pointer rounded-2xl border transition-all',
                    isSelected ? 'border-violet-500 bg-violet-500/5' : 'border-transparent'
                  )}
                >
                  <TransactionCard transaction={item.transaction} invoice={item.invoice} />
                </div>

                {/* Refund action handle shortcut */}
                {item.transaction.refundStatus === 'NOT_APPLICABLE' && item.invoice.status === 'PAID' && (
                  <div className="absolute right-4 bottom-2 opacity-0 group-hover/tx:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRefundRequest(idx);
                      }}
                      className="text-[10px] h-7 bg-white/5 border border-white/5 text-blue-400 hover:bg-blue-500/10 rounded-lg font-bold gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Request Refund
                    </Button>
                  </div>
                )}
              </div>
            );
          }}
        />
      </div>

      {/* Right Detailed Receipt Pane */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
          <Eye className="w-3.5 h-3.5 text-violet-400" />
          Receipt View
        </h3>
        {activeItem ? (
          <InvoiceCard invoice={activeItem.invoice} />
        ) : (
          <WidgetContainer className="p-8 text-center text-xs text-muted-foreground italic border-dashed">
            Select a transaction record to inspect its invoice receipt.
          </WidgetContainer>
        )}
      </div>
    </DashboardGrid>
  );
}
