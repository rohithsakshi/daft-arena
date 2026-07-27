import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';

export interface IAuditLog extends IBaseDocument {
  action: string;
  actorId?: string | mongoose.Types.ObjectId; // Could be system, so optional
  targetId?: string | mongoose.Types.ObjectId;
  tenantId?: string | mongoose.Types.ObjectId;
  details?: Record<string, any>;
  ipAddress?: string;
}

const AuditLogSchema = createBaseSchema({
  action: { type: String, required: true, index: true },
  actorId: { type: Schema.Types.ObjectId, ref: 'User' },
  targetId: { type: Schema.Types.ObjectId },
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', index: true },
  details: { type: Schema.Types.Mixed },
  ipAddress: { type: String },
});

export const AuditLogModel: Model<IAuditLog> = 
  mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
