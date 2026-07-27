import React from 'react';
import { Building2, CheckCircle2, XCircle, Clock } from 'lucide-react';
import connectToDatabase from '@/lib/db/mongoose';
import { TenantModel } from '@/modules/tenant/models/TenantModel';

export const dynamic = 'force-dynamic';

export default async function OrganizationsPage() {
  await connectToDatabase();
  
  const orgs = await TenantModel.find().sort({ createdAt: -1 }).lean();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Organizations</h1>
        <p className="text-muted-foreground">Manage multi-tenant organizations on DAFT Arena.</p>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-400 bg-zinc-900/50 uppercase border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Organization Name</th>
                <th className="px-6 py-4 font-medium">Domain / Subdomain</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orgs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    No organizations found.
                  </td>
                </tr>
              ) : (
                orgs.map((org: any) => (
                  <tr key={org._id.toString()} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-800 rounded-lg">
                          <Building2 className="w-4 h-4 text-zinc-300" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">{org.name}</div>
                          <div className="text-xs text-zinc-500">ID: {org._id.toString()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-zinc-300">{org.customDomain || org.subdomain || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-zinc-800 text-zinc-300 text-xs rounded-full capitalize">
                        {org.type?.toLowerCase() || 'Standard'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {org.status === 'ACTIVE' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-500/10 text-rose-400 text-xs rounded-full border border-rose-500/20">
                          <XCircle className="w-3.5 h-3.5" />
                          {org.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-zinc-400">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(org.createdAt || Date.now()).toLocaleDateString()}
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
