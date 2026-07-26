import { AuditLogRepository } from '../repositories/audit.repository';

export class AuditService {
  private repo = new AuditLogRepository();

  async log(action: string, entityId: string, entityType: string, performedBy: string, metadata?: any) {
    try {
      await this.repo.create({
        action,
        entityId,
        entityType,
        performedBy,
        metadata
      });
    } catch (e) {
      console.error('Audit Log failed:', e);
    }
  }
}

export const auditService = new AuditService();
