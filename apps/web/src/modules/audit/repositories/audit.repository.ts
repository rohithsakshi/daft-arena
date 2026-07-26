import { BaseRepository } from '../../../lib/db/BaseRepository';
import { AuditLogModel, IAuditLog } from '../models/AuditLog.schema';

export class AuditLogRepository extends BaseRepository<IAuditLog> {
  constructor() {
    super(AuditLogModel);
  }
}
