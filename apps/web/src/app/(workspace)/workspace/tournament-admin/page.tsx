import React from 'react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { LayoutDashboard, Trophy, Users, AlertCircle, Clock } from 'lucide-react';
import { WidgetContainer } from '@/components/shared/WidgetContainer';
import connectToDatabase from '@/lib/db/mongoose';
import { TournamentModel } from '@/modules/tournaments/models/Tournament';
import { UserModel } from '@/modules/iam/models/User';
import { TenantModel } from '@/modules/tenant/models/TenantModel';
import { RegistrationModel } from '@/modules/tournaments/models/Registration';
import { RegistrationStatus } from '@/modules/core/enums';
import { headers } from 'next/headers';
import Link from 'next/link';

export const metadata = {
  title: 'Tournament Admin Dashboard | DAFT Arena',
  description: 'Manage your organization and tournaments.',
};

export const dynamic = 'force-dynamic';

export default async function AdminAdministratorDashboardPage() {
  await connectToDatabase();
  
  const headersList = await headers();
  const userId = headersList.get('x-user-id');
  
  const adminUser = await UserModel.findById(userId);
  const tenantId = adminUser?.tenantId;
  
  let tenant = null;
  let tournamentCount = 0;
  let playerApprovals = 0;
  let daysRemaining = 0;

  if (tenantId) {
    tenant = await TenantModel.findById(tenantId);
    
    // Fetch all tournaments under this tenant to count registrations
    const tournaments = await TournamentModel.find({ organizationId: tenantId }).select('_id');
    const tournamentIds = tournaments.map(t => t._id);
    
    tournamentCount = tournamentIds.length;
    // Simulate active players count from approved registrations
    playerApprovals = await RegistrationModel.countDocuments({ tournamentId: { $in: tournamentIds }, status: RegistrationStatus.Approved });
    
    const pendingCount = await RegistrationModel.countDocuments({ tournamentId: { $in: tournamentIds }, status: RegistrationStatus.Pending });
    
    if (tenant?.expiryDate) {
      daysRemaining = Math.ceil((new Date(tenant.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    }
  } else {
    // If no tenantId is mapped yet, let's just get global tournament counts for the seeded admin user
    const tournaments = await TournamentModel.find({}).select('_id');
    const tournamentIds = tournaments.map(t => t._id);
    tournamentCount = tournamentIds.length;
    playerApprovals = await RegistrationModel.countDocuments({ status: RegistrationStatus.Approved });
    
    const pendingCount = await RegistrationModel.countDocuments({ status: RegistrationStatus.Pending });
  }

  const pendingApprovalsCount = tenantId 
    ? await RegistrationModel.countDocuments({ tournamentId: { $in: (await TournamentModel.find({ organizationId: tenantId }).select('_id')).map(t => t._id) }, status: RegistrationStatus.Pending })
    : await RegistrationModel.countDocuments({ status: RegistrationStatus.Pending });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 max-w-6xl">
      <SectionHeader
        title={`Welcome, ${tenant?.name || 'Administrator'}`}
        description="Central command center for your organization's tournaments."
        icon={LayoutDashboard}
        titleSize="xl"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <WidgetContainer className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Tournaments</p>
              <h4 className="text-2xl font-bold">{tournamentCount}</h4>
            </div>
          </div>
        </WidgetContainer>

        <WidgetContainer className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-violet-500/10 rounded-xl text-violet-500">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Registered Players</p>
              <h4 className="text-2xl font-bold">{playerApprovals}</h4>
            </div>
          </div>
        </WidgetContainer>

        <WidgetContainer className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Approvals</p>
              <h4 className="text-2xl font-bold">{pendingApprovalsCount}</h4>
            </div>
          </div>
        </WidgetContainer>

        <WidgetContainer className="p-6 border-emerald-500/20 bg-emerald-500/5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-emerald-400/80">Subscription</p>
              <h4 className="text-2xl font-bold text-emerald-400">{daysRemaining} Days</h4>
            </div>
          </div>
        </WidgetContainer>
      </div>

      <WidgetContainer className="p-12 text-center flex flex-col items-center justify-center border-dashed bg-card/10 mt-8">
        <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center mb-4">
          <LayoutDashboard className="w-8 h-8 text-violet-400 opacity-80" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-1">Quick Actions</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
          Manage your organization, create tournaments, or process payments directly from your command center.
        </p>
        <div className="flex gap-4">
          <Link href="/workspace/tournaments/new" className="px-6 py-2 bg-violet-500 hover:bg-violet-600 text-white font-medium rounded-xl transition-colors">
            Create Tournament
          </Link>
          <Link href="/workspace/tournaments" className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl transition-colors">
            View Tournaments
          </Link>
        </div>
      </WidgetContainer>
    </div>
  );
}
