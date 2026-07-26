import { BaseRepository, PaginateOptions, PaginatedResult } from '../../../lib/db/BaseRepository';
import { SeasonModel, ISeason, SeasonStatus } from '../models/Season';

export class SeasonRepository extends BaseRepository<ISeason> {
  constructor() {
    super(SeasonModel);
  }

  async findByFederation(federationId: string): Promise<ISeason[]> {
    return this.findMany({ federationId }, { sort: { startDate: -1 } });
  }

  async findActiveSeason(federationId: string, sportId: string): Promise<ISeason | null> {
    return this.findOne({ federationId, sportId, status: 'Active' });
  }

  async findByStatus(federationId: string, status: SeasonStatus): Promise<ISeason[]> {
    return this.findMany({ federationId, status });
  }

  async closeSeason(id: string, closedBy: string): Promise<ISeason | null> {
    return this.update(id, {
      $set: { status: 'Closed', closedAt: new Date(), closedBy },
    });
  }

  async paginateByFederation(
    federationId: string,
    options: PaginateOptions = {}
  ): Promise<PaginatedResult<ISeason>> {
    return this.paginate({ federationId }, { ...options, sort: { startDate: -1 } });
  }
}
