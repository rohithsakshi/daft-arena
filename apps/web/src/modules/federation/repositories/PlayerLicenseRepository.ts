import { BaseRepository, PaginateOptions, PaginatedResult } from '../../../lib/db/BaseRepository';
import { PlayerLicenseModel, IPlayerLicense, LicenseStatus } from '../models/PlayerLicense';

export class PlayerLicenseRepository extends BaseRepository<IPlayerLicense> {
  constructor() {
    super(PlayerLicenseModel);
  }

  async findByPlayer(playerId: string): Promise<IPlayerLicense[]> {
    return this.findMany({ playerId }, { sort: { issuedDate: -1 } });
  }

  async findByFederation(
    federationId: string,
    options: PaginateOptions = {}
  ): Promise<PaginatedResult<IPlayerLicense>> {
    return this.paginate({ federationId }, options);
  }

  async findActiveByPlayer(playerId: string, federationId: string): Promise<IPlayerLicense | null> {
    return this.findOne({ playerId, federationId, status: 'Active' });
  }

  async findExpiringSoon(federationId: string, daysAhead: number): Promise<IPlayerLicense[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + daysAhead);
    return this.findMany({
      federationId,
      status: 'Active',
      expiryDate: { $lte: cutoffDate, $gte: new Date() },
    });
  }

  async findByStatus(federationId: string, status: LicenseStatus): Promise<IPlayerLicense[]> {
    return this.findMany({ federationId, status });
  }

  async updateStatus(id: string, status: LicenseStatus, reason?: string): Promise<IPlayerLicense | null> {
    return this.update(id, {
      $set: {
        status,
        ...(reason ? { suspensionReason: reason } : {}),
        ...(status === 'Active' ? { renewedAt: new Date() } : {}),
      },
    });
  }
}
