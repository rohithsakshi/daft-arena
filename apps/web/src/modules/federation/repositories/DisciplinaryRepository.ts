import { BaseRepository, PaginateOptions, PaginatedResult } from '../../../lib/db/BaseRepository';
import { DisciplinaryRecordModel, IDisciplinaryRecord } from '../models/DisciplinaryRecord';

export class DisciplinaryRepository extends BaseRepository<IDisciplinaryRecord> {
  constructor() {
    super(DisciplinaryRecordModel);
  }

  async findByPlayer(playerId: string): Promise<IDisciplinaryRecord[]> {
    return this.findMany({ playerId }, { sort: { issuedAt: -1 } });
  }

  async findActiveByPlayer(playerId: string): Promise<IDisciplinaryRecord[]> {
    return this.findMany({ playerId, status: 'Active' });
  }

  async findByFederation(
    federationId: string,
    options: PaginateOptions = {}
  ): Promise<PaginatedResult<IDisciplinaryRecord>> {
    return this.paginate({ federationId }, { ...options, sort: { issuedAt: -1 } });
  }

  async isPlayerSuspended(playerId: string): Promise<boolean> {
    const now = new Date();
    const suspension = await this.findOne({
      playerId,
      actionType: { $in: ['Suspension', 'Ban', 'Blacklist'] },
      status: 'Active',
      suspensionEndDate: { $gte: now },
    });
    return suspension !== null;
  }

  async isPlayerBlacklisted(playerId: string, federationId: string): Promise<boolean> {
    const blacklist = await this.findOne({
      playerId,
      federationId,
      actionType: 'Blacklist',
      status: 'Active',
    });
    return blacklist !== null;
  }
}
