import { BaseRepository } from '../../../lib/db/BaseRepository';
import { TenantModel, ITenant } from '../models/TenantModel';

export class TenantRepository extends BaseRepository<ITenant> {
  constructor() {
    super(TenantModel);
  }

  async findByDomain(domain: string): Promise<ITenant | null> {
    return this.findOne({ domain, isActive: true });
  }
}
