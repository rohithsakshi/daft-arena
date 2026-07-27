import { BaseRepository } from '../../../lib/db/BaseRepository';
import { LicenseModel, ILicense } from '../models/LicenseModel';

export class LicenseRepository extends BaseRepository<ILicense> {
  constructor() {
    super(LicenseModel);
  }

  async findActiveLicenseForTenant(tenantId: string): Promise<ILicense | null> {
    const now = new Date();
    return this.findOne({ 
      tenantId, 
      isActive: true,
      validFrom: { $lte: now },
      validUntil: { $gte: now }
    });
  }
}
