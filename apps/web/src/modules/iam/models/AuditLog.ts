import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';

export interface IAuditLog extends IBaseDocument {
  actorId?: string;
  targetId?: string;
  action: string;
  ipAddress?: string;
  metadata?: any;
  timestamp: Date;
}

const AuditLogSchema = createBaseSchema({
  actorId: { type: Schema.Types.ObjectId, index: true },
  targetId: { type: Schema.Types.ObjectId, index: true },
  action: { type: String, required: true, index: true },
  ipAddress: { type: String },
  metadata: { type: Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now, index: true }
});

export const AuditLogModel: Model<IAuditLog> = mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
