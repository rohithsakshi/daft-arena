import React from 'react';
import { Users, Mail, Shield, CheckCircle2, XCircle, Clock } from 'lucide-react';
import connectToDatabase from '@/lib/db/mongoose';
import { UserModel } from '@/modules/iam/models/User';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  await connectToDatabase();
  
  const users = await UserModel.find().select('-hashedPassword').sort({ createdAt: -1 }).lean();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Platform Users</h1>
        <p className="text-muted-foreground">Manage all authenticated users across the DAFT Arena ecosystem.</p>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-400 bg-zinc-900/50 uppercase border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">User / Email</th>
                <th className="px-6 py-4 font-medium">System Role</th>
                <th className="px-6 py-4 font-medium">Email Verified</th>
                <th className="px-6 py-4 font-medium">Onboarding</th>
                <th className="px-6 py-4 font-medium">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user: any) => (
                  <tr key={user._id.toString()} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-800 rounded-full">
                          <Users className="w-4 h-4 text-zinc-300" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">{user.name || 'Anonymous User'}</div>
                          <div className="text-xs text-zinc-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <Shield className={`w-3.5 h-3.5 ${user.systemRole === 'SUPERADMIN' ? 'text-rose-500' : 'text-violet-500'}`} />
                        <span className="font-medium text-white">{user.systemRole || 'PLAYER'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.emailVerified ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-400 text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-amber-500 text-xs">
                          <XCircle className="w-3.5 h-3.5" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.onboardingCompleted ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-full border border-emerald-500/20">
                          Complete
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 text-amber-400 text-xs rounded-full border border-amber-500/20">
                          Incomplete
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-zinc-400">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(user.createdAt || Date.now()).toLocaleDateString()}
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
