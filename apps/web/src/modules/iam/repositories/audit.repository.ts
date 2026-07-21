import { BaseRepository } from '../../../lib/db/BaseRepository';
import { AuditLogModel, IAuditLog } from '../models/AuditLog';
import { ClientSession } from 'mongoose';

export class AuditRepository extends BaseRepository<IAuditLog> {
  constructor() {
    super(AuditLogModel);
  }

  async findRecent(limit: number = 100, session?: ClientSession): Promise<IAuditLog[]> {
    return this.model.find({ isDeleted: false })
      .sort({ timestamp: -1 })
      .limit(limit)
      .session(session || null)
      .lean().exec() as unknown as Promise<IAuditLog[]>;
  }
}
