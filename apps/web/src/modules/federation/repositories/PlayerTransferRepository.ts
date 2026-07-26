import { BaseRepository, PaginateOptions, PaginatedResult } from '../../../lib/db/BaseRepository';
import { PlayerTransferModel, IPlayerTransfer, TransferStatus } from '../models/PlayerTransfer';

export class PlayerTransferRepository extends BaseRepository<IPlayerTransfer> {
  constructor() {
    super(PlayerTransferModel);
  }

  async findByPlayer(playerId: string): Promise<IPlayerTransfer[]> {
    return this.findMany({ playerId }, { sort: { requestedAt: -1 } });
  }

  async findByFederation(
    federationId: string,
    options: PaginateOptions = {}
  ): Promise<PaginatedResult<IPlayerTransfer>> {
    return this.paginate({ federationId }, { ...options, sort: { requestedAt: -1 } });
  }

  async findPending(federationId: string): Promise<IPlayerTransfer[]> {
    return this.findMany({ federationId, status: 'Pending' }, { sort: { requestedAt: 1 } });
  }

  async findByStatus(federationId: string, status: TransferStatus): Promise<IPlayerTransfer[]> {
    return this.findMany({ federationId, status });
  }

  async approve(id: string, approvedBy: string): Promise<IPlayerTransfer | null> {
    return this.update(id, {
      $set: { status: 'Approved', completedAt: new Date() },
    });
  }

  async reject(id: string, reason: string): Promise<IPlayerTransfer | null> {
    return this.update(id, {
      $set: { status: 'Rejected', notes: reason },
    });
  }
}
