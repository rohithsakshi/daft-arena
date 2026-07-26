import { BaseRepository, PaginateOptions, PaginatedResult } from '../../../lib/db/BaseRepository';
import { OfficialCertificationModel, IOfficialCertification } from '../models/OfficialCertification';

export class OfficialCertificationRepository extends BaseRepository<IOfficialCertification> {
  constructor() {
    super(OfficialCertificationModel);
  }

  async findByUser(userId: string): Promise<IOfficialCertification[]> {
    return this.findMany({ userId }, { sort: { issuedDate: -1 } });
  }

  async findByFederation(
    federationId: string,
    options: PaginateOptions = {}
  ): Promise<PaginatedResult<IOfficialCertification>> {
    return this.paginate({ federationId }, options);
  }

  async findExpiringSoon(federationId: string, daysAhead: number): Promise<IOfficialCertification[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + daysAhead);
    return this.findMany({
      federationId,
      status: 'Active',
      expiryDate: { $lte: cutoffDate, $gte: new Date() },
    });
  }

  async findActiveByCertNumber(
    certificationNumber: string
  ): Promise<IOfficialCertification | null> {
    return this.findOne({ certificationNumber, status: 'Active' });
  }

  async renew(id: string): Promise<IOfficialCertification | null> {
    const cert = await this.findById(id);
    if (!cert) return null;

    const newExpiry = new Date(cert.expiryDate);
    newExpiry.setFullYear(newExpiry.getFullYear() + 1);

    return this.update(id, {
      $set: { status: 'Active', renewedAt: new Date(), expiryDate: newExpiry },
    });
  }
}
