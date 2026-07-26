import mongoose, { Model } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';

export interface IAuditLog extends IBaseDocument {
  action: string;
  entityId: string;
  entityType: string;
  performedBy: string;
  metadata?: any;
}

const AuditLogSchema = createBaseSchema({
  action: { type: String, required: true },
  entityId: { type: String, required: true, index: true },
  entityType: { type: String, required: true },
  performedBy: { type: String, required: true, index: true },
  metadata: { type: mongoose.Schema.Types.Mixed }
});

export const AuditLogModel: Model<IAuditLog> = mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
