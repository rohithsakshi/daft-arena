import { connectDB } from '../../../lib/mongodb';
import { OfficialCertificationRepository } from '../repositories/OfficialCertificationRepository';
import { IOfficialCertification } from '../models/OfficialCertification';
import { auditService } from '../../iam/services/audit.service';

export class OfficialCertificationService {
  constructor(private readonly certRepo: OfficialCertificationRepository) {}

  async issueCertification(data: Partial<IOfficialCertification>, issuedBy: string): Promise<IOfficialCertification> {
    await connectDB();
    const cert = await this.certRepo.create({ ...data, createdBy: issuedBy });
    await auditService.logAction({
      actorId: issuedBy, action: 'CERTIFICATION_ISSUED', entityId: cert.id, entityType: 'OfficialCertification'
    });
    return cert;
  }
}
