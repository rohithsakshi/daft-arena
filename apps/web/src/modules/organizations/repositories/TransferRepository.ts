import { ITransfer } from '../models';
import { TransferModel } from '../models/TransferModel';
import { UserModel } from '@/modules/iam/models/User';
import { TenantModel } from '@/modules/tenant/models/TenantModel';
import connectToDatabase from '@/lib/db/mongoose';

export class TransferRepository {

  async findByOrganization(orgId: string): Promise<any[]> {
    await connectToDatabase();
    try {
      // Find all transfers involving this organization
      const transfers = await TransferModel.find({
        $or: [
          { fromOrgId: orgId },
          { toOrgId: orgId }
        ]
      }).sort({ createdAt: -1 });

      const populatedTransfers = [];
      for (const t of transfers) {
        // Fetch player name
        const player = await UserModel.findById(t.playerId);
        // Fetch from org name
        let fromOrgName = 'Free Agent';
        if (t.fromOrgId) {
          const fromOrg = await TenantModel.findById(t.fromOrgId);
          if (fromOrg) fromOrgName = fromOrg.name;
        }
        // Fetch to org name
        let toOrgName = 'Unknown';
        const toOrg = await TenantModel.findById(t.toOrgId);
        if (toOrg) toOrgName = toOrg.name;

        populatedTransfers.push({
          id: t._id.toString(),
          playerId: t.playerId,
          playerName: player?.name || player?.email || 'Unknown Player',
          playerEmail: player?.email || '',
          fromOrgId: t.fromOrgId,
          fromOrgName,
          toOrgId: t.toOrgId,
          toOrgName,
          status: t.status,
          effectiveDate: t.effectiveDate.toISOString(),
          reason: t.reason,
          createdAt: t.createdAt?.toISOString() || new Date().toISOString()
        });
      }
      return populatedTransfers;
    } catch {
      return [];
    }
  }

  async create(data: Partial<ITransfer>): Promise<any> {
    await connectToDatabase();
    const doc = await TransferModel.create({
      playerId: data.playerId,
      fromOrgId: data.fromOrgId,
      toOrgId: data.toOrgId,
      status: 'Pending',
      effectiveDate: data.effectiveDate ? new Date(data.effectiveDate) : new Date(),
      reason: data.reason
    });
    return doc;
  }

  async updateStatus(id: string, status: 'Approved' | 'Rejected'): Promise<any> {
    await connectToDatabase();
    const t = await TransferModel.findByIdAndUpdate(id, { status }, { new: true });
    
    // If approved, we need to update the player/user's tenantId (organization membership)!
    if (t && status === 'Approved') {
      await UserModel.findByIdAndUpdate(t.playerId, { tenantId: t.toOrgId });
    }
    return t;
  }
}
