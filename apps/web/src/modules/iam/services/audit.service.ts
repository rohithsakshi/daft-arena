import { AuditRepository } from '../repositories/audit.repository';

export class AuditService {
  constructor(private auditRepository: AuditRepository) {}

  async logAction(params: {
    actorId?: string;
    targetId?: string;
    action: string;
    ipAddress?: string;
    metadata?: any;
  }) {
    return this.auditRepository.create({
      actorId: params.actorId,
      targetId: params.targetId,
      action: params.action,
      ipAddress: params.ipAddress,
      metadata: params.metadata ? JSON.stringify(params.metadata) : undefined,
    });
  }
}
