// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
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
    utr?: string;
    screenshotUrl?: string;
  }) => void;
}

export function PaymentCard({ baseFee, currency, onPaymentSubmit }: PaymentCardProps) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'UPI' | 'NETBANKING'>('CARD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [upiSettings, setUpiSettings] = useState<any>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    fetch('/api/settings/upi')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.enabled) {
          setUpiSettings(data.settings);
        }
        setLoadingSettings(false);
      })
      .catch((err) => {
        console.error('Failed to load UPI settings', err);
        setLoadingSettings(false);
      });
  }, []);

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

  const [utr, setUtr] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'payments');
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setScreenshotUrl(data.url);
      } else {
        alert('Upload failed');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCheckout = () => {
    if (paymentMethod === 'UPI' && !utr.trim()) {
      alert('Please enter your UTR/Reference number for UPI payments.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSubmit(paymentMethod, {
        baseAmount: baseFee,
        discountAmount,
        taxAmount,
        totalAmount: finalAmount,
        couponCode: appliedCoupon || undefined,
        // @ts-ignore
        utr: paymentMethod === 'UPI' ? utr : undefined,
        // @ts-ignore
        screenshotUrl: paymentMethod === 'UPI' ? screenshotUrl : undefined
      });
    }, 1500);
  };

  const availableMethods = [
    { id: 'CARD', label: 'Credit Card' },
    ...(upiSettings ? [{ id: 'UPI', label: 'UPI QR' }] : []),
    { id: 'NETBANKING', label: 'Net Banking' }
  ];

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
        {loadingSettings ? (
          <div className="flex justify-center p-4"><Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {availableMethods.map((m) => (
              <div
                key={m.id}
                onClick={() => setPaymentMethod(m.id as any)}
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
        )}
      </div>

      {paymentMethod === 'UPI' && upiSettings && (
        <div className="p-4 rounded-xl border border-violet-500/20 bg-violet-500/5 space-y-4">
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">{upiSettings.paymentInstructions || 'Scan QR to pay using any UPI app'}</p>
            {upiSettings.qrImageUrl ? (
              <img src={upiSettings.qrImageUrl} alt="UPI QR" className="w-32 h-32 mx-auto rounded-xl object-contain bg-white p-1" />
            ) : (
              <div className="w-32 h-32 bg-white rounded-xl mx-auto flex items-center justify-center">
                <span className="text-xs text-black font-bold">QR_PLACEHOLDER</span>
              </div>
            )}
            <p className="text-xs font-mono bg-black/40 py-1 px-2 rounded-lg inline-block border border-white/10">{upiSettings.upiId}</p>
            <p className="text-[10px] text-muted-foreground">{upiSettings.accountName}</p>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">12-digit UTR / Reference No *</label>
              <input 
                type="text" 
                value={utr}
                onChange={(e) => setUtr(e.target.value)}
                placeholder="e.g. 312345678901"
                className="w-full h-9 px-3 rounded-lg border border-white/10 bg-black/20 text-xs focus:ring-2 focus:ring-violet-500/50 outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Payment Screenshot (Optional)</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full text-xs text-muted-foreground file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-white/10 file:text-foreground hover:file:bg-white/20"
              />
              {isUploading && <p className="text-[10px] text-violet-400 mt-1 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin"/> Uploading...</p>}
              {screenshotUrl && <p className="text-[10px] text-emerald-400 mt-1">✓ Screenshot attached</p>}
            </div>
          </div>
        </div>
      )}

      {/* CTA Button */}
      <Button
        onClick={handleCheckout}
        disabled={isProcessing || isUploading || loadingSettings}
        className="w-full h-11 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/20 gap-2"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            {paymentMethod === 'UPI' ? 'Verifying Submission...' : 'Simulating transaction...'}
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4" />
            {paymentMethod === 'UPI' ? 'Submit Payment Details' : `Pay $${finalAmount} ${currency}`}
          </>
        )}
      </Button>

      <div className="flex items-center gap-1.5 justify-center text-[10px] text-muted-foreground pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Safe & Secure checkout powered by DAFT Arena Payments</span>
      </div>
    </WidgetContainer>
  );
}
