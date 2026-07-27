import React from 'react';
import { CreditCard, CheckCircle2, XCircle, Calendar, Zap } from 'lucide-react';
import connectToDatabase from '@/lib/db/mongoose';
import { LicenseModel } from '@/modules/tenant/models/LicenseModel';
import { TenantModel } from '@/modules/tenant/models/TenantModel';

export const dynamic = 'force-dynamic';

export default async function SubscriptionsPage() {
  await connectToDatabase();
  
  // Ensure models are registered
  TenantModel.schema; 
  
  const licenses = await LicenseModel.find()
    .populate('tenantId', 'name')
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Subscriptions & Licenses</h1>
        <p className="text-muted-foreground">Manage active SAAS licenses and billing plans.</p>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-400 bg-zinc-900/50 uppercase border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Organization</th>
                <th className="px-6 py-4 font-medium">License Key</th>
                <th className="px-6 py-4 font-medium">Plan Type</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Validity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {licenses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    No subscriptions found.
                  </td>
                </tr>
              ) : (
                licenses.map((license: any) => (
                  <tr key={license._id.toString()} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-800 rounded-lg">
                          <CreditCard className="w-4 h-4 text-zinc-300" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">{license.tenantId?.name || 'Unknown Tenant'}</div>
                          <div className="text-xs text-zinc-500">ID: {license.tenantId?._id?.toString() || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
                        {license.licenseKey?.substring(0, 16)}...
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span className="font-medium text-white capitalize">{license.planType}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {license.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-500/10 text-rose-400 text-xs rounded-full border border-rose-500/20">
                          <XCircle className="w-3.5 h-3.5" />
                          Expired
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-xs">
                        <div className="flex items-center gap-1.5 text-zinc-300">
                          <Calendar className="w-3 h-3 text-zinc-500" />
                          <span className="text-zinc-500">Starts:</span> {new Date(license.validFrom).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1.5 text-zinc-300">
                          <Calendar className="w-3 h-3 text-zinc-500" />
                          <span className="text-zinc-500">Ends:</span> {new Date(license.validUntil).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
