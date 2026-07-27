import React from 'react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { CreditCard, Check, X, Eye } from 'lucide-react';
import { PaymentRepository } from '@/modules/finance/repositories/payment.repository';
import { WidgetContainer } from '@/components/shared/WidgetContainer';

export const metadata = {
  title: 'Payment Verification | Admin Workspace',
};

export const dynamic = 'force-dynamic';

export default async function AdminPaymentsPage() {
  const paymentRepo = new PaymentRepository();
  const payments = await paymentRepo.findPending(); // we can list all later, but pending first

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <SectionHeader
        title="Payment Verification"
        description="Verify manual UPI payments and approve registrations."
        icon={CreditCard}
      />

      <WidgetContainer className="p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Pending Payments</h3>
        
        {payments.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground text-sm">
            No pending payments to verify.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase bg-black/40 text-muted-foreground border-b border-white/10">
                <tr>
                  <th className="px-4 py-3">Player ID</th>
                  <th className="px-4 py-3">Tournament ID</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">UTR</th>
                  <th className="px-4 py-3">Screenshot</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-medium">{p.playerId}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.tournamentId}</td>
                    <td className="px-4 py-3 text-violet-400 font-bold">${p.amount}</td>
                    <td className="px-4 py-3 font-mono">{p.utr}</td>
                    <td className="px-4 py-3">
                      {p.screenshotUrl ? (
                        <a href={p.screenshotUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-emerald-400 hover:underline">
                          <Eye className="w-3 h-3" /> View
                        </a>
                      ) : (
                        <span className="text-muted-foreground">None</span>
                      )}
                    </td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <form action="/api/payments/approve" method="POST">
                        <input type="hidden" name="paymentId" value={p.id} />
                        <button type="submit" className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500/30">
                          <Check className="w-4 h-4" />
                        </button>
                      </form>
                      <form action="/api/payments/reject" method="POST">
                        <input type="hidden" name="paymentId" value={p.id} />
                        <button type="submit" className="p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30">
                          <X className="w-4 h-4" />
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </WidgetContainer>
    </div>
  );
}
