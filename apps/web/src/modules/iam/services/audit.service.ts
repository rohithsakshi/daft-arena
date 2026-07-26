// @ts-nocheck
import { AuditRepository } from '../repositories/audit.repository';

export class AuditService {
  constructor(private auditRepository: AuditRepository) {}

  async logAction(params: {
    actorId?: string;
    targetId?: string;
    entityId?: string;
    entityType?: string;
    action: string;
    ipAddress?: string;
    metadata?: Record<string, unknown>;
  }) {
    return this.auditRepository.create({
      actorId: params.actorId,
      targetId: params.targetId || params.entityId,
      action: params.action,
      ipAddress: params.ipAddress,
      metadata: { ...params.metadata, entityType: params.entityType },
    });
  }
}

export const auditService = new AuditService(new AuditRepository());
