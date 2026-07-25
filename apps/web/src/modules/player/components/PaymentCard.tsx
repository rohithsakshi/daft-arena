'use client';

import React, { useState } from 'react';
import { WidgetContainer } from '@/components/shared/WidgetContainer';
import { Button } from '@/components/ui/button';
import { Tag, Sparkles, CreditCard, ShieldCheck, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentCardProps {
  baseFee: number;
  currency: string;
  onPaymentSubmit: (paymentMethod: 'CARD' | 'UPI' | 'NETBANKING', finalBreakdown: {
    baseAmount: number;
    discountAmount: number;
    taxAmount: number;
    totalAmount: number;
    couponCode?: string;
  }) => void;
}

export function PaymentCard({ baseFee, currency, onPaymentSubmit }: PaymentCardProps) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'UPI' | 'NETBANKING'>('CARD');
  const [isProcessing, setIsProcessing] = useState(false);

  const taxAmount = Math.round(baseFee * 0.05 * 100) / 100; // 5% tax

  // Coupon handling
  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'EARLYBIRD') {
      setAppliedCoupon('EARLYBIRD');
      setDiscountAmount(10); // $10 off
    } else if (couponCode.toUpperCase() === 'DAFTARENA') {
      setAppliedCoupon('DAFTARENA');
      setDiscountAmount(Math.round(baseFee * 0.15 * 100) / 100); // 15% off
    } else {
      alert('Invalid coupon code. Try EARLYBIRD or DAFTARENA');
    }
  };

  const finalAmount = Math.max(0, baseFee - discountAmount + taxAmount);

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSubmit(paymentMethod, {
        baseAmount: baseFee,
        discountAmount,
        taxAmount,
        totalAmount: finalAmount,
        couponCode: appliedCoupon || undefined
      });
    }, 1500);
  };

  return (
    <WidgetContainer className="p-6 max-w-md mx-auto space-y-6">
      <div>
        <h3 className="text-lg font-bold text-foreground">Secure Checkout</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Choose your preferred payment method and confirm.</p>
      </div>

      {/* Invoice Details */}
      <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-3">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Base Entry Fee</span>
          <span className="text-foreground">${baseFee} {currency}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-xs text-emerald-400">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Discount ({appliedCoupon})
            </span>
            <span>-${discountAmount} {currency}</span>
          </div>
        )}
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Organizing Tax (5%)</span>
          <span className="text-foreground">${taxAmount} {currency}</span>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-white/5 font-bold">
          <span className="text-sm text-foreground">Amount to Pay</span>
          <span className="text-xl text-violet-400">${finalAmount} {currency}</span>
        </div>
      </div>

      {/* Coupon Field */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Enter promo coupon..."
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-lg border border-white/10 bg-black/20 text-xs text-foreground uppercase focus:outline-none focus:ring-2 focus:ring-violet-500/50"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={applyCoupon}
          className="border-white/10 text-xs"
        >
          Apply
        </Button>
      </div>

      {/* Payment methods selectors */}
      <div className="space-y-2">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Payment Method</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'CARD', label: 'Credit Card' },
            { id: 'UPI', label: 'UPI QR' },
            { id: 'NETBANKING', label: 'Net Banking' }
          ].map((m) => (
            <div
              key={m.id}
              onClick={() => setPaymentMethod(m.id as unknown)}
              className={cn(
                'p-3 rounded-lg border text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1',
                paymentMethod === m.id
                  ? 'border-violet-500 bg-violet-500/5 text-violet-400'
                  : 'border-white/5 bg-black/10 text-muted-foreground hover:bg-white/5'
              )}
            >
              <CreditCard className="w-4 h-4" />
              <span className="text-[10px] font-semibold">{m.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <Button
        onClick={handleCheckout}
        disabled={isProcessing}
        className="w-full h-11 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/20 gap-2"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            Simulating transaction...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4" />
            Pay ${finalAmount} {currency}
          </>
        )}
      </Button>

      <div className="flex items-center gap-1.5 justify-center text-[10px] text-muted-foreground pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Safe & Secure checkout powered by Stripe / Razorpay mock integrations</span>
      </div>
    </WidgetContainer>
  );
}
