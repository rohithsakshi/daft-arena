import connectToDatabase from '@/lib/db/mongoose';
import { AuditLogModel } from '../models/AuditLog';

export class AuditService {
  static async log(params: {
    action: string;
    actorId?: string;
    targetId?: string;
    tenantId?: string;
    details?: Record<string, any>;
    ipAddress?: string;
  }) {
    try {
      await connectToDatabase();
      await AuditLogModel.create(params);
      console.log(`[Audit] ${params.action} logged.`);
    } catch (error) {
      console.error('[AuditService] Failed to log action:', error);
    }
  }
}
