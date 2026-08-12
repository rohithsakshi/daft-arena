'use client';

import React, { useState } from 'react';
import { 
  Ticket, 
  Plus, 
  Trash2, 
  Calendar,
  Percent,
  PlusCircle,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Link from 'next/link';

export default function CouponsDiscountsPage() {
  const [coupons, setCoupons] = useState<any[]>([
    { id: '1', code: 'EARLYBIRD20', type: 'Percentage', value: 20, status: 'Active', expiry: '2026-09-30' },
    { id: '2', code: 'FREENTRY', type: 'Percentage', value: 100, status: 'Active', expiry: '2026-12-31' },
    { id: '3', code: 'FLAT500', type: 'Fixed Amount', value: 500, status: 'Expired', expiry: '2026-08-01' }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newType, setNewType] = useState('Percentage');
  const [newValue, setNewValue] = useState('');
  const [newExpiry, setNewExpiry] = useState('');

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newValue || !newExpiry) {
      toast.error('Please fill in all coupon fields.');
      return;
    }

    const newCoupon = {
      id: Date.now().toString(),
      code: newCode.toUpperCase().trim(),
      type: newType,
      value: Number(newValue),
      status: 'Active',
      expiry: newExpiry
    };

    setCoupons(prev => [newCoupon, ...prev]);
    toast.success(`Coupon ${newCoupon.code} created!`);
    setNewCode('');
    setNewValue('');
    setNewExpiry('');
    setShowAddForm(false);
  };

  const handleDeleteCoupon = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
    toast.success('Coupon discount deleted.');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-10 text-left max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
            <Ticket className="w-8 h-8 text-primary" /> Coupons & Discounts
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Configure discount codes, percentages, and eligibility rules.</p>
        </div>
        <div className="flex gap-2">
          {!showAddForm && (
            <Button onClick={() => setShowAddForm(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <PlusCircle className="w-4 h-4 mr-2" /> Add Coupon
            </Button>
          )}
          <Link href="/workspace/finance">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-muted/30 p-6 rounded-2xl border border-primary/20 max-w-lg animate-in slide-in-from-top duration-200">
          <div className="flex justify-between items-center mb-4 border-b border-border pb-2">
            <h4 className="font-bold text-foreground">Create New Promo Code</h4>
            <button onClick={() => setShowAddForm(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleCreateCoupon} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Promo Code</label>
                <Input 
                  placeholder="e.g. MONSOON30"
                  value={newCode}
                  onChange={e => setNewCode(e.target.value)}
                  className="bg-background focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Discount Type</label>
                <select
                  value={newType}
                  onChange={e => setNewType(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Percentage">Percentage (%)</option>
                  <option value="Fixed Amount">Fixed Amount (₹)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Value</label>
                <Input 
                  type="number"
                  placeholder="e.g. 30"
                  value={newValue}
                  onChange={e => setNewValue(e.target.value)}
                  className="bg-background focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Expiry Date</label>
                <Input 
                  type="date"
                  value={newExpiry}
                  onChange={e => setNewExpiry(e.target.value)}
                  className="bg-background focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Create Coupon
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map(coupon => (
          <div key={coupon.id} className="p-5 rounded-2xl border border-border bg-card hover:border-primary/10 transition-colors flex flex-col justify-between h-40">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-lg text-primary tracking-wider">{coupon.code}</h4>
                  <span className="text-xs text-muted-foreground mt-1 block">
                    {coupon.type === 'Percentage' ? `${coupon.value}% Off` : `₹${coupon.value} Off`}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    coupon.status === 'Active' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                  }`}>
                    {coupon.status}
                  </span>
                  <button 
                    onClick={() => handleDeleteCoupon(coupon.id)} 
                    className="p-1 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                    title="Delete Coupon"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
            <div className="border-t border-border pt-3 mt-3 flex justify-between items-center text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Expires: {new Date(coupon.expiry).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
